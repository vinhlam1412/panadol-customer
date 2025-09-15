import React, { Suspense, useEffect } from "react";
import { Box, Page, Spinner } from "zmp-ui";
import UserCard from "../components/user-card";
import HeaderHome from "../icons/header-home.svg?react";
import FeatureCard from "../components/feature-card";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { userState, tokenState } from "../state";
import QrCard from "../images/qr-card.png";
import HistoryImg from "../images/history.png";

const HomePage = () => {
  const navigate = useNavigate();
  const user = useRecoilValue(userState);
  const token = useRecoilValue(tokenState);

  // nếu chưa có token → buộc về login
  useEffect(() => {
    if (!token) navigate("/login", { replace: true });
  }, [token, navigate]);

  // có token nhưng user chưa hydrate xong → show spinner 1 chút
  if (!user || !user.id) {
    return (
      <Page className="page text-center !p-0 !m-0" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Box flex flexDirection="column" justifyContent="center" alignItems="center">
          <Spinner visible />
        </Box>
      </Page>
    );
  }

  return (
    <Page className="page bg-white px-0 relative">
      <div className="w-full h-16">
        <div className="absolute top-0 left-0">
          <HeaderHome />
        </div>
      </div>

      <Suspense>
        <div className="section-container !mb-0">
          <UserCard showAvatar={false} fullName={user.fullName} />
        </div>
      </Suspense>

      <div className="section-container relative !mb-0" onClick={() => navigate("/qr-checkin")}>
        <img className="w-full rounded-xl" src={QrCard} />
        <span className="absolute inset-1/2 left-6 font-bold text-white text-xl">Mã QR Checkin</span>
      </div>

      <div className="section-container">
        <h5 className="font-bold text-gray text-lg">Danh sách chức năng</h5>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <FeatureCard index={1} imgSrc={HistoryImg} title="Tài liệu" href="/document" />
          <FeatureCard index={2} imgSrc={HistoryImg} title="Khảo sát" href="/survey" primary />
        </div>
      </div>
    </Page>
  );
};

export default HomePage;
