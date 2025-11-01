import React from 'react';
import {
	Box,
	Typography,
	Card,
	CardContent,
	Button,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Grid,
} from '@mui/material';

export const ReportsPage = () => {
	return (
		<Box sx={{ backgroundColor: '#F7FAFC', minHeight: '100vh', p: 3 }}>
			<Typography
				variant='h4'
				component='h1'
				sx={{ fontWeight: 700, color: '#2D3748', mb: 4 }}
			>
				Отчёты по посещаемости
			</Typography>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				{[
					{ label: 'Всего отчётов', value: '3' },
					{ label: 'Средняя посещаемость', value: '89%' },
					{ label: 'Создано за месяц', value: '2' },
					{ label: 'Текущая неделя', value: '92%' },
				].map((stat, index) => (
					<Grid item xs={12} sm={6} md={3} key={index}>
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

			<Box
				sx={{
					display: 'flex',
					alignItems: 'center',
					mb: 4,
					flexWrap: 'wrap',
					gap: 2,
				}}
			>
				<FormControl size='small' sx={{ minWidth: 100 }}>
					<InputLabel>Период</InputLabel>
					<Select value='all' label='Период'>
						<MenuItem value='all'>Все периоды</MenuItem>
						<MenuItem value='week'>За неделю</MenuItem>
						<MenuItem value='month'>За месяц</MenuItem>
						<MenuItem value='quarter'>За квартал</MenuItem>
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
					Создать отчет
				</Button>
			</Box>

			<Grid container spacing={3}>
				{[
					{
						name: 'Посещаемость за неделю',
						period: '01.12.2025 - 07.12.2025',
						created: '08.12.2025',
						stats: [
							{ label: 'Посещаемость', value: '92%' },
							{ label: 'Тренировок', value: '18' },
							{ label: 'Пропуска', value: '3' },
							{ label: 'Участников', value: '15' },
						],
					},
					{
						name: 'Посещаемость за ноябрь',
						period: '01.11.2025 - 30.11.2025',
						created: '01.12.2025',
						stats: [
							{ label: 'Посещаемость', value: '87%' },
							{ label: 'Тренировок', value: '65' },
							{ label: 'Пропуска', value: '8' },
							{ label: 'Участников', value: '12' },
						],
					},
					{
						name: 'Посещаемость за октябрь',
						period: '01.10.2025 - 31.10.2025',
						created: '01.11.2025',
						stats: [
							{ label: 'Посещаемость', value: '91%' },
							{ label: 'Тренировок', value: '58' },
							{ label: 'Пропуска', value: '5' },
							{ label: 'Участников', value: '10' },
						],
					},
				].map((report, index) => (
					<Grid item xs={12} md={6} lg={4} key={index}>
						<Card
							sx={{
								borderRadius: 2,
								boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
								borderLeft: '4px solid #3182CE',
								transition: 'transform 0.3s, box-shadow 0.3s',
							}}
						>
							<CardContent>
								<Box
									sx={{
										display: 'flex',
										alignItems: 'flex-start',
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
										📊
									</Box>
									<Box sx={{ flex: 1 }}>
										<Typography
											sx={{
												fontSize: 18,
												fontWeight: 700,
												color: '#2D3748',
												mb: 0.5,
											}}
										>
											{report.name}
										</Typography>
										<Typography
											sx={{
												fontSize: 12,
												color: '#4A5568',
											}}
										>
											{report.period}
										</Typography>
									</Box>
								</Box>

								<Box sx={{ mb: 2 }}>
									<Box
										sx={{
											display: 'flex',
											justifyContent: 'space-between',
											mb: 1,
										}}
									>
										<Typography
											sx={{
												fontSize: 14,
												color: '#4A5568',
											}}
										>
											Создан:
										</Typography>
										<Typography
											sx={{
												fontSize: 14,
												fontWeight: 500,
												color: '#2D3748',
											}}
										>
											{report.created}
										</Typography>
									</Box>
								</Box>

								<Grid container spacing={1.5} sx={{ mb: 2.5 }}>
									{report.stats.map((stat, idx) => (
										<Grid item xs={6} key={idx}>
											<Box
												sx={{
													textAlign: 'center',
													p: 1.5,
													backgroundColor: '#F7FAFC',
													borderRadius: 1,
												}}
											>
												<Typography
													sx={{
														fontSize: 20,
														fontWeight: 700,
														color: '#377CD6',
														mb: 0.5,
													}}
												>
													{stat.value}
												</Typography>
												<Typography
													sx={{
														fontSize: 12,
														color: '#4A5568',
													}}
												>
													{stat.label}
												</Typography>
											</Box>
										</Grid>
									))}
								</Grid>

								<Box sx={{ display: 'flex', gap: 1 }}>
									<Button
										variant='outlined'
										size='small'
										sx={{
											flex: 1,
											color: '#F56565',
											borderColor: '#F56565',
											fontSize: 12,
											fontWeight: 600,
											'&:hover': {
												backgroundColor: '#F56565',
												color: 'white',
												transform: 'translateY(-1px)',
												transition: '0.3s ease-in-out',
											},
										}}
									>
										Удалить
									</Button>
									<Button
										variant='outlined'
										size='small'
										sx={{
											flex: 1,
											fontSize: 12,
											fontWeight: 600,
											'&:hover': {
												transition: '0.3s ease-in-out',
												transform: 'translateY(-1px)',
											},
										}}
									>
										Редактировать
									</Button>
									<Button
										variant='contained'
										size='small'
										sx={{
											flex: 1,
											backgroundColor: '#377CD6',
											fontSize: 12,
											fontWeight: 600,
											'&:hover': {
												backgroundColor: '#2B6CB0',
												transition: '0.3s ease-in-out',
												transform: 'translateY(-1px)',
											},
										}}
									>
										Скачать PDF
									</Button>
								</Box>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Box>
	);
};
