
export async function apiFetch(path, init = {}) {
  const base = import.meta.env.VITE_API_URL;
  const token = JSON.parse(localStorage.getItem("access_token") || "null");
  const headers = new Headers(init.headers || {});
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetch(`${base}${path}`, { ...init, headers });
}


export default apiFetch;
