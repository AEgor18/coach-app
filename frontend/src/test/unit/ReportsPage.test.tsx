import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach } from 'vitest';
import { ReportsPage } from '../../pages';

vi.mock('../../api/reports', () => ({
	getAllReports: vi.fn(),
	createReport: vi.fn(),
	updateReportById: vi.fn(),
	deleteReportById: vi.fn(),
}));

vi.mock('../../components/ui/Loading', () => ({
	Loading: () => <div data-testid='loading' />,
}));

vi.mock('../../components/Seo', () => ({
	default: () => null,
}));

vi.mock('../../components/modals/reports', () => ({
	AddReportModal: ({ open }: any) =>
		open ? <div data-testid='add-modal' /> : null,

	EditReportModal: ({ open }: any) =>
		open ? <div data-testid='edit-modal' /> : null,
}));

import * as api from '../../api/reports';

const mockReports = [
	{
		id: 1,
		title: 'Отчет 1',
		start_date: '2024-01-01',
		end_date: '2024-01-10',
		created_date: '2024-01-01',
		attendance: 85,
		trainings: 10,
		skips: 2,
		participants: 12,
	},
	{
		id: 2,
		title: 'Отчет 2',
		start_date: '2024-02-01',
		end_date: '2024-02-10',
		created_date: '2024-02-01',
		attendance: 50,
		trainings: 8,
		skips: 4,
		participants: 9,
	},
];

describe('ReportsPage', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it('показывает заголовок страницы', async () => {
		api.getAllReports.mockResolvedValue(mockReports);

		render(<ReportsPage />);

		await waitFor(() => {
			expect(screen.getByText('Отчеты')).toBeInTheDocument();
		});
	});

	it('загружает отчеты', async () => {
		api.getAllReports.mockResolvedValue(mockReports);

		render(<ReportsPage />);

		await waitFor(() => {
			expect(screen.getByText('Отчет 1')).toBeInTheDocument();
			expect(screen.getByText('Отчет 2')).toBeInTheDocument();
		});
	});

	it('показывает статистику', async () => {
		api.getAllReports.mockResolvedValue(mockReports);

		render(<ReportsPage />);

		await waitFor(() => {
			expect(screen.getByText('Всего отчетов')).toBeInTheDocument();
			expect(
				screen.getByText('Высокая посещаемость'),
			).toBeInTheDocument();
			expect(screen.getByText('Низкая посещаемость')).toBeInTheDocument();
		});
	});

	it('открывает модалку создания отчета', async () => {
		api.getAllReports.mockResolvedValue(mockReports);

		render(<ReportsPage />);

		await waitFor(() => {
			expect(screen.getByText('Отчет 1')).toBeInTheDocument();
		});

		fireEvent.click(
			screen.getByRole('button', {
				name: /создать/i,
			}),
		);

		expect(screen.getByTestId('add-modal')).toBeInTheDocument();
	});

	it('открывает редактирование отчета', async () => {
		api.getAllReports.mockResolvedValue(mockReports);

		render(<ReportsPage />);

		await waitFor(() => {
			expect(screen.getByText('Отчет 1')).toBeInTheDocument();
		});

		fireEvent.click(
			screen.getAllByRole('button', {
				name: /редактировать/i,
			})[0],
		);

		expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
	});
});

vi.mock('@mui/icons-material', () => ({
	__esModule: true,
	default: () => null,
}));
