const API_BASE_URL = 'http://127.0.0.1:8000';

export const getAllReports = async (token: string) => {
	const url = `${API_BASE_URL}/api/reports`;
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

export const createReport = async (token: string, data) => {
	const url = `${API_BASE_URL}/api/reports`;
	const res = await fetch(url.toString(), {
		method: 'POST',
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

export const getReportById = async (token: string, id: number) => {
	const url = `${API_BASE_URL}/api/reports/${id}`;
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

export const updateReportById = async (token: string, id: number, data) => {
	const url = `${API_BASE_URL}/api/reports/${id}`;
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

export const deleteReportById = async (token: string, id: number) => {
	const url = `${API_BASE_URL}/api/reports/${id}`;
	const res = await fetch(url.toString(), {
		method: 'DELETE',
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

	return true;
};
