import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthPage } from '../../pages';
import { BrowserRouter } from 'react-router-dom';

/* -------------------- MOCKS -------------------- */

const navigateMock = vi.fn();

vi.mock('react-router-dom', async () => {
	const actual = await vi.importActual<any>('react-router-dom');
	return {
		...actual,
		useNavigate: () => navigateMock,
	};
});

vi.mock('../../api/profile', () => ({
	loginUser: vi.fn(),
	registerUser: vi.fn(),
}));

vi.mock('../../components/ui/Header', () => ({
	Header: () => <div data-testid='header' />,
}));

vi.mock('../../components/Seo', () => ({
	default: () => null,
}));

/* MUI icons (на всякий случай) */
vi.mock('@mui/icons-material', () => ({
	__esModule: true,
	default: () => null,
}));

/* -------------------- HELPERS -------------------- */

const renderPage = () =>
	render(
		<BrowserRouter>
			<AuthPage />
		</BrowserRouter>,
	);

/* -------------------- TESTS -------------------- */

describe('AuthPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		localStorage.clear();
	});

	it('рендерится страница авторизации', () => {
		renderPage();

		expect(screen.getByTestId('header')).toBeInTheDocument();
		expect(screen.getByText('Тренерский Центр')).toBeInTheDocument();
		expect(screen.getByRole('tab', { name: /вход/i })).toBeInTheDocument();
		expect(
			screen.getByRole('tab', { name: /регистрация/i }),
		).toBeInTheDocument();
	});

	it('переключает вкладку на регистрацию', () => {
		renderPage();

		fireEvent.click(screen.getByRole('tab', { name: /регистрация/i }));

		expect(screen.getByLabelText(/фио/i)).toBeInTheDocument();
		expect(screen.getByLabelText(/телефон/i)).toBeInTheDocument();
	});

	it('валидация login формы (ошибка email)', async () => {
		renderPage();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: 'bad-email' },
		});

		fireEvent.change(screen.getByLabelText(/пароль/i), {
			target: { value: '123' },
		});

		fireEvent.click(screen.getByRole('button', { name: /войти/i }));

		expect(
			await screen.findByText(/корректный email/i),
		).toBeInTheDocument();
	});

	it('успешный login вызывает loginUser и navigate', async () => {
		const { loginUser } = await import('../../api/profile');

		(loginUser as any).mockResolvedValue({
			access_token: 'token',
			refresh_token: 'refresh',
		});

		renderPage();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: 'test@mail.com' },
		});

		fireEvent.change(screen.getByLabelText(/пароль/i), {
			target: { value: '12345678' },
		});

		fireEvent.click(screen.getByRole('button', { name: /войти/i }));

		await waitFor(() => {
			expect(loginUser).toHaveBeenCalled();
			expect(navigateMock).toHaveBeenCalledWith('/');
		});
	});

	it('ошибка login показывает snackbar', async () => {
		const { loginUser } = await import('../../api/profile');

		(loginUser as any).mockRejectedValue({
			response: { data: { detail: 'Ошибка входа' } },
		});

		renderPage();

		fireEvent.change(screen.getByLabelText(/email/i), {
			target: { value: 'test@mail.com' },
		});

		fireEvent.change(screen.getByLabelText(/пароль/i), {
			target: { value: '12345678' },
		});

		fireEvent.click(screen.getByRole('button', { name: /войти/i }));

		expect(await screen.findByText(/ошибка входа/i)).toBeInTheDocument();
	});
});

vi.mock('@mui/icons-material', () => ({
	__esModule: true,
	default: () => null,
}));
