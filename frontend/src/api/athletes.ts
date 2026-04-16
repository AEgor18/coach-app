import { fetchWithAuth } from './fetchWithAuth';

const API_BASE_URL = '';

export interface AthleteQueryParams {
	search?: string;
	sport_type?: string;
	status?: string;
	page?: number;
	limit?: number;
	sort_by?: string;
	sort_order?: 'asc' | 'desc';
}

export const getAllAthletes = async (params?: AthleteQueryParams) => {
	const query = new URLSearchParams();

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			if (value !== undefined && value !== '' && value !== 'Все') {
				query.append(key, String(value));
			}
		});
	}

	const url = `${API_BASE_URL}/api/athletes?${query.toString()}`;

	const res = await fetchWithAuth(url);
	return res.json();
};

export const getAthleteById = async (id: number) => {
	const url = `${API_BASE_URL}/api/athletes/${id}`;
	const res = await fetchWithAuth(url);
	return res.json();
};

export const updateAthleteById = async (id: number, data: any) => {
	const url = `${API_BASE_URL}/api/athletes/${id}`;
	const res = await fetchWithAuth(url, {
		method: 'PUT',
		body: JSON.stringify(data),
	});
	return true;
};

export const deleteAthleteById = async (id: number) => {
	const url = `${API_BASE_URL}/api/athletes/${id}`;
	const res = await fetchWithAuth(url, { method: 'DELETE' });
	return true;
};

export const createAthlete = async (data: any) => {
	const url = `${API_BASE_URL}/api/athletes/`;
	const res = await fetchWithAuth(url, {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return true;
};

export const updateAthleteStatus = async (id: number, status: string) => {
	const url = `${API_BASE_URL}/api/athletes/${id}/status`;
	const res = await fetchWithAuth(url, {
		method: 'PATCH',
		body: JSON.stringify(status),
	});
	return true;
};
