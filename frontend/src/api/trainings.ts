const API_BASE_URL = 'http://127.0.0.1:8000';

export const getAllTrainings = async (token: string) => {
	const url = `${API_BASE_URL}/api/trainings/plans`;
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

export const createTraining = async (token: string, data) => {
	const url = `${API_BASE_URL}/api/trainings/plans`;
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

	return res.json();
};

export const getTrainingById = async (token: string, id: number) => {
	const url = `${API_BASE_URL}/api/trainings/plans/${id}`;
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

export const updateTrainingById = async (token: string, id: number, data) => {
	const url = `${API_BASE_URL}/api/trainings/plans/${id}`;
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

export const deleteTrainingById = async (token: string, id: number) => {
	const url = `${API_BASE_URL}/api/trainings/plans/${id}`;
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

export const updateTrainingStatus = async (
	token: string,
	id: number,
	status: string
) => {
	const url = `${API_BASE_URL}/api/trainings/plans/${id}/status?new_status=${encodeURIComponent(
		status
	)}`;
	const res = await fetch(url.toString(), {
		method: 'PATCH',
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
