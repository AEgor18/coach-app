import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { TrainingsPage } from '../../pages';
import * as trainingsApi from '../../api/trainings';

vi.mock('../../api/trainings', () => ({
	getAllTrainings: vi.fn(),
	createTraining: vi.fn(),
	updateTrainingById: vi.fn(),
	deleteTrainingById: vi.fn(),
}));

vi.mock('../../components/Seo', () => ({
	default: () => null,
}));

vi.mock('../../components/ui/Loading', () => ({
	Loading: () => <div data-testid='loading' />,
}));

vi.mock('../../components/modals/trainings', () => ({
	AddTrainingModal: ({ open }: any) =>
		open ? <div data-testid='add-modal' /> : null,
	EditTrainingModal: ({ open }: any) =>
		open ? <div data-testid='edit-modal' /> : null,
}));

vi.mock('@mui/icons-material', () => ({
	Add: () => null,
	Edit: () => null,
	Delete: () => null,
}));

describe('TrainingsPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('рендерит заголовок страницы', async () => {
		trainingsApi.getAllTrainings.mockResolvedValue([]);

		render(<TrainingsPage />);

		await waitFor(() => {
			expect(screen.getByText('Тренировки')).toBeInTheDocument();
		});
	});

	it('загружает и отображает тренировки', async () => {
		trainingsApi.getAllTrainings.mockResolvedValue([
			{
				id: 1,
				title: 'Силовая',
				description: 'Тренировка ног',
				date: '2026-04-07',
				duration: 60,
				training_type: 'Силовые',
				status: 'Запланированная',
				skill_level: 'Начальный',
				athletes: [{ name: 'Иван' }],
			},
		]);

		render(<TrainingsPage />);

		await waitFor(() => {
			expect(trainingsApi.getAllTrainings).toHaveBeenCalled();
		});

		expect(screen.getByText('Силовая')).toBeInTheDocument();
		expect(screen.getByText('Тренировка ног')).toBeInTheDocument();
	});

	it('обрабатывает ошибку загрузки', async () => {
		trainingsApi.getAllTrainings.mockRejectedValue(new Error('API error'));

		render(<TrainingsPage />);

		await waitFor(() => {
			expect(trainingsApi.getAllTrainings).toHaveBeenCalled();
		});

		expect(screen.getByText('Тренировки')).toBeInTheDocument();
	});
});
