import { fetchWithAuth } from './fetchWithAuth';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getWeatherByCity = async (city: string) => {
	const url = `${API_BASE_URL}/api/weather/current?city=${city}`;
	const res = await fetchWithAuth(url);
	return res.json();
};
