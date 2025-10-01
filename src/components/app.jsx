import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { App, ZMPRouter, AnimationRoutes, SnackbarProvider } from 'zmp-ui';
import { RecoilRoot } from 'recoil';
import HomePage from '../pages';
import About from '../pages/about';
import Form from '../pages/register';
import User from '../pages/user';
import CheckInPage from '../pages/checkin';
import CheckoutPage from '../pages/checkout';
import RewardPage from '../pages/reward';
import History from '../pages/history';
import ProgramDocumentPage from '../pages/document';
import { SurveyPage } from '../pages/survey';
import { QRCodeReward } from '../pages/qrReward';
import LoginPage from '../pages/login';
import RegisterPage from '../pages/register';
import { QRCodeCheckin } from '../pages/qrCheckin';
import AuthBootstrap from '../auth-bootstrap';
import DemoApp from '../pages/gsk_vn_ứng_dụng_cho_nhan_vien_y_tế_prototype';
import CustomerApp from '../pages/khachhang';

const MyApp = () => {
  return (
    <RecoilRoot>
      <AuthBootstrap>
      <App>
        <SnackbarProvider>
          <BrowserRouter>
            <AnimationRoutes>       
              <Route path="/" element={<HomePage></HomePage>}></Route>
              <Route path="/login" element={<LoginPage></LoginPage>}></Route>
              <Route path="/register" element={<RegisterPage></RegisterPage>}></Route>
              <Route path="/qr-checkin" element={<QRCodeCheckin></QRCodeCheckin>}></Route>
              <Route path="/document" element={<ProgramDocumentPage></ProgramDocumentPage>}></Route>
              {/* <Route path="/survey" element={<SurveyPage></SurveyPage>}></Route> */}
              <Route path="/qr-reward/:id" element={<QRCodeReward></QRCodeReward>}></Route>
              <Route path="/checkin" element={<CheckInPage></CheckInPage>}></Route>
              <Route path="/checkout" element={<CheckoutPage></CheckoutPage>}></Route>
              <Route path="/reward" element={<RewardPage></RewardPage>}></Route>
              <Route path="/history" element={<History></History>}></Route>
              <Route path="/about" element={<About></About>}></Route>
              <Route path="/form" element={<Form></Form>}></Route>
              <Route path="/user" element={<User></User>}></Route>
            </AnimationRoutes>
          </BrowserRouter>
        </SnackbarProvider>
      </App>
      </AuthBootstrap>
    </RecoilRoot>
  );
};
export default MyApp;