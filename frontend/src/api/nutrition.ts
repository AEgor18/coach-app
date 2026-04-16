import { fetchWithAuth } from './fetchWithAuth';

const API_BASE_URL = '';

export const getAllNutritions = async () => {
	const url = `${API_BASE_URL}/api/nutrition/plans`;
	const res = await fetchWithAuth(url);
	return res.json();
};

export const createNutrition = async (data: any) => {
	const url = `${API_BASE_URL}/api/nutrition/plans`;
	const res = await fetchWithAuth(url, {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return true;
};

export const getNutritionById = async (id: number) => {
	const url = `${API_BASE_URL}/api/nutrition/plans/${id}`;
	const res = await fetchWithAuth(url);
	return res.json();
};

export const updateNutritionById = async (id: number, data: any) => {
	const url = `${API_BASE_URL}/api/nutrition/plans/${id}`;
	const res = await fetchWithAuth(url, {
		method: 'PUT',
		body: JSON.stringify(data),
	});
	return true;
};

export const deleteNutritionById = async (id: number) => {
	const url = `${API_BASE_URL}/api/nutrition/plans/${id}`;
	const res = await fetchWithAuth(url, { method: 'DELETE' });
	return true;
};

export const updateNutritionStatus = async (id: number, status: string) => {
	const url = `${API_BASE_URL}/api/nutrition/plans/${id}/status`;
	const res = await fetchWithAuth(url, {
		method: 'PATCH',
		body: JSON.stringify(status),
	});
	return res.json();
};
