import {
	Box,
	Typography,
	Card,
	CardContent,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	FormControlLabel,
	Switch,
	Button,
} from '@mui/material';

export const SettingsPage = () => {
	return (
		<Box sx={{ maxWidth: 600, margin: '0 auto' }}>
			<Typography
				variant='h4'
				component='h1'
				sx={{
					fontSize: '28px',
					fontWeight: 700,
					color: '#2D3748',
					mb: 3,
				}}
			>
				Настройки
			</Typography>

			<Card
				sx={{
					borderRadius: '12px',
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
					mb: 3,
				}}
			>
				<CardContent sx={{ p: 3 }}>
					<Typography
						variant='h6'
						sx={{
							fontSize: '18px',
							fontWeight: 600,
							color: '#2D3748',
							mb: 2,
							pb: 1.5,
							borderBottom: '1px solid #E2E8F0',
						}}
					>
						Профиль тренера
					</Typography>

					<TextField
						fullWidth
						label='ФИО'
						value='Иван Петров'
						sx={{ mb: 2.5 }}
					/>

					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 2,
							mb: 2,
						}}
					>
						<TextField
							fullWidth
							label='Email'
							type='email'
							value='i.petrov@trainer.ru'
						/>

						<TextField
							fullWidth
							label='Телефон'
							type='tel'
							value='+7 999 123-45-67'
						/>
					</Box>
				</CardContent>
			</Card>

			<Card
				sx={{
					borderRadius: '12px',
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
					mb: 3,
				}}
			>
				<CardContent sx={{ p: 3 }}>
					<Typography
						variant='h6'
						sx={{
							fontSize: '18px',
							fontWeight: 600,
							color: '#2D3748',
							mb: 2,
							pb: 1.5,
							borderBottom: '1px solid #E2E8F0',
						}}
					>
						Система
					</Typography>

					<FormControl fullWidth sx={{ mb: 2 }}>
						<InputLabel>Язык</InputLabel>
						<Select value='Русский' label='Язык'>
							<MenuItem value='Русский'>Русский</MenuItem>
							<MenuItem value='English'>English</MenuItem>
						</Select>
					</FormControl>

					<FormControlLabel
						control={<Switch color='primary' />}
						label='Тёмная тема'
					/>
				</CardContent>
			</Card>

			<Card
				sx={{
					borderRadius: '12px',
					boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
				}}
			>
				<CardContent sx={{ p: 3 }}>
					<Typography
						variant='h6'
						sx={{
							fontSize: '18px',
							fontWeight: 600,
							color: '#2D3748',
							mb: 2,
							pb: 1.5,
							borderBottom: '1px solid #E2E8F0',
						}}
					>
						Действия
					</Typography>

					<Box
						sx={{
							display: 'flex',
							gap: 1.5,
							flexWrap: 'wrap',
							justifyContent: 'space-around',
						}}
					>
						<Button
							variant='contained'
							sx={{
								fontSize: '12px',
								fontWeight: 600,
								backgroundColor: '#377CD6',
								'&:hover': {
									backgroundColor: '#0f53ab',
									transform: 'translateY(-1px)',
									transition: '0.3s ease-in-out',
								},
							}}
						>
							Сохранить изменения
						</Button>

						<Button
							variant='outlined'
							sx={{
								fontSize: '12px',
								fontWeight: 600,
								color: '#2D3748',
								borderColor: '#E2E8F0',
								backgroundColor: '#E2E8F0',
								'&:hover': {
									backgroundColor: '#CBD5E0',
									transform: 'translateY(-1px)',
									transition: '0.3s ease-in-out',
								},
							}}
						>
							Сменить пароль
						</Button>

						<Button
							variant='outlined'
							sx={{
								color: '#F56565',
								borderColor: '#F56565',
								fontSize: '12px',
								fontWeight: 600,
								'&:hover': {
									backgroundColor: '#F56565',
									color: 'white',
									transform: 'translateY(-1px)',
									transition: '0.3s ease-in-out',
								},
							}}
						>
							Выйти из системы
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
};
