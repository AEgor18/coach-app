import {
	Box,
	Typography,
	Card,
	CardContent,
	TextField,
	Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUser, updateUser } from '../../api/profile';
import { Loading } from '../../components/ui/Loading';
import type { UserData } from '../../types/types';

export const SettingsPage = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState<UserData>({});
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState();

	useEffect(() => {
		if (!localStorage.getItem('access_token')) {
			navigate('/auth');
		}

		fetchUser();
	}, []);

	const fetchUser = async () => {
		try {
			setLoading(true);
			const token = localStorage.getItem('access_token')!;
			const res = await getUser(token);

			if (res) {
				setUser(res);
				setEmail(res.email);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('access_token');
		navigate('/auth');
	};

	const handleChangeName = (value: string) => {
		setUser({ ...user, full_name: value });
	};

	const handleChangeEmail = (value: string) => {
		setUser({ ...user, email: value });
	};

	const handleChangePhone = (value: string) => {
		setUser({ ...user, phone: value });
	};

	const handleUpdateUser = async () => {
		try {
			await updateUser(localStorage.getItem('access_token')!, user);
			if (email != user.email) {
				localStorage.removeItem('access_token');
			}
			window.location.reload();
		} catch (error) {
			console.log(error.message);
		}
	};

	if (loading) {
		return <Loading />;
	}
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
					<Box>
						<Typography>ФИО</Typography>
						<TextField
							fullWidth
							value={user.full_name}
							onChange={(e) => handleChangeName(e.target.value)}
							sx={{ mb: 2.5 }}
							placeholder='Введите ваше имя'
						/>
					</Box>

					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: '1fr 1fr',
							gap: 2,
							mb: 2,
						}}
					>
						<Box>
							<Typography>Почта</Typography>
							<TextField
								fullWidth
								type='email'
								value={user.email}
								onChange={(e) =>
									handleChangeEmail(e.target.value)
								}
								placeholder='Введите вашу почту'
							/>
						</Box>
						<Box>
							<Typography>Телефон</Typography>
							<TextField
								fullWidth
								type='tel'
								value={user.phone}
								onChange={(e) =>
									handleChangePhone(e.target.value)
								}
								placeholder='Введите ваш номер телефона'
							/>
						</Box>
					</Box>
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
							onClick={handleUpdateUser}
						>
							Сохранить изменения
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
							onClick={handleLogout}
						>
							Выйти из системы
						</Button>
					</Box>
				</CardContent>
			</Card>
		</Box>
	);
};
