import { screen, waitFor, fireEvent } from '@testing-library/react';
import { AthletesPage } from '../../pages';
import * as api from '../../api/athletes';
import { renderWithProviders } from '../renderWithProviders';
import { vi } from 'vitest';

vi.mock('../../api/athletes');

const mockedGetAll = api.getAllAthletes as unknown as ReturnType<typeof vi.fn>;
const mockedDelete = api.deleteAthleteById as unknown as ReturnType<
	typeof vi.fn
>;

const mockAthletes = [
	{
		id: 1,
		name: 'Иван Иванов',
		status: 'Активен',
		sport_type: 'Бег',
		age: 25,
		phone: '123',
		progress: 80,
	},
];

describe('AthletesPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('отображается заголовок страницы', async () => {
		mockedGetAll.mockResolvedValue({ data: [], total: 0 });

		renderWithProviders(<AthletesPage />);

		expect(
			await screen.findByText(/Управление спортсменами/i),
		).toBeInTheDocument();
	});

	it('загружает и отображает спортсменов', async () => {
		mockedGetAll.mockResolvedValue({
			data: mockAthletes,
			total: 1,
		});

		renderWithProviders(<AthletesPage />);

		expect(await screen.findByText('Иван Иванов')).toBeInTheDocument();
		expect(screen.getByText('Бег')).toBeInTheDocument();
	});

	it('показывает ошибку при загрузке', async () => {
		mockedGetAll.mockRejectedValue(new Error('Ошибка'));

		renderWithProviders(<AthletesPage />);

		expect(
			await screen.findByText(/Ошибка при загрузке спортсменов/i),
		).toBeInTheDocument();
	});

	it('удаляет спортсмена', async () => {
		mockedGetAll.mockResolvedValue({
			data: mockAthletes,
			total: 1,
		});

		mockedDelete.mockResolvedValue({});

		window.confirm = vi.fn(() => true);

		renderWithProviders(<AthletesPage />);

		const deleteBtn = await screen.findByText(/Удалить/i);

		fireEvent.click(deleteBtn);

		await waitFor(() => {
			expect(mockedDelete).toHaveBeenCalledWith(1);
		});
	});
});

vi.mock('@mui/icons-material', () => ({
	__esModule: true,
	default: () => null,
}));
