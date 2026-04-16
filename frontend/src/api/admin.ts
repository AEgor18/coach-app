import { fetchWithAuth } from './fetchWithAuth';

const API_BASE_URL = '';

export const getAllCoaches = async () => {
	const url = `${API_BASE_URL}/api/admin/coaches`;
	const res = await fetchWithAuth(url);
	return res.json();
};

export const updateRole = async (userID: number) => {
	const url = `${API_BASE_URL}/api/admin/promote/${userID}`;
	const res = await fetchWithAuth(url, {
		method: 'PATCH',
	});
	return res.json();
};
