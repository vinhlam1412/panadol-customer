import React, { useState, useEffect, Suspense } from 'react';
import { Button, Input, Page, useSnackbar } from 'zmp-ui';
import { getAccessToken, getLocation } from 'zmp-sdk/apis';
import MainBottomNavigation from '../components/bottom-navigation';
import MainHeader from '../components/main-header';
import UserCard from '../components/user-card';
import { formatLatLon } from '../utils';
import CurrentTime from '../components/curent-time';
import { useRecoilValue } from 'recoil';
import { userState } from '../state';

const CheckoutPage = (props) => {
  const [locationState, setLocationState] = useState({
    latitude: null,
    longitude: null,
  });

  const { userInfo } = useRecoilValue(userState);

  const { openSnackbar } = useSnackbar();

  const [checkInNote, setCheckInNote] = useState("");

  const locationOk = locationState && locationState.latitude && locationState.longitude;
  const googleMapIframe = locationOk ? `https://maps.google.com/maps?q=${locationState.latitude},${locationState.longitude}&z=16&output=embed` : undefined;
  useEffect(() => {
    getAccessToken({
      success: (accessToken) => {
        getLocation({
          success: async (data) => {
            const { latitude, longitude, token } = data;

            if (longitude && latitude) {
              setLocationState({
                latitude,
                longitude,
              });
            } else if (token) {
              try {
                const response = await fetch(`${import.meta.env.VITE_API_URL}/api/Location/GetLocation`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    UserAccessToken: accessToken,
                    Code: token,
                  }),
                });

                const data = await response.json();

                if (data.error === 0 && data.data) {
                  const { latitude, longitude } = data.data;

                  if (latitude && longitude) {
                    setLocationState({
                      latitude: parseFloat(latitude),
                      longitude: parseFloat(longitude),
                    });
                  }
                } else {
                  console.error('Failed to fetch location data:', data.message);
                }
              } catch (error) {
                console.error('Error while fetching location data:', error);
              }
            }
          },
          fail: (error) => {
            setLocationState(error);
          },
        });
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  }, []);

  const handleSubmit = async () => {
    getAccessToken({
      success: async (accessToken) => {
        try {

          console.log("accessToken", accessToken)
          console.log("locationState.latitude", locationState.latitude)
          console.log("locationState.longitude", locationState.longitude)
          console.log("new Date().getTime()", new Date().getTime())
          console.log("checkInNote", checkInNote)
          // const response = await fetch(`${import.meta.env.VITE_API_URL}/api/CheckIn/Out`, {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //   },
          //   body: JSON.stringify({
          //     "AccessToken": accessToken,
          //     "latitude": locationState.latitude,
          //     "longitude": locationState.longitude,
          //     "time": new Date().getTime(),
          //     "note": checkInNote
          //   })
          // });

          // // Check if the response is successful (status code 200-299)
          // if (!response.ok) {
          //   openSnackbar({
          //     text: "Không thể check out, vui lòng thử lại",
          //     type: "error",
          //   });
          //   throw new Error('Request failed with status ' + response.status);
          // }

          openSnackbar({
            text: "Check out Thành công",
            type: "success",
          });

          // Parse the response as JSON
          // const responseData = await response.json();
          // console.log('API response:', responseData);
        } catch (error) {
          openSnackbar({
            text: "Không thể check out, vui lòng thử lại",
            type: "error",
          });
          console.error('Error calling API:', error);
        }
      },
      fail: (error) => {
        // xử lý khi gọi api thất bại
        console.log(error);
      },
    });
  }

  return (
    <Page className="p-0 flex flex-col">
      <MainHeader title="Check out" />

      {googleMapIframe && (<div className="flex-1">
        <iframe
          width="100%"
          height="100%"
          style={{
            border: 0,
          }}
          loading="lazy"
          src={googleMapIframe}>
        </iframe>
      </div>)}

      {locationOk && <div
        className={'rounded-md absolute bottom-20 w-11/12 checkin-card -translate-x-1/2 left-1/2 p-2 border card bg-white'}>
        <Suspense>
          <UserCard showAvatar />
        </Suspense>

        <div className="mt-3">
          <div className={'py-1'}>
            <span className={'color-primary me-2'}>
              Vị trí hiện tại:
            </span>
            {formatLatLon(locationState.latitude, locationState.longitude)}
          </div>

          <div className={'py-1'}>
            <span className={'color-primary me-2'}>
              Thời gian:
            </span>
            <CurrentTime />
          </div>

          <div className={'py-1'}>
            <span className={'color-primary me-2'}>
              Ghi chú:
            </span>
            <div>
              <Input.TextArea value={checkInNote} onChange={e => setCheckInNote(e.target.value)} />
            </div>
            <div className="py-2">
              <Button onClick={handleSubmit} className={"w-full !rounded-lg"} variant="primary" type="highlight" size="large">
                Check-Out
              </Button>
            </div>
          </div>
        </div>
      </div>
      }

      <MainBottomNavigation />
    </Page>
  );
};

export default CheckoutPage;