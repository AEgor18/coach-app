import {
	render,
	screen,
	waitFor,
	fireEvent,
	within,
} from '@testing-library/react';
import { AdminPage } from '../../pages';
import * as adminApi from '../../api/admin';
import * as profileApi from '../../api/profile';
import { vi } from 'vitest';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual<any>('react-router-dom');
	return {
		...actual,
		useNavigate: () => mockNavigate,
	};
});

vi.mock('../../components/Seo', () => ({
	default: () => null,
}));

vi.mock('../../api/admin');
vi.mock('../../api/profile');

const mockedGetAll = adminApi.getAllCoaches as unknown as ReturnType<
	typeof vi.fn
>;
const mockedUpdateRole = adminApi.updateRole as unknown as ReturnType<
	typeof vi.fn
>;
const mockedGetUser = profileApi.getUser as unknown as ReturnType<typeof vi.fn>;

const mockCoaches = [
	{
		id: 1,
		full_name: 'Иван Иванов',
		email: 'ivan@test.com',
		phone: '+79990000000',
		role: 'user',
		is_active: true,
	},
	{
		id: 2,
		full_name: 'Admin User',
		email: 'admin@test.com',
		phone: '+79991111111',
		role: 'admin',
		is_active: true,
	},
];

describe('AdminPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('редиректит если не admin', async () => {
		mockedGetUser.mockResolvedValue({ role: 'user' });

		render(<AdminPage />);

		await waitFor(() => {
			expect(mockNavigate).toHaveBeenCalledWith('/');
		});
	});

	it('загружает список пользователей', async () => {
		mockedGetUser.mockResolvedValue({ role: 'admin' });
		mockedGetAll.mockResolvedValue(mockCoaches);

		render(<AdminPage />);

		expect(await screen.findByText('Иван Иванов')).toBeInTheDocument();
		expect(screen.getByText('Admin User')).toBeInTheDocument();
	});

	it('показывает статистику', async () => {
		mockedGetUser.mockResolvedValue({ role: 'admin' });
		mockedGetAll.mockResolvedValue(mockCoaches);

		render(<AdminPage />);

		expect(
			await screen.findByLabelText('Всего тренеров: 2'),
		).toBeInTheDocument();
		expect(screen.getByLabelText('Активных: 2')).toBeInTheDocument();
		expect(screen.getByLabelText('Администраторов: 1')).toBeInTheDocument();
	});

	it('открывает диалог и повышает до admin', async () => {
		mockedGetUser.mockResolvedValue({ role: 'admin' });
		mockedGetAll.mockResolvedValue(mockCoaches);
		mockedUpdateRole.mockResolvedValue({});

		render(<AdminPage />);

		const selects = await screen.findAllByRole('combobox');

		fireEvent.mouseDown(selects[0]);

		const listbox = await screen.findByRole('listbox');
		const adminOption = within(listbox).getByText('Админ');

		fireEvent.click(adminOption);

		const dialog = await screen.findByRole('dialog');
		expect(dialog).toBeInTheDocument();

		const confirmBtn = within(dialog).getByText(
			'Назначить администратором',
		);
		fireEvent.click(confirmBtn);

		await waitFor(() => {
			expect(mockedUpdateRole).toHaveBeenCalledWith(1);
		});
	});
});

vi.mock('@mui/icons-material', () => ({
	__esModule: true,
	default: () => null,
}));
