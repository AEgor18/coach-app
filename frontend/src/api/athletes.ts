import { fetchWithAuth } from './fetchWithAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllAthletes = async () => {
	const url = `${API_BASE_URL}/api/athletes`;
	const res = await fetchWithAuth(url);
	return res.json();
};

export const getAthleteById = async (id: number) => {
	const url = `${API_BASE_URL}/api/athletes/${id}`;
	const res = await fetchWithAuth(url);
	return res.json();
};

export const updateAthleteById = async (id: number, data: any) => {
	const url = `${API_BASE_URL}/api/athletes/${id}`;
	const res = await fetchWithAuth(url, {
		method: 'PUT',
		body: JSON.stringify(data),
	});
	return true;
};

export const deleteAthleteById = async (id: number) => {
	const url = `${API_BASE_URL}/api/athletes/${id}`;
	const res = await fetchWithAuth(url, { method: 'DELETE' });
	return true;
};

export const createAthlete = async (data: any) => {
	const url = `${API_BASE_URL}/api/athletes/`;
	const res = await fetchWithAuth(url, {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return true;
};

export const updateAthleteStatus = async (id: number, status: string) => {
	const url = `${API_BASE_URL}/api/athletes/${id}/status`;
	const res = await fetchWithAuth(url, {
		method: 'PATCH',
		body: JSON.stringify(status),
	});
	return true;
};
