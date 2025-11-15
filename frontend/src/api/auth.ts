import { useAuth } from '../context/AuthContext';

const API_BASE_URL = 'http://127.0.0.1:8000';

export const useApi = () => {
	const { token, logout } = useAuth();

	const request = async (path: string, options: RequestInit = {}) => {
		const headers = {
			'Content-Type': 'application/json',
			Accept: 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {}),
			...options.headers,
		};

		const res = await fetch(`${API_BASE_URL}${path}`, {
			...options,
			headers,
		});

		if (res.status === 401) {
			logout();
			throw new Error('Unauthorized');
		}

		if (!res.ok) {
			const error = await res.json().catch(() => ({}));
			throw new Error(error.message || 'API Error');
		}

		if (res.status === 204) return null;
		return res.json();
	};

	return { request };
};
