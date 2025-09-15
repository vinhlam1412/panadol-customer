import React, { useEffect, useState, useRef } from 'react';
import { Button, Page, Spinner, Box, Picker } from 'zmp-ui';
import MainHeader from '../components/main-header';
import { QRCodeSVG } from 'qrcode.react';
import { getAccessToken } from 'zmp-sdk/apis';
import MainBottomNavigation from '../components/bottom-navigation';

const ProductDropdown = ({ value, onChange, products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const panelRef = useRef(null);

  const selectedProduct = products.find(p => p.id === value);
  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative zaui-input-affix-wrapper zaui-input-affix-wrapper-readonly zaui-picker-input"
         ref={dropdownRef}>
      {/* Input display */}
      <div
        className="w-full p-2 border rounded flex items-center justify-between bg-white cursor-pointer zaui-input zaui-picker-input"
        onClick={() => setIsOpen(!isOpen)} // Toggles the dropdown open/close state
      >
        <span className="truncate">
          {selectedProduct ? selectedProduct.name : 'Chọn sản phẩm'}
        </span>
        <svg
          width="13"
          height="7"
          viewBox="0 0 13 7"
          fill="none"
          className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M1 1C1 1 5.97619 6 6.5 6C7.02381 6 12 1 12 1" stroke="#17A049" strokeWidth="2"
                strokeLinecap="round" />
        </svg>
      </div>

      {/* Dropdown panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40">
          <div
            ref={panelRef}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] flex flex-col transition-transform"

          >
            {/* Swipe indicator */}
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto my-2" />

            {/* Header */}
            <div className="p-4 flex justify-between items-center">
              <h3 className="text-lg flex-fill text-primary font-semibold">Sản phẩm</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2"
              >
                ✕
              </button>
            </div>

            {/* Search input */}
            <div className="p-4 border-b">
              <input
                type="text"
                className="w-full p-2 border rounded"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
            </div>

            {/* Options list */}
            <div className="overflow-y-auto flex-1 ">
              {filteredProducts.length > 0 ? (
                filteredProducts.map(product => (
                  <div
                    key={product.id}
                    className={`p-4 text-center border-b cursor-pointer active:bg-gray-100
                      ${product.id === value ? 'bg-gray-50 font-semibold' : ''}`}
                    onClick={() => {
                      onChange(product.id);
                      // Do not close the dropdown here
                    }}
                  >
                    {product.name}
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">
                  Không tìm thấy sản phẩm
                </div>
              )}

              {/* "Chọn" button at the end of the list */}

            </div>
            <div
              className="p-4 text-center text-primary cursor-pointer pb-20 w-full"
              onClick={() => {
                setIsOpen(false);
                setSearchTerm('');
              }} // Close the dropdown when "Chọn" is clicked
            >
              <button className="flex-1 w-full rounded-full bg-primary text-white py-3 px-4 hover:bg-green-600 focus:outline-none">
                Chọn
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
};



const RewardPage = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [campaign, setCampaign] = useState();
  const [products, setProducts] = useState([]);
  const [productState, setProductState] = useState([null]);
  const [productValueState, setProductValueState] = useState([0]);
  const [totalSpinCount, setTotalSpinCount] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(undefined);
  const [gift, setGift] = useState(undefined);

  const formattedAmount = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  });

  const mergedProducts = productState.reduce((acc, productId, index) => {
    // Find if the productId already exists in the accumulator
    const existingProduct = acc.find(item => item.ProductId === productId);

    if (existingProduct) {
      // If the product already exists, add the quantity
      existingProduct.Quantity += productValueState[index];
    } else {
      // If it's a new productId, add it to the accumulator
      acc.push({
        ProductId: productId,
        Quantity: productValueState[index],
      });
    }

    return acc;
  }, []);

  const handleCheckGift = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Campaign/SpinCount`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mergedProducts),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaign data');
      }
      const data = await response.json();

      setGift(data?.giftDto);  // Store the response data in state
      setShowModal(true);
    } catch (error) {

    } finally {
      setIsLoading(false);  // Set loading to false after the fetch completes
    }
  };

  const handleCreateRewardOrder = async () => {
    await getAccessToken({
      success: async (accessToken) => {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Campaign/CreateRewardOrder`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              'AccessToken': accessToken,
              'Products': mergedProducts,
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to fetch campaign data');
          }
          const data = await response.json();

          setShowSuccessModal(data);  // Store the response data in state
        } catch (error) {

        } finally {
          setIsLoading(false);  // Set loading to false after the fetch completes
        }
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchCampaignData = async () => {

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Campaign/active`, {
          headers: {
            'ngrok-skip-browser-warning': true,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch campaign data');
        }
        const data = await response.json();

        setCampaign(data);  // Store the response data in state
      } catch (error) {
        //TODO if no campaign return to not found page
      } finally {
        setIsLoading(false);  // Set loading to false after the fetch completes
      }
    };

    const fetchProductData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Campaign/products`, {
          headers: {
            'ngrok-skip-browser-warning': true,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch campaign data');
        }
        const data = await response.json();
        setProducts(data);  // Store the response data in state
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);  // Set loading to false after the fetch completes
      }
    };

    fetchCampaignData();  // Call the function when the component mounts
    fetchProductData();
    getAccessToken({
      success: async (accessToken) => {
        console.log('Access Token:', accessToken);
      }
    });
    }, []);

  if (isLoading) {
    return <Page className="page text-center !p-0 !m-0">
      <Box
        mt={6}
        flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner visible logo={undefined} />
      </Box>
    </Page>;
  }

  const displayPrice = (productId, totalItems) => {
    const product = products?.find((product) => product.id === productId);
    return (product?.unitPrice ?? 0) * (totalItems ?? 0);
  };
  const sumProduct = productValueState.map((item, i) => displayPrice(productState[i], item));

  if (showSuccessModal) {
    const gift = Array.isArray(showSuccessModal.giftItems) && showSuccessModal.giftItems.length > 0 ? showSuccessModal.giftItems[0] : null;
    return (
      <Page className="page !p-0 bg-white">
        <MainHeader title="QR Code" />
        <div className="bg-white">
          <p className="qr-code-title text-center my-4">
            <h5>
              Đơn hàng <span className="text-primary font-bold font-20">{showSuccessModal.orderId}</span> đã nhận được:
            </h5>
          </p>
          {/* Gift Display */}
          {gift ? (
            <div className="flex flex-col items-center gap-6 mb-6">
              <div className="flex flex-col items-center border p-6 rounded-2xl w-full max-w-lg bg-gray-50 shadow-lg">
                <img
                  src={gift.imageUrl ? `${import.meta.env.VITE_API_URL}${gift.imageUrl}` : '/default-image.png'}
                  alt={gift.name || 'Gift'}
                  className="w-40 h-40 object-contain rounded-xl border mb-4"
                  style={{ background: '#f9f9f9' }}
                  onError={e => { e.target.src = '/default-image.png'; }}
                />
                <div className="font-bold text-2xl text-primary mb-2 text-center">{gift.name || 'Không rõ tên'}</div>
                <div className="text-gray-700 text-lg">Số lượng: <span className="font-bold text-xl">{gift.quantity ?? 0}</span></div>
              </div>
            </div>
          ) : (
            <p className="text-gray-700 mb-6 text-center">Không có phần thưởng nào.</p>
          )}
        </div>
        <div className="text-right cursor-pointer">
          <span onClick={() => {
            setShowSuccessModal(undefined);
            setShowModal(false);
          }} className={'text-primary font-bold mr-5'}>Trở về</span>
        </div>
      </Page>
    );
  }

  return (
    <Page className="page !p-0 bg-white">
      <MainHeader title="Phần thưởng" />

      <div className={'px-2'}>
        <div className="flex py-3 mt-4 text-center" style={{ background: '#A2A1A833' }}>
          <div className="flex-1 product-wrapper pr-3">
            <div>Sản phẩm</div>
          </div>
          <div className={'w-24'}>Số lượng</div>
          <div className={'w-24'}>Thành tiền</div>
        </div>
      </div>
      {productState.map((item, index) => (<div key={item?.value}>
        <div className={'px-2'}>
          <div className="grid grid-cols-5 border-b-1">
            <div className={`col-span-3 product-wrapper p-1 border border-r-0 ${index === productState?.length - 1 ? '' : 'border-b-0'}`}>
                <ProductDropdown
                  value={item}
                  onChange={(value) => {
                    setProductState(ps => ps.map((p, i) => i === index ? value : p));
                  }}
                  products={products}
                />
            </div>

            <div className={`border p-1 border-r-0 ${index === productState?.length - 1 ? '' : 'border-b-0'}`}>
              <Picker
                mask
                value={{ value: productValueState[index] }}
                defaultValue={{ value: productValueState[index] }}
                maskClosable
                defaultOpen={false}
                title="Số lượng"
                onChange={value => {
                  setProductValueState(ps => ps.map((p, i) => i === index ? value?.value?.value : p));
                }}
                action={{
                  text: 'Chọn',
                  close: true,
                }}
                data={[{
                  options: [...Array(100)].map((_, index) => index + 1).map(p => ({
                    value: p,
                    displayName: p,
                  })),
                  name: 'value',
                }]}
              />
            </div>
            <div className={`border flex p-1 ${index === productState?.length - 1 ? '' : 'border-b-0'}`}>
              <div className={'text-right items-center flex  justify-end rounded-md my-1 pe-2 ms-2 bg-white overflow-hidden'}>
                <div className="text-ellipsis whitespace-nowrap overflow-hidden w-full">
                  {formattedAmount.format(displayPrice(productState[index], productValueState[index]))}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>))}

      <div className={'px-2'}>
        <div className="flex p-3 mt-4 rounded-md" style={{ background: '#A2A1A833' }}>
          <div className="flex-1 product-wrapper pr-3 text-right text-primary font-bold">
            <div>Tổng đơn</div>
          </div>
          <div className={'w-24 text-right text-primary font-bold'}>{<div
            className={'w-24 text-end px-3'}>{productValueState?.reduce((accumulator, currentValue) => accumulator + currentValue, 0)}</div>}</div>
          <div className={'w-24 text-end ps-3  text-primary font-bold'}>{formattedAmount.format(sumProduct?.reduce((accumulator, currentValue) => accumulator + currentValue, 0))}</div>
        </div>
      </div>

      <div className="text-end py-2 me-2 my-5">
      <Button size={'small'} className={'btn text-primary text-white !rounded-md'} onClick={() => {
          setProductState(ps => [...ps, null]);
          setProductValueState(ps => [...ps, 1]);
        }}>
        <span className="text-white">
          + Thêm sản phẩm
        </span>
        </Button>
      </div>

      <div className="flex px-2 my-2">
        <Button onClick={() => handleCreateRewardOrder()} fullWidth className={'py-2 !rounded-md'}>Nhận thưởng</Button>
      </div>
      <div className="flex px-2 mt-2 mb-8 pb-8">
        <Button onClick={() => handleCheckGift()} fullWidth variant={'tertiary'}
                className={'py-2 !rounded-md text-primary border-primary  mb-10'}>Kiểm tra phần thưởng</Button>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />

      <div
        className={`fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 ${!showModal ? 'hidden' : ''}`}>
        <div className="bg-white rounded-lg shadow-lg w-96 p-6 mx-4">
          <div className="text-center">
            <h2 className="text-3xl text-primary font-bold mb-4">PHẦN THƯỞNG</h2>
           {Array.isArray(gift) && gift.length > 0 ? (
            <div className="mb-6 flex flex-col items-center gap-4">
              {gift.map((g) => (
                <div key={g.id} className="flex items-center gap-4 border p-2 rounded-md w-full">
                  <img
                    src={g.imageUrl ? `${import.meta.env.VITE_API_URL}${g.imageUrl}` : '/default-image.png'}
                    alt={g.name || 'Gift'}
                    className="w-16 h-16 object-contain rounded-md border"
                    style={{ background: '#f9f9f9' }}
                    onError={e => { e.target.src = '/default-image.png'; }}
                  />
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-lg text-primary">{g.name || 'Không rõ tên'}</div>
                    <div className="text-gray-700">Số lượng: <span className="font-bold">{g.quantity ?? 0}</span></div>
                  </div>
                </div>
              ))}
            </div>
            ) : (
              <p className="text-gray-700 mb-6">Không có phần thưởng nào.</p>
            )}
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowModal(false)} id="closeModal"
                      className="flex-1 text-primary border border-primary py-3 px-4 rounded-md focus:outline-none">
                Chỉnh sửa
              </button>                         
              {Array.isArray(gift) && gift.length > 0 && (
                <button onClick={() => handleCreateRewardOrder()}
                      className="flex-1 bg-primary text-white py-3 px-4 rounded-md hover:bg-green-600 focus:outline-none">
                  Nhận Thưởng
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      <MainBottomNavigation defaultActivate={'reward'} />
    </Page>
  );
};

export default RewardPage;