import { Box, Page, Spinner } from "zmp-ui";
import MainHeader from "../components/main-header";
import { QRCodeSVG } from "qrcode.react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { useState, useEffect } from "react";
import { tokenState, userState } from "../state";
  
export const QRCodeCheckin = () => {
   const navigate = useNavigate();
   const user = useRecoilValue(userState);
   const token = useRecoilValue(tokenState);    
   const [qrData, setQrData] = useState(null);
   const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.id || !user?.store || !token) return;
    const controller = new AbortController();

    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/qr/checkin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId: user.id, store: user.store }),
          signal: controller.signal,
        });
        if (res.ok) {
          const data = await res.json();
          setQrData(data.url ?? null);
        } else if (res.status === 401) {
          // token hết hạn → điều hướng login/refresh tùy ý
        }
      } catch (err) {
        if (err.name !== "AbortError") console.error(err);
      } finally {
        setLoading(false);
      }
    };

    run();
    return () => controller.abort();
  }, [user?.id, user?.store, token]);


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
      <Page className="page !p-0 bg-white">
        <MainHeader title="QR Code" />
        <div className="bg-white">
          <h5 className="qr-code-title text-center my-4">Mã Checkin: {qrData}</h5>
         {qrData && (
            <div className="flex items-center justify-center px-6 pb-6 pt-4">
               <QRCodeSVG width={'100%'} height={'100%'} value={qrData} fgColor={'#17A049'} />
          </div>
         )}
        </div>

        <div className="text-right cursor-pointer p-4  ">
          <button onClick={() => { navigate('/')
          }} className={'text-white font-bold mt-5 bg-primary rounded-2xl px-4 py-2'}>Trở về</button>
        </div>
      </Page>
    );
}