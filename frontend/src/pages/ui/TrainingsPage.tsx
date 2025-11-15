import React, { useEffect, useState } from 'react';
import {
	Box,
	Grid,
	Card,
	Typography,
	Button,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Snackbar,
	Alert,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { TrainingsPlan, TrainingFormData } from '../../types/types';
import { Loading } from '../../components/ui/Loading';
import {
	deleteTrainingById,
	getAllTrainings,
	createTraining,
	updateTrainingById,
} from '../../api/trainings';
import {
	AddTrainingModal,
	EditTrainingModal,
} from '../../components/modals/trainings';

export const TrainingsPage = () => {
	const [trainings, setTrainings] = useState<TrainingsPlan[]>([]);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('Все статусы');
	const [typeFilter, setTypeFilter] = useState('Все типы');
	const [loading, setLoading] = useState(false);
	const [addModalOpen, setAddModalOpen] = useState(false);
	const [editModalOpen, setEditModalOpen] = useState(false);
	const [selectedTraining, setSelectedTraining] =
		useState<TrainingsPlan | null>(null);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});

	const navigate = useNavigate();

	useEffect(() => {
		if (!localStorage.getItem('access_token')) {
			navigate('/auth');
		}

		fetchPlans();
	}, []);

	const fetchPlans = async () => {
		try {
			setLoading(true);
			const res = await getAllTrainings(
				localStorage.getItem('access_token')!
			);

			if (res) {
				setTrainings(res);
			}
		} catch (error) {
			console.log(error);
			showSnackbar('Ошибка при загрузке тренировок', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleAddTraining = async (trainingData: TrainingFormData) => {
		try {
			setLoading(true);
			await createTraining(
				localStorage.getItem('access_token')!,
				trainingData
			);
			setAddModalOpen(false);
			showSnackbar('Тренировка успешно создана', 'success');
			await fetchPlans();
		} catch (error) {
			console.log(error);
			showSnackbar('Ошибка при создании тренировки', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleEditTraining = async (trainingData: TrainingFormData) => {
		if (!selectedTraining) return;

		try {
			setLoading(true);
			await updateTrainingById(
				localStorage.getItem('access_token')!,
				selectedTraining.id,
				trainingData
			);
			setEditModalOpen(false);
			setSelectedTraining(null);
			showSnackbar('Тренировка успешно обновлена', 'success');
			await fetchPlans();
		} catch (error) {
			console.log(error);
			showSnackbar('Ошибка при обновлении тренировки', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleOpenEdit = (training: TrainingsPlan) => {
		setSelectedTraining(training);
		setEditModalOpen(true);
	};

	const handleCloseEdit = () => {
		setSelectedTraining(null);
		setEditModalOpen(false);
	};

	const handleDelete = async (id: number) => {
		try {
			setLoading(true);
			await deleteTrainingById(localStorage.getItem('access_token')!, id);
			showSnackbar('Тренировка успешно удалена', 'success');
			await fetchPlans();
		} catch (error) {
			console.log(error);
			showSnackbar('Ошибка при удалении тренировки', 'error');
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

	const visible = trainings.filter((t) => {
		const q = search.trim().toLowerCase();
		if (
			q &&
			!`${t.title} ${t.description} ${t.athletes
				.map((a) => a.name)
				.join(' ')}`
				.toLowerCase()
				.includes(q)
		)
			return false;
		if (statusFilter !== 'Все статусы' && t.status !== statusFilter)
			return false;
		if (typeFilter !== 'Все типы' && t.training_type !== typeFilter)
			return false;
		return true;
	});

	if (loading && trainings.length === 0) {
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
				sx={{ fontWeight: 700, color: '#2D3748', mb: 4 }}
			>
				Тренировки
			</Typography>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				{[
					{ label: 'Всего тренировок', value: trainings.length },
					{
						label: 'Запланировано',
						value: trainings.filter(
							(t) => t.status === 'Запланированная'
						).length,
					},
					{
						label: 'Завершено',
						value: trainings.filter(
							(t) => t.status === 'Завершенная'
						).length,
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
					placeholder='Поиск тренировки...'
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
				<FormControl size='small' sx={{ minWidth: 150 }}>
					<InputLabel>Статус</InputLabel>
					<Select
						value={statusFilter}
						onChange={(e) =>
							setStatusFilter(String(e.target.value))
						}
						label='Статус'
					>
						<MenuItem value='Все статусы'>Все статусы</MenuItem>
						<MenuItem value='Запланированная'>
							Запланированные
						</MenuItem>
						<MenuItem value='В процессе'>В процессе</MenuItem>
						<MenuItem value='Завершенная'>Завершенные</MenuItem>
					</Select>
				</FormControl>
				<FormControl size='small' sx={{ minWidth: 150 }}>
					<InputLabel>Тип</InputLabel>
					<Select
						value={typeFilter}
						onChange={(e) => setTypeFilter(String(e.target.value))}
						label='Тип'
					>
						<MenuItem value='Все типы'>Все типы</MenuItem>
						<MenuItem value='Индивидуальные'>
							Индивидуальные
						</MenuItem>
						<MenuItem value='Групповые'>Групповые</MenuItem>
						<MenuItem value='Силовые'>Силовые</MenuItem>
						<MenuItem value='Кардио'>Кардио</MenuItem>
					</Select>
				</FormControl>
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
					Создать тренировку
				</Button>
			</Box>

			<Grid container spacing={3}>
				{visible.map((t) => (
					<Grid item xs={12} sm={6} md={4} key={t.id}>
						<Card
							sx={{
								p: 2,
								borderRadius: 2,
								borderLeft: `4px solid ${
									t.status === 'Запланированная'
										? '#377CD6'
										: t.status === 'В процессе'
										? '#ED8936'
										: '#48BB78'
								}`,
								boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
								transition: 'transform 0.3s',
								minWidth: 300,
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									mb: 2,
								}}
							>
								<Box
									sx={{
										width: 50,
										height: 50,
										borderRadius: 1.5,
										background:
											'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: 'white',
										fontSize: 20,
										mr: 2,
									}}
								>
									🏋️
								</Box>
								<Box sx={{ flex: 1 }}>
									<Typography
										sx={{
											fontSize: 18,
											fontWeight: 700,
											color: '#2D3748',
										}}
									>
										{t.title}
									</Typography>
									<Typography
										sx={{
											fontSize: 12,
											color: '#4A5568',
										}}
									>
										{t.training_type}
									</Typography>
								</Box>
							</Box>

							<Typography
								sx={{
									fontSize: 12,
									color: '#4A5568',
									mb: 1,
								}}
							>
								Дата:{' '}
								<Box component='span' sx={{ color: '#2D3748' }}>
									{t.date}
								</Box>
							</Typography>
							<Typography
								sx={{
									fontSize: 12,
									color: '#4A5568',
									mb: 1,
								}}
							>
								Продолжительность:{' '}
								<Box component='span' sx={{ color: '#2D3748' }}>
									{t.duration} мин
								</Box>
							</Typography>
							<Typography
								sx={{
									fontSize: 12,
									color: '#4A5568',
									mb: 1,
								}}
							>
								Уровень:{' '}
								<Box component='span' sx={{ color: '#2D3748' }}>
									{t.skill_level}
								</Box>
							</Typography>
							<Typography
								sx={{
									fontSize: 12,
									color: '#4A5568',
									mb: 1,
								}}
							>
								Статус:{' '}
								<Box
									component='span'
									sx={{
										color:
											t.status === 'Запланированная'
												? '#377CD6'
												: t.status === 'В процессе'
												? '#ED8936'
												: '#48BB78',
										fontWeight: 600,
									}}
								>
									{t.status}
								</Box>
							</Typography>
							{t.athletes.length > 0 && (
								<Typography
									sx={{
										fontSize: 12,
										color: '#4A5568',
										mb: 1,
									}}
								>
									Участники:{' '}
									<Box
										component='span'
										sx={{ color: '#2D3748' }}
									>
										{t.athletes
											.map((a) => a.name)
											.join(', ')}
									</Box>
								</Typography>
							)}
							{t.description && (
								<Typography
									sx={{
										fontSize: 12,
										backgroundColor: '#E2E8F0',
										borderRadius: 1,
										p: 1,
										mb: 2,
									}}
								>
									{t.description}
								</Typography>
							)}

							<Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
								<Button
									sx={{
										flex: 1,
										backgroundColor: '#377CD6',
										color: 'white',
										'&:hover': {
											backgroundColor: '#2B6CB0',
											transform: 'translateY(-1px)',
											boxShadow:
												'0 6px 12px rgba(55, 124, 214, 0.3)',
											transition: '0.3s ease-in-out',
										},
										fontSize: 12,
										fontWeight: 600,
									}}
									onClick={() => handleOpenEdit(t)}
								>
									Редактировать
								</Button>
								<Button
									sx={{
										flex: 1,
										backgroundColor: '#F56565',
										color: 'white',
										'&:hover': {
											backgroundColor: '#C53030',
											transform: 'translateY(-1px)',
											transition: '0.3s ease-in-out',
										},
										fontSize: 12,
										fontWeight: 600,
									}}
									onClick={() => handleDelete(t.id)}
								>
									Удалить
								</Button>
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>

			{/* Модальное окно добавления */}
			<AddTrainingModal
				open={addModalOpen}
				onClose={() => setAddModalOpen(false)}
				onSave={handleAddTraining}
				loading={loading}
			/>

			{/* Модальное окно редактирования */}
			<EditTrainingModal
				open={editModalOpen}
				onClose={handleCloseEdit}
				onSave={handleEditTraining}
				training={selectedTraining}
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
