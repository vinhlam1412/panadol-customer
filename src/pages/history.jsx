import React, { useEffect, useState } from 'react';
import { Page, Input, Box, Spinner, useSnackbar } from 'zmp-ui';
import MainHeader from '../components/main-header';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';
import MainBottomNavigation from '../components/bottom-navigation';

const HistoryPage = (props) => {
  const { userInfo } = useRecoilValue(userState);
  const [loading, setLoading] = useState(false);
  const [historyEntries, setHistoryEntries] = useState([]);
  const zaloId = userInfo.id;
  const [showModal, setShowModal] = useState(false);
  const [modalGift, setModalGift] = useState();
  const { openSnackbar } = useSnackbar();

  const handleOpenGift = (history) => {
    setShowModal(true);
    setModalGift(history);
  };

  const getHistory = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/History/${zaloId}`, {
        headers: {
          'ngrok-skip-browser-warning': true,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch campaign data');
      }
      const data = await response.json();

      setHistoryEntries(data);  // Store the response data in state
    } catch (error) {
      //TODO if no campaign return to not found page
    } finally {
      setLoading(false);  // Set loading to false after the fetch completes
    }
  };

  const handleConfirmGift = async () => {
    if (!modalGift || !modalGift.id || !modalGift.giftId) {
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/History/Confirm/${modalGift.id}`, {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': true,
        },
      });

      if (!response.ok) {
        openSnackbar({
          text: "Không thể trao quà, vui lòng thử lại",
          type: "error",
        });
        throw new Error('Failed to fetch campaign data');
      }

      openSnackbar({
        text: "Trao quà thành công",
        type: "success",
      });
      getHistory();
      setShowModal(false);

    } catch (error) {
      //TODO if no campaign return to not found page
    } finally {
    }
  }

  useEffect(() => {
    getHistory();
  }, []);

  if (loading) {
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

  return (
    <Page className="page !p-0">
      <MainHeader title="Lịch sử trao quà" />
      <div className="wrapper bg-white p-3">
        <div className="input-wrapper flex items-center gap-3">
          <div className="search-wrapper flex-1">
            <Input
              affixWrapperClassName={'p-1'}
              placeholder="Tìm kiếm lịch sử"
              suffix={<div className={'mr-3'}>
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M3.5 12.8333C3.5 15.3087 4.48333 17.6827 6.23367 19.433C7.98401 21.1833 10.358 22.1667 12.8333 22.1667C15.3087 22.1667 17.6827 21.1833 19.433 19.433C21.1833 17.6827 22.1667 15.3087 22.1667 12.8333C22.1667 10.358 21.1833 7.98401 19.433 6.23367C17.6827 4.48333 15.3087 3.5 12.8333 3.5C10.358 3.5 7.98401 4.48333 6.23367 6.23367C4.48333 7.98401 3.5 10.358 3.5 12.8333Z"
                    stroke="#17A049" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M24.4998 24.4998L19.4248 19.4248" stroke="#17A049" strokeWidth="2" strokeLinecap="round"
                        strokeLinejoin="round" />
                </svg>
              </div>} size={'small'} className={'!rounded-full'} />
          </div>
          <div className={'filter-icon'}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="#17A049" />
              <rect x="0.5" y="0.5" width="39" height="39" rx="19.5" stroke="#17A049" />
              <path d="M11 14H18" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 20H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M27 20H29" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M22 14L29 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 26H28" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M11 26H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="16" cy="26" r="2" stroke="white" strokeWidth="1.5" />
              <circle cx="25" cy="20" r="2" stroke="white" strokeWidth="1.5" />
              <circle cx="20" cy="14" r="2" stroke="white" strokeWidth="1.5" />
            </svg>
          </div>
        </div>

        <h2 className="text-primary font-bold mt-4">
          Lịch sử trao quà
        </h2>

        {historyEntries.length > 0 && (historyEntries.map(history => <div key={history.id}
                                                                          className={'border rounded-md px-3 py-2 my-2'}>
          <div className={'history-wrapper flex gap-4'}>
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="48" height="48" rx="3" fill="#E8F6ED" />
              <g clipPath="url(#clip0_636_1526)">
                <path
                  d="M22.9415 18.6101H25.0591V24.0002H32.9517C33.2325 24.0002 33.5018 23.8886 33.7003 23.6901C33.8989 23.4915 34.0104 23.2222 34.0104 22.9414V19.6689C34.0104 19.3881 33.8989 19.1188 33.7003 18.9202C33.5018 18.7217 33.2325 18.6101 32.9517 18.6101H30.0728C30.4627 17.8072 30.5534 16.8916 30.3289 16.0277C30.1043 15.1639 29.5791 14.4084 28.8476 13.897C28.116 13.3856 27.2261 13.1518 26.3377 13.2376C25.4493 13.3233 24.6205 13.7231 24.0003 14.365C23.3791 13.7266 22.5511 13.3299 21.6642 13.2459C20.7774 13.1619 19.8897 13.396 19.1595 13.9063C18.4295 14.4167 17.9047 15.17 17.6789 16.0318C17.4532 16.8935 17.5413 17.8074 17.9274 18.6101H15.049C14.7682 18.6101 14.4989 18.7217 14.3003 18.9202C14.1017 19.1188 13.9902 19.3881 13.9902 19.6689V22.9414C13.9902 23.2222 14.1017 23.4915 14.3003 23.6901C14.3987 23.7884 14.5153 23.8664 14.6438 23.9196C14.7723 23.9728 14.9099 24.0002 15.049 24.0002H22.9415V18.6101ZM25.0591 16.9739C25.0591 16.6503 25.1551 16.3339 25.3349 16.0648C25.5147 15.7957 25.7702 15.586 26.0692 15.4621C26.3681 15.3383 26.6972 15.3059 27.0146 15.3691C27.332 15.4322 27.6235 15.588 27.8524 15.8168C28.0812 16.0457 28.2371 16.3372 28.3002 16.6546C28.3633 16.972 28.3309 17.3011 28.2071 17.6C28.0833 17.8991 27.8735 18.1546 27.6044 18.3344C27.3353 18.5142 27.019 18.6101 26.6953 18.6101H25.0591V16.9739ZM19.669 16.9739C19.669 16.5399 19.8415 16.1237 20.1483 15.8168C20.4552 15.51 20.8714 15.3376 21.3053 15.3376C21.7393 15.3376 22.1554 15.51 22.4623 15.8168C22.7692 16.1237 22.9415 16.5399 22.9415 16.9739V18.6101H21.3053C20.8714 18.6101 20.4552 18.4377 20.1483 18.1309C19.8415 17.824 19.669 17.4078 19.669 16.9739Z"
                  fill="#17A049" />
                <path
                  d="M25.0596 34.7801H31.4122C31.6929 34.7801 31.9623 34.6686 32.1608 34.47C32.3594 34.2715 32.4709 34.0022 32.4709 33.7214V25.54H25.0596V34.7801Z"
                  fill="#17A049" />
                <path
                  d="M15.5312 33.7214C15.5312 34.0022 15.6428 34.2715 15.8414 34.47C16.0399 34.6686 16.3092 34.7801 16.59 34.7801H22.9426V25.54H15.5312V33.7214Z"
                  fill="#17A049" />
              </g>
              <defs>
                <clipPath id="clip0_636_1526">
                  <rect width="22" height="22" fill="white" transform="translate(13 13)" />
                </clipPath>
              </defs>
            </svg>

            <div className="content w-full">
              <div className="gift-wrapper">
                <h4 className={'font-bold text-gray-2'}>{history?.giftName}</h4>
                <p className={'my-2'}>
                  Khách hàng {history?.customerName} đã trúng phần thưởng {history?.giftName}
                </p>
              </div>
              <div className="datetime flex mt-2 items-center">
                <span
                  className={'flex-1 text-gray-3 italic font-bold text-xs'}>{new Date(history.createdAt).toLocaleDateString('en-GB')}</span>
                {history.status === 1 && <button className={'bg-primary text-sm px-3 py-1 text-white rounded-full'}
                                                 onClick={() => handleOpenGift(history)}>Trao quà</button>}
                {history.status === 2 &&
                  <button className={'btn-received text-sm px-3 py-1 rounded-full'}>Đã nhận</button>}
              </div>
            </div>
          </div>
        </div>))}

        <div className='my-10 py-10'></div>
        <div className='my-10'></div>

        <div
          className={`fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50 ${!showModal ? 'hidden' : ''}`}>
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 mx-4">
            <div className="text-center">
              <h2 className="text-3xl text-primary font-bold mb-4">TRAO QUÀ</h2>
              <p className="text-gray-700 mb-6">
                Bạn muốn trao “
                <span className={'font-bold text-primary'}>{modalGift?.giftName}</span>”
                cho khách hàng?.
              </p>
              <div className="flex justify-center gap-4">
                <button onClick={() => setShowModal(false)} id="closeModal"
                        className="flex-1 text-primary border border-primary py-3 px-4 rounded-md focus:outline-none">
                  Đóng
                </button>
                <button
                  onClick={handleConfirmGift}
                  className="flex-1 bg-primary text-white py-3 px-4 rounded-md hover:bg-green-600 focus:outline-none">
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MainBottomNavigation defaultActivate={'history'} />
    </Page>
  );
};

export default HistoryPage;