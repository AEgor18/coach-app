import { checkStatus } from "./checkStatus";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllAthletes = async (token: string) => {
  const url = `${API_BASE_URL}/api/athletes`;
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

export const getAthleteById = async (token: string, id: number) => {
  const url = `${API_BASE_URL}/api/athletes/${id}`;
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

export const updateAthleteById = async (token: string, id: number, data) => {
  const url = `${API_BASE_URL}/api/athletes/${id}`;
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

export const deleteAthleteById = async (token: string, id: number) => {
  const url = `${API_BASE_URL}/api/athletes/${id}`;
  const res = await fetch(url.toString(), {
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  await checkStatus(res);
  return true;
};

export const createAthlete = async (token: string, data) => {
  const url = `${API_BASE_URL}/api/athletes/`;
  const res = await fetch(url.toString(), {
    method: "POST",
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

export const updateAthleteStatus = async (
  token: string,
  id: number,
  status: string,
) => {
  const url = `${API_BASE_URL}/api/athletes/${id}/status`;
  const res = await fetch(url.toString(), {
    method: "PATCH",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(status),
  });
  await checkStatus(res);

  return true;
};
