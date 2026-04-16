import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { MainPage } from '../../pages';
import * as trainingsApi from '../../api/trainings';

vi.mock('../../api/trainings', () => ({
	getAllTrainings: vi.fn(),
}));

vi.mock('../../api/weather', () => ({
	getWeatherByCity: vi.fn(),
}));

vi.mock('../../components/Seo', () => ({
	default: () => null,
}));

vi.mock('../../pages/MainPage/MainPage', async () => {
	const actual = await vi.importActual<any>('../../pages/MainPage/MainPage');

	return {
		...actual,
		WeatherWidget: () => <div data-testid='weather-widget' />,
	};
});

describe('MainPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('рендерит заголовок календаря', async () => {
		trainingsApi.getAllTrainings.mockResolvedValue([]);

		render(<MainPage />);

		expect(screen.getByText('Календарь тренировок')).toBeInTheDocument();
	});

	it('загружает тренировки и отображает календарь', async () => {
		trainingsApi.getAllTrainings.mockResolvedValue([
			{
				id: 1,
				title: 'Силовая',
				date: '2026-04-07',
				duration: 90,
				training_type: 'Силовые',
			},
		]);

		render(<MainPage />);

		await waitFor(() => {
			expect(trainingsApi.getAllTrainings).toHaveBeenCalled();
		});

		expect(screen.getByRole('grid')).toBeInTheDocument();
	});

	it('обрабатывает ошибку загрузки тренировок', async () => {
		trainingsApi.getAllTrainings.mockRejectedValue(new Error('API Error'));

		render(<MainPage />);

		await waitFor(() => {
			expect(trainingsApi.getAllTrainings).toHaveBeenCalled();
		});

		expect(screen.getByText('Календарь тренировок')).toBeInTheDocument();
	});
});

vi.mock('@mui/icons-material', () => ({
	__esModule: true,
	default: () => null,
}));
