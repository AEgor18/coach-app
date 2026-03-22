import React, { useEffect, useState } from 'react';
import {
	Box,
	Grid,
	Card,
	Typography,
	Button,
	TextField,
	Snackbar,
	Alert,
} from '@mui/material';

import {
	deleteReportById,
	getAllReports,
	createReport,
	updateReportById,
} from '../../api/reports';
import { Loading } from '../../components/ui/Loading';
import type { ReportData, ReportFormData } from '../../types/types';
import {
	AddReportModal,
	EditReportModal,
} from '../../components/modals/reports';

export const ReportsPage: React.FC = () => {
	const [reports, setReports] = useState<ReportData[]>([]);
	const [search, setSearch] = useState('');
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedReport, setSelectedReport] = useState<ReportData | null>(
		null,
	);
	const [loading, setLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});

	useEffect(() => {
		fetchReports();
	}, []);

	const fetchReports = async () => {
		try {
			setLoading(true);
			const res = await getAllReports();

			if (res) {
				setReports(res);
			}
		} catch (error) {
			console.log(error);
			showSnackbar('Ошибка при загрузке отчетов', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleAddReport = async (reportData: ReportFormData) => {
		try {
			setLoading(true);
			await createReport(reportData);
			setAddModalOpen(false);
			showSnackbar('Отчет успешно создан', 'success');
			await fetchReports();
		} catch (error) {
			console.log(error);
			showSnackbar('Ошибка при создании отчета', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleEditReport = async (reportData: ReportFormData) => {
		if (!selectedReport) return;

		try {
			setLoading(true);
			await updateReportById(selectedReport.id, reportData);
			setEditModalOpen(false);
			setSelectedReport(null);
			showSnackbar('Отчет успешно обновлен', 'success');
			await fetchReports();
		} catch (error) {
			console.log(error);
			showSnackbar('Ошибка при обновлении отчета', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleOpenEdit = (report: ReportData) => {
		setSelectedReport(report);
		setEditModalOpen(true);
	};

	const handleCloseEdit = () => {
		setEditModalOpen(false);
		setSelectedReport(null);
	};

	const handleDelete = async (id: number) => {
		try {
			setLoading(true);
			await deleteReportById(id);
			showSnackbar('Отчет успешно удален', 'success');
			await fetchReports();
		} catch (error) {
			console.log(error);
			showSnackbar('Ошибка при удалении отчета', 'error');
		} finally {
			setLoading(false);
		}
	};

	const showSnackbar = (message: string, severity: 'success' | 'error') => {
		setSnackbar({
			open: true,
			message,
			severity,
		});
	};

	const handleCloseSnackbar = () => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	};

	const visibleReports = reports.filter((report) => {
		const q = search.trim().toLowerCase();
		if (q && !report.title.toLowerCase().includes(q)) return false;
		return true;
	});

	if (loading && reports.length === 0) {
		return <Loading />;
	}

	return (
		<Box
			sx={{
				backgroundColor: '#F7FAFC',
				minHeight: '100vh',
				p: 3,
			}}
		>
			<Typography
				variant='h4'
				sx={{ fontWeight: 700, color: '#2D3748', mb: 3 }}
			>
				Отчеты
			</Typography>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				{[
					{ label: 'Всего отчетов', value: reports.length },
					{
						label: 'Высокая посещаемость',
						value: reports.filter((r) => r.attendance >= 80).length,
					},
					{
						label: 'Низкая посещаемость',
						value: reports.filter((r) => r.attendance < 60).length,
					},
				].map((stat, idx) => (
					<Grid item xs={12} sm={4} key={idx}>
						<Card
							sx={{
								textAlign: 'center',
								p: 3,
								borderRadius: 2,
								boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
								transition: 'transform 0.2s',
								'&:hover': { transform: 'translateY(-3px)' },
							}}
						>
							<Typography
								sx={{
									fontSize: 32,
									fontWeight: 700,
									color: '#377CD6',
									mb: 1,
								}}
							>
								{stat.value}
							</Typography>
							<Typography sx={{ fontSize: 14, color: '#4A5568' }}>
								{stat.label}
							</Typography>
						</Card>
					</Grid>
				))}
			</Grid>

			<Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4 }}>
				<TextField
					placeholder='Поиск отчета...'
					size='small'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					sx={{
						minWidth: 200,
						backgroundColor: '#E2E8F0',
						borderRadius: 1,
						flex: 1,
						background: '#fff',
					}}
				/>
				<Button
					variant='contained'
					onClick={() => setAddModalOpen(true)}
					sx={{
						backgroundColor: '#377CD6',
						fontWeight: 600,
						fontSize: '14px',
						'&:hover': {
							backgroundColor: '#2B6CB0',
							transform: 'translateY(-1px)',
							boxShadow: '0 6px 12px rgba(55, 124, 214, 0.3)',
						},
						transition: 'all 0.3s ease',
					}}
				>
					Создать отчет
				</Button>
			</Box>

			<Grid container spacing={3}>
				{visibleReports.map((report) => (
					<Grid item xs={12} sm={6} md={4} key={report.id}>
						<Card
							sx={{
								borderRadius: 2,
								p: 3,
								borderLeft: `4px solid ${
									report.attendance >= 80
										? '#48BB78'
										: report.attendance >= 60
											? '#ED8936'
											: '#F56565'
								}`,
								boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
								transition: 'transform 0.2s',
								'&:hover': { transform: 'translateY(-2px)' },
							}}
						>
							<Typography
								variant='h6'
								sx={{
									fontWeight: 700,
									color: '#2D3748',
									mb: 2,
								}}
							>
								{report.title}
							</Typography>

							<Box sx={{ mb: 2 }}>
								<Typography
									sx={{
										fontSize: 12,
										color: '#4A5568',
										mb: 1,
									}}
								>
									Период:{' '}
									{new Date(
										report.start_date,
									).toLocaleDateString()}{' '}
									-{' '}
									{new Date(
										report.end_date,
									).toLocaleDateString()}
								</Typography>
								<Typography
									sx={{
										fontSize: 12,
										color: '#4A5568',
										mb: 1,
									}}
								>
									Создан:{' '}
									{new Date(
										report.created_date,
									).toLocaleDateString()}
								</Typography>
							</Box>

							<Grid container spacing={2} sx={{ mb: 2 }}>
								<Grid item xs={6}>
									<Card
										sx={{
											textAlign: 'center',
											p: 1,
											backgroundColor: '#EBF8FF',
										}}
									>
										<Typography
											sx={{
												fontSize: 20,
												fontWeight: 700,
												color: '#3182CE',
											}}
										>
											{report.attendance}%
										</Typography>
										<Typography
											sx={{
												fontSize: 10,
												color: '#2C5282',
											}}
										>
											Посещаемость
										</Typography>
									</Card>
								</Grid>
								<Grid item xs={6}>
									<Card
										sx={{
											textAlign: 'center',
											p: 1,
											backgroundColor: '#F0FFF4',
										}}
									>
										<Typography
											sx={{
												fontSize: 20,
												fontWeight: 700,
												color: '#38A169',
											}}
										>
											{report.trainings}
										</Typography>
										<Typography
											sx={{
												fontSize: 10,
												color: '#276749',
											}}
										>
											Тренировки
										</Typography>
									</Card>
								</Grid>
								<Grid item xs={6}>
									<Card
										sx={{
											textAlign: 'center',
											p: 1,
											backgroundColor: '#FFF5F5',
										}}
									>
										<Typography
											sx={{
												fontSize: 20,
												fontWeight: 700,
												color: '#E53E3E',
											}}
										>
											{report.skips}
										</Typography>
										<Typography
											sx={{
												fontSize: 10,
												color: '#C53030',
											}}
										>
											Пропуски
										</Typography>
									</Card>
								</Grid>
								<Grid item xs={6}>
									<Card
										sx={{
											textAlign: 'center',
											p: 1,
											backgroundColor: '#EDF2F7',
										}}
									>
										<Typography
											sx={{
												fontSize: 20,
												fontWeight: 700,
												color: '#4A5568',
											}}
										>
											{report.participants}
										</Typography>
										<Typography
											sx={{
												fontSize: 10,
												color: '#2D3748',
											}}
										>
											Участники
										</Typography>
									</Card>
								</Grid>
							</Grid>

							<Box sx={{ display: 'flex', gap: 1 }}>
								<Button
									variant='contained'
									fullWidth
									sx={{
										fontSize: 12,
										fontWeight: 600,
										backgroundColor: '#377CD6',
										'&:hover': {
											backgroundColor: '#2B6CB0',
											transform: 'translateY(-1px)',
										},
										transition: '0.3s ease-in-out',
									}}
									onClick={() => handleOpenEdit(report)}
								>
									Редактировать
								</Button>
								<Button
									variant='contained'
									fullWidth
									sx={{
										fontSize: 12,
										fontWeight: 600,
										backgroundColor: '#F56565',
										'&:hover': {
											backgroundColor: '#C53030',
											transform: 'translateY(-1px)',
										},
										transition: '0.3s ease-in-out',
									}}
									onClick={() => handleDelete(report.id)}
								>
									Удалить
								</Button>
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>

			<AddReportModal
				open={addModalOpen}
				onClose={() => setAddModalOpen(false)}
				onSave={handleAddReport}
				loading={loading}
			/>

			<EditReportModal
				open={editModalOpen}
				onClose={handleCloseEdit}
				onSave={handleEditReport}
				report={selectedReport}
				loading={loading}
			/>

			<Snackbar
				open={snackbar.open}
				autoHideDuration={6000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					variant='filled'
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};
