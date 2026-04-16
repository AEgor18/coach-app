import { fetchWithAuth } from './fetchWithAuth';

const API_BASE_URL = '';

export const getAllTrainings = async () => {
	const url = `${API_BASE_URL}/api/trainings/plans`;
	const res = await fetchWithAuth(url);
	return res.json();
};

export const createTraining = async (data: any) => {
	const url = `${API_BASE_URL}/api/trainings/plans`;
	const res = await fetchWithAuth(url, {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return res.json();
};

export const getTrainingById = async (id: number) => {
	const url = `${API_BASE_URL}/api/trainings/plans/${id}`;
	const res = await fetchWithAuth(url);
	return res.json();
};

export const updateTrainingById = async (id: number, data: any) => {
	const url = `${API_BASE_URL}/api/trainings/plans/${id}`;
	const res = await fetchWithAuth(url, {
		method: 'PUT',
		body: JSON.stringify(data),
	});
	return true;
};

export const deleteTrainingById = async (id: number) => {
	const url = `${API_BASE_URL}/api/trainings/plans/${id}`;
	const res = await fetchWithAuth(url, { method: 'DELETE' });
	return true;
};

export const updateTrainingStatus = async (id: number, status: string) => {
	const url = `${API_BASE_URL}/api/trainings/plans/${id}/status?new_status=${encodeURIComponent(status)}`;
	const res = await fetchWithAuth(url, { method: 'PATCH' });
	return res.json();
};
