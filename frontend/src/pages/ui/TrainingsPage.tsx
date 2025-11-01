import React, { useState } from 'react';
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
} from '@mui/material';

type Training = {
	id: number;
	title: string;
	type: 'Индивидуальная' | 'Групповая' | 'Силовая' | 'Кардио';
	status: 'Запланирована' | 'Завершена' | 'В процессе';
	datetime: string;
	duration: string;
	level: string;
	description: string;
	athletes: string[];
};

const mockTrainings: Training[] = [
	{
		id: 1,
		title: 'Силовая подготовка',
		type: 'Индивидуальная',
		status: 'Запланирована',
		datetime: '15 дек, 10:00',
		duration: '60 минут',
		level: 'Продвинутый',
		description: 'Основной акцент на упражнениях со свободными весами.',
		athletes: ['Алексей Иванов'],
	},
	{
		id: 2,
		title: 'Утреннее кардио',
		type: 'Групповая',
		status: 'Завершена',
		datetime: '14 дек, 08:00',
		duration: '45 минут',
		level: 'Средний',
		description: 'Интервальная тренировка на беговой дорожке и эллипсоиде.',
		athletes: ['Мария С.', 'Екатерина К.', 'Сергей В.'],
	},
	{
		id: 3,
		title: 'Тяжелая атлетика',
		type: 'Силовая',
		status: 'Запланирована',
		datetime: 'Сегодня, 18:00',
		duration: '90 минут',
		level: 'Профессиональный',
		description:
			'Работа с максимальными весами. Становая тяга, приседания, жим лежа.',
		athletes: ['Дмитрий Козлов'],
	},
];

export const TrainingsPage = () => {
	const [trainings, setTrainings] = useState(mockTrainings);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('Все статусы');
	const [typeFilter, setTypeFilter] = useState('Все типы');

	const [editOpen, setEditOpen] = useState(false);
	const [selected, setSelected] = useState<Training | null>(null);

	const handleOpenEdit = (t: Training) => {
		setSelected(t);
		setEditOpen(true);
	};
	const handleCloseEdit = () => {
		setSelected(null);
		setEditOpen(false);
	};
	const handleDelete = (id: number) => {
		setTrainings((prev) => prev.filter((t) => t.id !== id));
	};

	const visible = trainings.filter((t) => {
		const q = search.trim().toLowerCase();
		if (
			q &&
			!`${t.title} ${t.description} ${t.athletes.join(' ')}`
				.toLowerCase()
				.includes(q)
		)
			return false;
		if (statusFilter !== 'Все статусы' && t.status !== statusFilter)
			return false;
		if (typeFilter !== 'Все типы' && t.type !== typeFilter) return false;
		return true;
	});

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
							(t) => t.status === 'Запланирована'
						).length,
					},
					{
						label: 'Завершено',
						value: trainings.filter((t) => t.status === 'Завершена')
							.length,
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
					>
						<MenuItem value='Все статусы'>Все статусы</MenuItem>
						<MenuItem value='Запланирована'>
							Запланированные
						</MenuItem>
						<MenuItem value='Завершена'>Завершенные</MenuItem>
						<MenuItem value='В процессе'>В процессе</MenuItem>
					</Select>
				</FormControl>
				<FormControl size='small' sx={{ minWidth: 150 }}>
					<InputLabel>Тип</InputLabel>
					<Select
						value={typeFilter}
						onChange={(e) => setTypeFilter(String(e.target.value))}
					>
						<MenuItem value='Все типы'>Все типы</MenuItem>
						<MenuItem value='Индивидуальная'>
							Индивидуальные
						</MenuItem>
						<MenuItem value='Групповая'>Групповые</MenuItem>
						<MenuItem value='Силовая'>Силовые</MenuItem>
						<MenuItem value='Кардио'>Кардио</MenuItem>
					</Select>
				</FormControl>
				<Button
					variant='contained'
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
								borderLeft: `4px solid #377CD6`,
								boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
								transition: 'transform 0.3s',
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
										{t.type}
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
									{t.datetime}
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
									{t.duration}
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
									{t.level}
								</Box>
							</Typography>
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
		</Box>
	);
};
