import { fetchWithAuth } from './fetchWithAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getAllReports = async () => {
	const url = `${API_BASE_URL}/api/reports`;
	const res = await fetchWithAuth(url);
	return res.json();
};

export const createReport = async (data: any) => {
	const url = `${API_BASE_URL}/api/reports`;
	const res = await fetchWithAuth(url, {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return true;
};

export const getReportById = async (id: number) => {
	const url = `${API_BASE_URL}/api/reports/${id}`;
	const res = await fetchWithAuth(url);
	return res.json();
};

export const updateReportById = async (id: number, data: any) => {
	const url = `${API_BASE_URL}/api/reports/${id}`;
	const res = await fetchWithAuth(url, {
		method: 'PUT',
		body: JSON.stringify(data),
	});
	return true;
};

export const deleteReportById = async (id: number) => {
	const url = `${API_BASE_URL}/api/reports/${id}`;
	const res = await fetchWithAuth(url, { method: 'DELETE' });
	return true;
};
