import { checkStatus } from './checkStatus';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllCoaches = async (token: string) => {
	const url = `${API_BASE_URL}/api/admin/coaches`;
	const res = await fetch(url.toString(), {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});

	await checkStatus(res);

	return res.json();
};

export const updateRole = async (userID: number, token: string) => {
	const url = `${API_BASE_URL}/api/admin/promote/${userID}`;
	const res = await fetch(url.toString(), {
		method: 'PATCH',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});

	await checkStatus(res);

	return res.json();
};
