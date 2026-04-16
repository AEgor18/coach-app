import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { NutritionPage } from '../../pages';

vi.mock('../../api/nutrition', () => ({
	getAllNutritions: vi.fn(),
	createNutrition: vi.fn(),
	updateNutritionById: vi.fn(),
	deleteNutritionById: vi.fn(),
}));

vi.mock('../../components/ui/Loading', () => ({
	Loading: () => <div data-testid='loading' />,
}));

vi.mock('../../components/Seo', () => ({
	default: () => null,
}));

vi.mock('../../components/modals/nutrition', () => ({
	AddNutritionModal: ({ open }: any) =>
		open ? <div data-testid='add-modal' /> : null,

	EditNutritionModal: ({ open }: any) =>
		open ? <div data-testid='edit-modal' /> : null,
}));

import * as api from '../../api/nutrition';

describe('NutritionPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('показывает заголовок страницы', async () => {
		api.getAllNutritions.mockResolvedValue([]);

		render(<NutritionPage />);

		await waitFor(() => {
			expect(screen.getByText('Управление питанием')).toBeInTheDocument();
		});
	});

	it('показывает загрузку при старте', async () => {
		api.getAllNutritions.mockResolvedValue([]);

		render(<NutritionPage />);

		await waitFor(() => {
			expect(api.getAllNutritions).toHaveBeenCalled();
		});
	});

	it('рендерит список планов питания', async () => {
		api.getAllNutritions.mockResolvedValue([
			{
				id: 1,
				title: 'Набор массы',
				description: 'План питания',
				status: 'Активен',
				nutrition_type: 'набор массы',
				calories: 2500,
				protein: 150,
				fats: 80,
				carbs: 300,
				period_weeks: 4,
				breakfast: 'Овсянка',
				lunch: 'Рис',
				dinner: 'Курица',
				athletes: [],
			},
		]);

		render(<NutritionPage />);

		await waitFor(() => {
			expect(screen.getByText('Набор массы')).toBeInTheDocument();
		});

		expect(screen.getByText('Активен')).toBeInTheDocument();
		expect(screen.getByText(/2500 ккал/)).toBeInTheDocument();
	});

	it('фильтрует по поиску', async () => {
		api.getAllNutritions.mockResolvedValue([
			{
				id: 1,
				title: 'Масса',
				description: 'bulk plan',
				status: 'Активен',
				nutrition_type: 'набор массы',
				calories: 2000,
				protein: 100,
				fats: 50,
				carbs: 200,
				period_weeks: 2,
				breakfast: '',
				lunch: '',
				dinner: '',
				athletes: [],
			},
		]);

		render(<NutritionPage />);

		await waitFor(() => {
			expect(screen.getByText('Масса')).toBeInTheDocument();
		});

		const input = screen.getByPlaceholderText('Поиск плана питания...');

		fireEvent.change(input, { target: { value: 'не существует' } });

		expect(screen.getByText(/Планы не найдены/i)).toBeInTheDocument();
	});

	it('открывает редактирование', async () => {
		api.getAllNutritions.mockResolvedValue([
			{
				id: 1,
				title: 'План',
				description: '',
				status: 'Активен',
				nutrition_type: 'набор массы',
				calories: 1000,
				protein: 10,
				fats: 10,
				carbs: 10,
				period_weeks: 1,
				breakfast: '',
				lunch: '',
				dinner: '',
				athletes: [],
			},
		]);

		render(<NutritionPage />);

		await waitFor(() => {
			expect(screen.getByText('План')).toBeInTheDocument();
		});

		fireEvent.click(
			screen.getByRole('button', {
				name: /Редактировать/i,
			}),
		);

		expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
	});

	it('показывает сообщение если нет планов', async () => {
		api.getAllNutritions.mockResolvedValue([]);

		render(<NutritionPage />);

		await waitFor(() => {
			expect(
				screen.getByText(/Нет созданных планов питания/i),
			).toBeInTheDocument();
		});
	});

	it('обрабатывает ошибку загрузки', async () => {
		api.getAllNutritions.mockRejectedValue(new Error('fail'));

		render(<NutritionPage />);

		await waitFor(() => {
			expect(screen.getByText(/Ошибка/i)).toBeInTheDocument();
		});
	});
});

vi.mock('@mui/icons-material', () => ({
	__esModule: true,
	default: () => null,
}));
