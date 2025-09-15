import { Box, Page, Spinner } from "zmp-ui";
import MainHeader from "../components/main-header";
import { QRCodeSVG } from "qrcode.react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../state";
import { useState, useEffect  } from "react";

export const QRCodeReward = () => {
    const { id } = useParams(); 
    const navigate = useNavigate();
    const [qrData, setQrData] = useState(null);
    const [loading, setLoading] = useState(false);
    const user = useRecoilValue(userState);

 useEffect(() => {
    // Only run when user info is available
    if (!user?.id || !user?.store || !id) return;

    const controller = new AbortController();

    const getQRReward = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/qr/reward`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            rewardId: id,
            userId: user.id,
          }),
          signal: controller.signal,
        });

        if (!res.ok) {
          // TODO: show snackbar/toast if you want
          return;
        }

        const data = await res.json();
        console.log("qr reward data", data.url);
        setQrData(data.url ?? null);
      } catch (err) {
        if (err.name !== "AbortError") {
          // TODO: show snackbar/toast if you want
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    };

    getQRReward();

    // Cleanup if component unmounts
    return () => controller.abort();
  }, [user?.id, user?.store]);

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
        <p className="qr-code-title text-center my-4">
          <h5 className="qr-code-title text-center my-4">Mã quà tặng</h5>
        </p>
        {qrData && (
          <div className="flex items-center justify-center px-6 pb-6 pt-4">
              <QRCodeSVG width={'100%'} height={'100%'} value={qrData} fgColor={'#17A049'} />
        </div>
        )}
      </div>

      <div className="text-right cursor-pointer p-4  ">
        <button onClick={() => { navigate("/")
        }} className={'text-white font-bold mt-5 bg-primary rounded-2xl px-4 py-2'}>Trở về</button>
      </div>
    </Page>
  );
}