const API_BASE_URL = 'http://127.0.0.1:8000';

export const registerUser = async (data) => {
	const url = `${API_BASE_URL}/api/profile/register`;
	const res = await fetch(url.toString(), {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		throw new Error(error.message, error.description);
	}

	return true;
};

export const loginUser = async (data) => {
	const url = `${API_BASE_URL}/api/profile/login`;
	const res = await fetch(url.toString(), {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		throw new Error(error.message, error.description);
	}

	return res.json();
};

export const getUser = async (token: string) => {
	const url = `${API_BASE_URL}/api/profile/me`;
	const res = await fetch(url.toString(), {
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		throw new Error(error.message, error.description);
	}

	return res.json();
};

export const updateUser = async (token: string, data) => {
	const url = `${API_BASE_URL}/api/profile/`;
	const res = await fetch(url.toString(), {
		method: 'PUT',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		throw new Error(error.message, error.description);
	}

	return true;
};
