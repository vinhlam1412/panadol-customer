import React  from 'react';
import {useState, useEffect} from 'react';
import { Button, Input, Box, Page, useSnackbar, Spinner } from 'zmp-ui';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { displayNameState, tokenState, userState } from '../state';
import { useNavigate } from 'react-router';
import HeaderHome from '../icons/header-home.svg?react';
import BottomHome from '../icons/bottom-home.svg?react';
import HomePage from '../pages/index.jsx'

const RegisterPage = () => {
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [store, setStore] = useState('');
  const navigate = useNavigate();
  const userInfor = useRecoilValue(userState);
  const userExists = !!userInfor?.exists;
  const VN_PHONE_REGEX = /^(0[2-9]{1}[0-9]{8})$/;
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const setToken = useSetRecoilState(tokenState);
  const setUser = useSetRecoilState(userState);

  useEffect(() => {    
    console.log("userInfor", userInfor);
    setLoading(true);
    if(userInfor){
      setFullName(userInfor.fullName || '');
      setPhoneNumber(userInfor.phoneNumber || '');
      setStore(userInfor.store || '');
    }
    setLoading(false);
  }, [userInfor])

  const validateForm = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Vui lòng nhập tên khách hàng';
    if (!phoneNumber.trim()) {
      newErrors.phoneNumber = 'Vui lòng nhập số điện thoại';
    } else if (!VN_PHONE_REGEX.test(phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }
    if (!store.trim()) newErrors.store = 'Vui lòng nhập tên nhà thuốc';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!validateForm()) return;
    
    try {
      if (!userExists) {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, phoneNumber, store }),
        });

        console.log("handle Submit");

        const { token, user } = await res.json();
        setToken(token);
        setUser({
          id: user.id,
          fullName: user.fullName || "",
          phoneNumber: user.phoneNumber || "",
          store: user.store || "",
          exists: true,
        });
        setLoading(false);      
      }
      navigate("/", { replace: true });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
    finally{
      setLoading(false);
    }
  };
  
  if (loading) {
  return (
    <Page className="page text-center !p-0 !m-0" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Box
        flex
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Spinner visible logo={undefined} />
      </Box>
    </Page>
  );
}

  return (
    <Page className="page bg-primary !p-0 relative overflow-x-hidden">
      <div className="bg-white overflow-x-hidden px-3 w-full">
        <div className="w-full h-2">
          <div className="absolute top-0 left-0">
            <HeaderHome />
          </div>
        </div>

        <div className="mt-20 text-center">
          <h1 className={'font-bold font-20 text-primary'}>ĐIỀN THÔNG TIN</h1>
        </div>

        <div className="w-full max-w-md mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tên khách hàng */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Tên khách hàng
              </label>
              <input
                type="text"
                disabled={userExists}
                value={fullName}
                placeholder="Nguyễn Văn A"
                onChange={(e) => setFullName(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm ${
                  errors.fullName ? 'border-red-500' : 'border-slate-300'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
            </div>

            {/* Số điện thoại */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Số điện thoại
              </label>
              <input
                type="tel"
                placeholder="0903.912.345"
                disabled={userExists}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm ${
                  errors.phoneNumber ? 'border-red-500' : 'border-slate-300'
                }`}
              />
               {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
            </div>

            {/* Nhà thuốc */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Nhà thuốc
              </label>
              <input
                type="text"
                placeholder="Nhà thuốc A"
                value={store}
                disabled={userExists}
                onChange={(e) => setStore(e.target.value)}
                className={`w-full rounded-xl border px-4 py-3 text-sm ${
                  errors.store ? 'border-red-500' : 'border-slate-300'
                }`}
              />
               {errors.store && <p className="text-red-500 text-sm">{errors.store}</p>}
            </div>



             {/* Note */}
            <div className="space-y-2 relative">
              <label className="block text-sm font-medium text-slate-600">
                Ghi chú
              </label>
              <textarea
                type="text"
                placeholder="Nhà thuốc A"
                className={`w-full rounded-xl border px-4 py-3 text-sm border-slate-300`}
              />
            </div>

            <div className="mt-4 pt-3">
              <button type="submit" className='w-full bg-primary p-3 rounded-2xl text-white'>Xác thực</button>
            </div>
          </form>         
        </div>     
        <div className="w-screen -translate-x-3 overflow-hidden relative">
          <div className="">
            <BottomHome />
          </div>
        </div>
      </div>
    </Page>
  );
};

export default RegisterPage;
