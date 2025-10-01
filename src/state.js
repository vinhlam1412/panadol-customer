import { atom, selector } from 'recoil';

export const displayNameState = atom({
  key: 'displayName',
  default: '',
});

// export const userState = atom({
//   key: 'user',
//   default: {},
// });

// persist effect đơn giản
const localStorageEffect = (key) => ({ setSelf, onSet }) => {
  const saved = localStorage.getItem(key);
  if (saved != null) {
    try { setSelf(JSON.parse(saved)); } catch {}
  }
  onSet((val, _, isReset) => {
    if (isReset || val == null) localStorage.removeItem(key);
    else localStorage.setItem(key, JSON.stringify(val));
  });
};

export const userState = atom({
  key: "userState",
  default: null, // { id, fullName, phoneNumber, store, exists }
  effects_UNSTABLE: [localStorageEffect("userState")],
});

export const tokenState = atom({
  key: "tokenState",
  default: null, 
  // string token
  effects_UNSTABLE: [localStorageEffect("access_token")],
});

