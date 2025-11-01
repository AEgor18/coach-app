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
} from '@mui/material';

const mockAthletes = [
	{
		id: 1,
		name: 'Алексей Иванов',
		sport: 'Плавание',
		age: 24,
		phone: '+7 999 123-45-67',
		status: 'active',
		progress: 75,
	},
	{
		id: 2,
		name: 'Мария Смирнова',
		sport: 'Бег',
		age: 28,
		phone: '+7 999 234-56-78',
		status: 'injured',
		progress: 45,
	},
	{
		id: 3,
		name: 'Екатерина Ковалева',
		sport: 'Бег',
		age: 31,
		phone: '+7 999 678-90-12',
		status: 'active',
		progress: 81,
	},
];

export const AthletesPage = () => {
	const [athletes, setAthletes] = useState(mockAthletes);
	const [search, setSearch] = useState('');
	const [statusFilter, setStatusFilter] = useState('Все');
	const [sportFilter, setSportFilter] = useState('Все');

	const filteredAthletes = athletes.filter((a) => {
		if (search && !a.name.toLowerCase().includes(search.toLowerCase()))
			return false;
		if (statusFilter !== 'Все') {
			if (statusFilter === 'Активные' && a.status !== 'active')
				return false;
			if (statusFilter === 'С травмами' && a.status !== 'injured')
				return false;
			if (statusFilter === 'Неактивные' && a.status !== 'inactive')
				return false;
		}
		if (sportFilter !== 'Все' && a.sport !== sportFilter) return false;
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
				sx={{ mb: 3, fontWeight: 700, color: '#2D3748' }}
			>
				Управление спортсменами
			</Typography>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				{[
					{ label: 'Всего спортсменов', value: athletes.length },
					{
						label: 'Активных',
						value: athletes.filter((a) => a.status === 'active')
							.length,
					},
					{
						label: 'С травмами',
						value: athletes.filter((a) => a.status === 'injured')
							.length,
					},
					{
						label: 'Средний прогресс',
						value: `${Math.round(
							athletes.reduce((sum, a) => sum + a.progress, 0) /
								athletes.length
						)}%`,
					},
				].map((stat, i) => (
					<Grid item xs={12} sm={6} md={3} key={i}>
						<Card
							sx={{
								textAlign: 'center',
								p: 3,
								borderRadius: 2,
								boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
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

			<Box
				sx={{
					display: 'flex',
					justifyContent: 'space-between',
					mb: 3,
					flexWrap: 'wrap',
					gap: 2,
				}}
			>
				<TextField
					placeholder='Поиск спортсмена...'
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					size='small'
					sx={{
						backgroundColor: '#FFFFFF',
						borderRadius: 1,
						minWidth: 250,
					}}
				/>
				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
					<FormControl size='small' sx={{ minWidth: 150 }}>
						<InputLabel>Статус</InputLabel>
						<Select
							value={statusFilter}
							onChange={(e) => setStatusFilter(e.target.value)}
							label='Статус'
						>
							<MenuItem value='Все'>Все статусы</MenuItem>
							<MenuItem value='Активные'>Активные</MenuItem>
							<MenuItem value='С травмами'>С травмами</MenuItem>
							<MenuItem value='Неактивные'>Неактивные</MenuItem>
						</Select>
					</FormControl>
					<FormControl size='small' sx={{ minWidth: 150 }}>
						<InputLabel>Вид спорта</InputLabel>
						<Select
							value={sportFilter}
							onChange={(e) => setSportFilter(e.target.value)}
							label='Вид спорта'
						>
							<MenuItem value='Все'>Все виды спорта</MenuItem>
							<MenuItem value='Плавание'>Плавание</MenuItem>
							<MenuItem value='Бег'>Бег</MenuItem>
							<MenuItem value='Силовой тренинг'>
								Силовой тренинг
							</MenuItem>
							<MenuItem value='Йога'>Йога</MenuItem>
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
						Добавить спортсмена
					</Button>
				</Box>
			</Box>

			<Grid container spacing={3}>
				{filteredAthletes.map((a) => (
					<Grid item xs={12} sm={6} md={4} key={a.id}>
						<Card
							sx={{
								borderRadius: 2,
								p: 2,
								borderLeft: `4px solid ${
									a.status === 'active'
										? '#48BB78'
										: a.status === 'injured'
										? '#F56565'
										: '#ED8936'
								}`,
								boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
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
										borderRadius: '50%',
										background:
											'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										color: '#FFFFFF',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										fontWeight: 'bold',
										mr: 2,
									}}
								>
									{a.name
										.split(' ')
										.map((n) => n[0])
										.join('')}
								</Box>
								<Box>
									<Typography sx={{ fontWeight: 700 }}>
										{a.name}
									</Typography>
									<Typography
										sx={{
											fontSize: 12,
											color: '#4A5568',
										}}
									>
										{a.sport}
									</Typography>
									<Chip
										label={
											a.status === 'active'
												? 'Активен'
												: a.status === 'injured'
												? 'Травма'
												: 'Неактивный'
										}
										size='small'
										sx={{ mt: 0.5 }}
									/>
								</Box>
							</Box>
							<Typography sx={{ fontSize: 12, color: '#4A5568' }}>
								Возраст: <strong>{a.age}</strong>
							</Typography>
							<Typography sx={{ fontSize: 12, color: '#4A5568' }}>
								Телефон: <strong>{a.phone}</strong>
							</Typography>
							<Box sx={{ mt: 2 }}>
								<Typography
									sx={{
										fontSize: 12,
										display: 'flex',
										justifyContent: 'space-between',
									}}
								>
									Прогресс за месяц <span>{a.progress}%</span>
								</Typography>
								<Box
									sx={{
										height: 6,
										backgroundColor: '#E2E8F0',
										borderRadius: 3,
										mt: 0.5,
									}}
								>
									<Box
										sx={{
											width: `${a.progress}%`,
											height: '100%',
											background:
												'linear-gradient(90deg, #377CD6, #4FD1C7)',
											borderRadius: 3,
										}}
									></Box>
								</Box>
							</Box>
							<Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
								<Button
									variant='outlined'
									size='small'
									fullWidth
									sx={{
										fontWeight: 600,
										'&:hover': {
											transition: '0.3s ease-in-out',
											transform: 'translateY(-1px)',
										},
									}}
								>
									Профиль
								</Button>
								<Button
									variant='outlined'
									size='small'
									fullWidth
									sx={{
										color: '#2D3748',
										borderColor: '#E2E8F0',
										backgroundColor: '#E2E8F0',
										fontSize: '12px',
										fontWeight: 600,
										'&:hover': {
											backgroundColor: '#CBD5E0',
											transition: '0.3s ease-in-out',
											transform: 'translateY(-1px)',
										},
									}}
								>
									Тренировки
								</Button>
								<Button
									variant='contained'
									size='small'
									sx={{
										backgroundColor: '#377CD6',
										fontWeight: 600,
										fontSize: '12px',
										'&:hover': {
											backgroundColor: '#2B6CB0',
											transform: 'translateY(-1px)',
											boxShadow:
												'0 6px 12px rgba(55, 124, 214, 0.3)',
										},
										transition: 'all 0.3s ease',
										px: 3,
									}}
								>
									Питание
								</Button>
							</Box>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};
