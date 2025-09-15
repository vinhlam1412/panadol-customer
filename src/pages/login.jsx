import { Button, Input, Box, Page, useSnackbar, Spinner } from 'zmp-ui';
import { useNavigate } from 'react-router';
import HeaderHome from '../icons/header-home.svg?react';
import BottomHome from '../icons/bottom-home.svg?react';
import RegisterPage from './register';
import {useState} from 'react'
import { useSetRecoilState } from "recoil";
import { tokenState, userState } from "../state";

const LoginPage = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const setToken = useSetRecoilState(tokenState);
  const setUserInfor = useSetRecoilState(userState);
  const VN_PHONE_REGEX = /^(0[2-9]{1}[0-9]{8})$/;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
   
  const handleSubmit = async (e) => {
    setLoading(true);

    e.preventDefault();
    // Validate trước
    if (!VN_PHONE_REGEX.test(phone)) {
      setError('Số điện thoại không hợp lệ (10 chữ số, bắt đầu bằng 0)');
      return;
    }
    setError('');

      try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: phone }),
      });

     if (res.status === 200) {
      const { token, user, exists } = await res.json();

      // lưu token & user (persist qua reload)
      setToken(token);
      setUserInfor({
        id: user.id,
        fullName: user.fullName || "",
        phoneNumber: user.phoneNumber || phone,
        store: user.store || "",
        exists: true,
      });

    } else if (res.status === 404) {
      // chưa tồn tại → chuyển sang đăng ký
      setUserInfor({
        id: undefined,
        fullName: "",
        phoneNumber: phone,
        store: "",
        exists: false,
      });
    }
    } catch (err) {
      console.error(err);
      setError('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setLoading(false);
      navigate("/register", { replace: true }); 
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
          <h1 className={'font-bold font-20 text-primary'}>ĐIỀN SỐ ĐIỆN THOẠI</h1>
        </div>

        <div className="w-full max-w-md mx-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Số điện thoại */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-600">
                Số điện thoại
              </label>
              <input
                type="tel"
                placeholder="0903.912.345"
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-slate-300 focus:border-slate-400"
                onChange = {e => setPhone(e.target.value)}
              />
            </div>   
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="mt-4 pt-3">
              <button type="submit" className='w-full bg-primary p-3 rounded-2xl text-white'>Xác thực</button>
            </div>      
          </form>
        </div>    
        <div className="w-screen -translate-x-3 overflow-hidden">
          <div className="">
            <BottomHome />
          </div>
        </div>
      </div>
    </Page>
  );
};

export default LoginPage;
