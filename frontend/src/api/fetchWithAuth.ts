const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const refreshToken = async (): Promise<string> => {
	const refresh_token = localStorage.getItem('refresh_token');

	if (!refresh_token) {
		throw new Error('No refresh token available');
	}

	const res = await fetch(`${API_BASE_URL}/api/profile/refresh`, {
		method: 'POST',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ refresh_token }),
	});

	if (!res.ok) {
		const err = await res.json().catch(() => ({}));
		throw new Error(err.detail || 'Refresh token invalid');
	}

	const data = await res.json();

	localStorage.setItem('access_token', data.access_token);
	localStorage.setItem('refresh_token', data.refresh_token);

	return data.access_token;
};

export const fetchWithAuth = async (
	url: string,
	options: RequestInit = {},
	retry = true,
): Promise<Response> => {
	const token = localStorage.getItem('access_token');

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...((options.headers as Record<string, string>) || {}),
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	let response = await fetch(url, { ...options, headers });

	if (response.status === 401 && retry) {
		try {
			const newToken = await refreshToken();
			headers['Authorization'] = `Bearer ${newToken}`;
			response = await fetch(url, { ...options, headers });
		} catch (err) {
			console.error('Token refresh failed:', err);
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			window.location.href = '/auth';
			throw err;
		}
	}

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));
		throw new Error(
			errorData.detail || errorData.message || 'Request failed',
		);
	}

	return response;
};
