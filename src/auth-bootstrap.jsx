import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { tokenState, userState } from "./state";

export default function AuthBootstrap({ children }) {
  const [token] = useRecoilState(tokenState);
  const [user, setUser] = useRecoilState(userState);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const run = async () => {
      // nếu đã có user (từ localStorage) thì thôi
      if (user && user.id) { setReady(true); return; }
      // nếu có token mà chưa có user → fetch user
      if (token) {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/user`, {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.ok) {
            const u = await res.json();
            setUser({
              id: u.id,
              fullName: u.fullName || "",
              phoneNumber: u.phoneNumber || "",
              store: u.store || "",
              exists: true,
            });
          }
        } catch (_) {}
      }
      setReady(true);
    };
    run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!ready) return null; // hoặc trả spinner toàn cục
  return children;
}
