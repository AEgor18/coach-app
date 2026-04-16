import { fetchWithAuth } from './fetchWithAuth';

const API_BASE_URL = '';

export const registerUser = async (data: any) => {
	const url = `/api/profile/register`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
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
	const url = `/api/profile/login`;
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Accept: 'application/json',
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

export const uploadAvatar = async (file: File): Promise<boolean> => {
	const formData = new FormData();
	formData.append('file', file, file.name);

	const url = `${API_BASE_URL}/api/profile/avatar`;
	const token = localStorage.getItem('access_token');

	const res = await fetch(url, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			Accept: 'application/json',
		},
		body: formData,
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.detail || 'Failed to upload avatar');
	}

	return true;
};

export const deleteAvatar = async (): Promise<boolean> => {
	const url = `${API_BASE_URL}/api/profile/avatar`;
	const res = await fetchWithAuth(url, {
		method: 'DELETE',
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.detail || 'Failed to delete avatar');
	}

	return true;
};
