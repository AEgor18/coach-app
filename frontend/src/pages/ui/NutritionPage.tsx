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
	Chip,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	IconButton,
	Divider,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

type NutritionPlan = {
	id: number;
	title: string;
	type: 'Набор массы' | 'Снижение веса' | 'Поддержание' | 'Восстановление';
	status: 'Активен' | 'Завершен';
	calories: number;
	macros: string;
	period: string;
	description: string;
	athletes: string[];
	meals: { time: string; content: string }[];
};

const mockPlans: NutritionPlan[] = [
	{
		id: 1,
		title: 'Массонаборный рацион',
		type: 'Набор массы',
		status: 'Активен',
		calories: 3200,
		macros: '180/80/380',
		period: '8 недель',
		description:
			'Высококалорийная диета с упором на белок для роста мышечной массы. 6 приемов пищи в день.',
		athletes: ['Алексей Иванов', 'Дмитрий Козлов'],
		meals: [
			{
				time: 'Завтрак',
				content: 'Овсянка 100г, яйца 3шт, тост с авокадо',
			},
			{
				time: 'Обед',
				content: 'Гречка 150г, куриная грудка 200г, овощи',
			},
			{ time: 'Ужин', content: 'Рис 120г, лосось 180г, салат' },
		],
	},
];

export const NutritionPage: React.FC = () => {
	const [plans, setPlans] = useState<NutritionPlan[]>(mockPlans);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState<
		'Все' | 'Активен' | 'Завершен'
	>('Все');
	const [typeFilter, setTypeFilter] = useState<'Все' | NutritionPlan['type']>(
		'Все'
	);

	const [editOpen, setEditOpen] = useState(false);
	const [selectedPlan, setSelectedPlan] = useState<NutritionPlan | null>(
		null
	);

	const handleOpenEdit = (plan: NutritionPlan) => {
		setSelectedPlan(plan);
		setEditOpen(true);
	};

	const handleCloseEdit = () => {
		setEditOpen(false);
		setSelectedPlan(null);
	};

	const handleDelete = (id: number) => {
		setPlans((prev) => prev.filter((p) => p.id !== id));
	};

	const visiblePlans = plans.filter((plan) => {
		const q = search.trim().toLowerCase();
		if (
			q &&
			!`${plan.title} ${plan.description} ${plan.athletes.join(' ')}`
				.toLowerCase()
				.includes(q)
		)
			return false;
		if (statusFilter !== 'Все' && plan.status !== statusFilter)
			return false;
		if (typeFilter !== 'Все' && plan.type !== typeFilter) return false;
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
				sx={{ fontWeight: 700, color: '#2D3748', mb: 3 }}
			>
				Управление питанием
			</Typography>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				{[
					{ label: 'Всего планов', value: plans.length },
					{
						label: 'Активных',
						value: plans.filter((p) => p.status === 'Активен')
							.length,
					},
					{
						label: 'Завершено',
						value: plans.filter((p) => p.status === 'Завершен')
							.length,
					},
					{
						label: 'Средняя калорийность',
						value: `${Math.round(
							plans.reduce((a, b) => a + b.calories, 0) /
								plans.length
						)} ккал`,
					},
				].map((stat, i) => (
					<Grid item xs={12} sm={6} md={3} key={i}>
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

			<Grid
				container
				spacing={2}
				alignItems='center'
				justifyContent='space-between'
				mb={3}
			>
				<Grid item xs={12} md={4}>
					<TextField
						fullWidth
						size='small'
						placeholder='Поиск плана...'
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						sx={{ backgroundColor: '#FFFFFF', borderRadius: 1 }}
					/>
				</Grid>

				<Grid item xs={12} md='auto'>
					<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
						<FormControl size='small' sx={{ minWidth: 130 }}>
							<InputLabel>Статус</InputLabel>
							<Select
								value={statusFilter}
								label='Статус'
								onChange={(e) =>
									setStatusFilter(e.target.value as any)
								}
							>
								<MenuItem value='Все'>Все</MenuItem>
								<MenuItem value='Активен'>Активные</MenuItem>
								<MenuItem value='Завершен'>
									Завершенные
								</MenuItem>
							</Select>
						</FormControl>

						<FormControl size='small' sx={{ minWidth: 130 }}>
							<InputLabel>Тип</InputLabel>
							<Select
								value={typeFilter}
								label='Тип'
								onChange={(e) =>
									setTypeFilter(e.target.value as any)
								}
							>
								<MenuItem value='Все'>Все типы</MenuItem>
								<MenuItem value='Набор массы'>
									Набор массы
								</MenuItem>
								<MenuItem value='Снижение веса'>
									Снижение веса
								</MenuItem>
								<MenuItem value='Поддержание'>
									Поддержание
								</MenuItem>
								<MenuItem value='Восстановление'>
									Восстановление
								</MenuItem>
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
									boxShadow:
										'0 6px 12px rgba(55, 124, 214, 0.3)',
								},
								transition: 'all 0.3s ease',
							}}
						>
							Создать план
						</Button>
					</Box>
				</Grid>
			</Grid>

			<Grid container spacing={2}>
				{visiblePlans.map((plan) => (
					<Grid item xs={12} sm={6} md={4} key={plan.id}>
						<Card
							sx={{
								borderRadius: 2,
								p: 2,
								borderLeft: `4px solid ${
									plan.type === 'Набор массы'
										? '#F56565'
										: plan.type === 'Снижение веса'
										? '#48BB78'
										: plan.type === 'Поддержание'
										? '#ED8936'
										: '#377CD6'
								}`,
								boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
								transition: 'all 0.2s ease',
							}}
						>
							<Typography
								sx={{
									fontSize: 16,
									fontWeight: 700,
									color: '#2D3748',
									mb: 0.5,
								}}
							>
								{plan.title}
							</Typography>
							<Typography
								sx={{
									fontSize: 12,
									color: '#4A5568',
									mb: 1,
								}}
							>
								{plan.type}
							</Typography>

							<Chip
								label={plan.status}
								size='small'
								sx={{
									backgroundColor:
										plan.status === 'Активен'
											? '#C6F6D5'
											: '#BEE3F8',
									color:
										plan.status === 'Активен'
											? '#22543D'
											: '#2A4365',
									fontWeight: 600,
									borderRadius: '16px',
									mb: 1.5,
									fontSize: 11,
								}}
							/>

							<Box sx={{ mb: 1.5 }}>
								<Typography
									sx={{
										fontSize: 12,
										color: '#4A5568',
									}}
								>
									Калорийность:{' '}
									<Box
										component='span'
										sx={{ color: '#2D3748' }}
									>
										{plan.calories} ккал
									</Box>
								</Typography>
								<Typography
									sx={{
										fontSize: 12,
										color: '#4A5568',
									}}
								>
									Б/Ж/У:{' '}
									<Box
										component='span'
										sx={{ color: '#2D3748' }}
									>
										{plan.macros}
									</Box>
								</Typography>
								<Typography
									sx={{
										fontSize: 12,
										color: '#4A5568',
									}}
								>
									Период:{' '}
									<Box
										component='span'
										sx={{ color: '#2D3748' }}
									>
										{plan.period}
									</Box>
								</Typography>
							</Box>

							<Typography
								sx={{
									fontSize: 12,
									color: '#2D3748',
									backgroundColor: '#E2E8F0',
									borderRadius: 1,
									p: 1,
									mb: 1.5,
								}}
							>
								{plan.description}
							</Typography>

							<Box sx={{ mb: 1.5 }}>
								<Typography
									sx={{
										fontSize: 12,
										color: '#4A5568',
										mb: 0.5,
									}}
								>
									Пример рациона:
								</Typography>
								{plan.meals.map((meal, i) => (
									<Typography
										key={i}
										sx={{
											fontSize: 12,
											backgroundColor: '#F7FAFC',
											borderRadius: 1,
											p: 0.7,
											mb: 0.5,
										}}
									>
										<strong>{meal.time}:</strong>{' '}
										{meal.content}
									</Typography>
								))}
							</Box>

							<Box sx={{ mb: 1.5 }}>
								<Typography
									sx={{
										fontSize: 12,
										color: '#4A5568',
										mb: 0.5,
									}}
								>
									Спортсмены:
								</Typography>
								<Box
									sx={{
										display: 'flex',
										gap: 0.5,
										flexWrap: 'wrap',
									}}
								>
									{plan.athletes.map((a) => (
										<Chip
											key={a}
											label={a}
											size='small'
											sx={{
												fontSize: 11,
												backgroundColor: '#E2E8F0',
												color: '#2D3748',
											}}
										/>
									))}
								</Box>
							</Box>

							<Divider sx={{ my: 1 }} />

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
											transition: '0.3s ease-in-out',
										},
									}}
									onClick={() => handleOpenEdit(plan)}
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
											transition: '0.3s ease-in-out',
										},
									}}
									onClick={() => handleDelete(plan.id)}
								>
									Удалить
								</Button>
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>

			<Dialog
				open={editOpen}
				onClose={handleCloseEdit}
				maxWidth='md'
				fullWidth
			>
				<DialogTitle
					sx={{
						display: 'flex',
						justifyContent: 'space-between',
						fontWeight: 700,
						color: '#2D3748',
					}}
				>
					Редактирование плана
					<IconButton onClick={handleCloseEdit}>
						<CloseIcon />
					</IconButton>
				</DialogTitle>
				<DialogContent dividers>
					<Box sx={{ mt: 1 }}>
						<TextField
							fullWidth
							label='Название плана'
							defaultValue={selectedPlan?.title}
							sx={{ mb: 2 }}
							size='small'
						/>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth size='small'>
									<InputLabel>Тип</InputLabel>
									<Select
										value={selectedPlan?.type || ''}
										label='Тип'
									>
										<MenuItem value='Набор массы'>
											Набор массы
										</MenuItem>
										<MenuItem value='Снижение веса'>
											Снижение веса
										</MenuItem>
										<MenuItem value='Поддержание'>
											Поддержание
										</MenuItem>
										<MenuItem value='Восстановление'>
											Восстановление
										</MenuItem>
									</Select>
								</FormControl>
							</Grid>
							<Grid item xs={12} sm={6}>
								<FormControl fullWidth size='small'>
									<InputLabel>Статус</InputLabel>
									<Select
										value={selectedPlan?.status || ''}
										label='Статус'
									>
										<MenuItem value='Активен'>
											Активен
										</MenuItem>
										<MenuItem value='Завершен'>
											Завершен
										</MenuItem>
									</Select>
								</FormControl>
							</Grid>
						</Grid>
						<TextField
							fullWidth
							multiline
							rows={3}
							label='Описание'
							defaultValue={selectedPlan?.description}
							sx={{ mt: 2 }}
							size='small'
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button
						onClick={handleCloseEdit}
						sx={{
							backgroundColor: '#E2E8F0',
							color: '#2D3748',
							'&:hover': {
								backgroundColor: '#CBD5E0',
							},
							px: 3,
							fontWeight: 600,
						}}
					>
						Отмена
					</Button>
					<Button
						variant='contained'
						sx={{
							backgroundColor: '#377CD6',
							'&:hover': { backgroundColor: '#2B6CB0' },
							px: 3,
							fontWeight: 600,
						}}
					>
						Сохранить
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
};
