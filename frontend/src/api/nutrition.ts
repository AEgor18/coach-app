const API_BASE_URL = 'http://127.0.0.1:8000';

export const getAllNutritions = async (token: string) => {
	const url = `${API_BASE_URL}/api/nutrition/plans`;
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

export const createNutrition = async (token: string, data) => {
	const url = `${API_BASE_URL}/api/nutrition/plans`;
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

export const getNutritionById = async (token: string, id: number) => {
	const url = `${API_BASE_URL}/api/nutrition/plans/${id}`;
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

export const updateNutritionById = async (token: string, id: number, data) => {
	const url = `${API_BASE_URL}/api/nutrition/plans/${id}`;
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

export const deleteNutritionById = async (token: string, id: number) => {
	const url = `${API_BASE_URL}/api/nutrition/plans/${id}`;
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

export const updateNutritionStatus = async (
	token: string,
	id: number,
	status: string
) => {
	const url = `${API_BASE_URL}/api/nutrition/plans/${id}/status`;
	const res = await fetch(url.toString(), {
		method: 'PATCH',
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json',
			Authorization: `Bearer ${token}`,
		},
		body: JSON.stringify(status),
	});

	if (!res.ok) {
		const error = await res.json().catch(() => ({}));
		throw new Error(error.message, error.description);
	}

	return res.json();
};
