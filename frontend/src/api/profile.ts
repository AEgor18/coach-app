import { checkStatus } from "./checkStatus";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (data) => {
  const url = `${API_BASE_URL}/api/profile/register`;
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  await checkStatus(res);

  return true;
};

export const loginUser = async (data) => {
  const url = `${API_BASE_URL}/api/profile/login`;
  const res = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  await checkStatus(res);

  return res.json();
};

export const getUser = async (token: string) => {
  const url = `${API_BASE_URL}/api/profile/me`;
  const res = await fetch(url.toString(), {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  await checkStatus(res);

  return res.json();
};

export const updateUser = async (token: string, data) => {
  const url = `${API_BASE_URL}/api/profile/`;
  const res = await fetch(url.toString(), {
    method: "PUT",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  await checkStatus(res);

  return true;
};
