import { fetchWithAuth } from './fetchWithAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = async (data: any) => {
	const url = `${API_BASE_URL}/api/profile/register`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.detail || 'Registration failed');
	}

	return true;
};

export const loginUser = async (data: any) => {
	const url = `${API_BASE_URL}/api/profile/login`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.detail || 'Login failed');
	}

	const json = await res.json();

	localStorage.setItem('access_token', json.access_token);
	localStorage.setItem('refresh_token', json.refresh_token);

	return json;
};

export const getUser = async () => {
	const url = `${API_BASE_URL}/api/profile/me`;
	const res = await fetchWithAuth(url);
	return res.json();
};

export const updateUser = async (data: any) => {
	const url = `${API_BASE_URL}/api/profile/`;
	const res = await fetchWithAuth(url, {
		method: 'PUT',
		body: JSON.stringify(data),
	});
	return true;
};
