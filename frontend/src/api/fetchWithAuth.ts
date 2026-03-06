const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

const subscribeToRefresh = (callback: (token: string) => void) => {
	refreshSubscribers.push(callback);
};

const onRefreshed = (token: string) => {
	refreshSubscribers.forEach((callback) => callback(token));
	refreshSubscribers = [];
};

export const refreshToken = async (): Promise<string> => {
	const refresh_token = localStorage.getItem('refresh_token');

	if (!refresh_token) {
		throw new Error('No refresh token available');
	}

	if (isRefreshing) {
		console.log('⏳ Refresh already in progress, waiting...');
		return new Promise((resolve) => {
			subscribeToRefresh((token: string) => {
				resolve(token);
			});
		});
	}

	isRefreshing = true;
	console.log('🔄 Starting token refresh...');

	try {
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

		console.log('✅ Token refreshed successfully');

		onRefreshed(data.access_token);

		return data.access_token;
	} catch (error) {
		console.error('❌ Token refresh failed:', error);
		refreshSubscribers = [];
		throw error;
	} finally {
		isRefreshing = false;
	}
};

export const fetchWithAuth = async (
	url: string,
	options: RequestInit = {},
	retry = true,
): Promise<Response> => {
	const refresh_token = localStorage.getItem('refresh_token');
	let token = localStorage.getItem('access_token');

	if (!token && refresh_token && retry) {
		try {
			console.log(
				'📦 No access token, but refresh exists - refreshing before request',
			);
			token = await refreshToken();
		} catch (err) {
			console.error('❌ Pre-request token refresh failed:', err);
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			window.location.href = '/auth';
			throw new Error('Authentication failed');
		}
	}

	const headers: Record<string, string> = {
		Accept: 'application/json',
		'Content-Type': 'application/json',
		...((options.headers as Record<string, string>) || {}),
	};

	if (token) {
		headers['Authorization'] = `Bearer ${token}`;
	}

	let response = await fetch(url, { ...options, headers });

	if (response.status === 401 && refresh_token && retry) {
		try {
			console.log('🔄 Got 401, refreshing token and retrying request');

			const newToken = await refreshToken();

			headers['Authorization'] = `Bearer ${newToken}`;

			response = await fetch(url, { ...options, headers });

			console.log('✅ Request retried successfully after token refresh');
		} catch (err) {
			console.error('❌ Token refresh failed after 401:', err);
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			window.location.href = '/auth';
			throw err;
		}
	}

	if (!response.ok) {
		const errorData = await response.json().catch(() => ({}));

		if (response.status === 401) {
			localStorage.removeItem('access_token');
			localStorage.removeItem('refresh_token');
			window.location.href = '/auth';
			throw new Error('Session expired');
		}

		throw new Error(
			errorData.detail ||
				errorData.message ||
				`Request failed with status ${response.status}`,
		);
	}

	return response;
};
