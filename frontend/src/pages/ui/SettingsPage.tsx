import {
	Box,
	Typography,
	Card,
	CardContent,
	TextField,
	Button,
	Avatar,
	IconButton,
	Snackbar,
	Alert,
} from '@mui/material';
import {
	AddPhotoAlternate as AddPhotoIcon,
	Delete as DeleteIcon,
} from '@mui/icons-material';
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	getUser,
	updateUser,
	uploadAvatar,
	deleteAvatar,
} from '../../api/profile';
import { Loading } from '../../components/ui/Loading';
import type { UserData } from '../../types/types';

export const SettingsPage = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState<UserData | null>(null);
	const [loading, setLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [avatarLoading, setAvatarLoading] = useState(false);
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = async () => {
		try {
			setLoading(true);
			const res = await getUser();
			if (res) {
				setUser(res);
				setEmail(res.email);
			}
		} catch (error) {
			console.error('Ошибка загрузки пользователя:', error);
			showSnackbar('Ошибка загрузки профиля', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('access_token');
		navigate('/auth');
	};

	const handleChangeName = (value: string) => {
		setUser((prev) => (prev ? { ...prev, full_name: value } : null));
	};

	const handleChangeEmail = (value: string) => {
		setUser((prev) => (prev ? { ...prev, email: value } : null));
	};

	const handleChangePhone = (value: string) => {
		setUser((prev) => (prev ? { ...prev, phone: value } : null));
	};

	const handleUpdateUser = async () => {
		if (!user) return;
		try {
			setLoading(true);
			await updateUser(user);
			if (email !== user.email) {
				localStorage.removeItem('access_token');
			}
			showSnackbar('Изменения сохранены', 'success');
			window.location.reload();
		} catch (error: any) {
			console.error('Ошибка обновления:', error);
			showSnackbar(error.message || 'Ошибка сохранения', 'error');
		} finally {
			setLoading(false);
		}
	};

	const handleAvatarClick = () => {
		fileInputRef.current?.click();
	};

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file || !user) return;

		if (!['image/jpeg', 'image/png'].includes(file.type)) {
			showSnackbar('Только JPG или PNG', 'error');
			return;
		}
		if (file.size > 2 * 1024 * 1024) {
			showSnackbar('Файл слишком большой (макс. 2 МБ)', 'error');
			return;
		}

		try {
			setAvatarLoading(true);
			await uploadAvatar(file);
			showSnackbar('Аватар успешно загружен', 'success');
			window.location.reload();
		} catch (error: any) {
			console.error('Ошибка загрузки аватара:', error);
			showSnackbar(error.message || 'Ошибка загрузки', 'error');
		} finally {
			setAvatarLoading(false);
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
		}
	};

	const handleDeleteAvatar = async () => {
		if (!user) return;

		try {
			setAvatarLoading(true);
			await deleteAvatar();
			showSnackbar('Аватар удалён', 'success');
			window.location.reload();
		} catch (error: any) {
			console.error('Ошибка удаления аватара:', error);
			showSnackbar(error.message || 'Ошибка удаления', 'error');
		} finally {
			setAvatarLoading(false);
		}
	};

	const showSnackbar = (message: string, severity: 'success' | 'error') => {
		setSnackbar({ open: true, message, severity });
	};

	const handleCloseSnackbar = () => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	};

	const avatarUrl = user?.avatar_url || null;

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
						Фото профиля
					</Typography>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
						<Box sx={{ position: 'relative' }}>
							<Avatar
								sx={{
									width: 100,
									height: 100,
									...(avatarUrl
										? {
												objectFit: 'cover',
												border: '3px solid white',
												boxShadow:
													'0 4px 6px -1px rgba(0, 0, 0, 0.1)',
											}
										: {
												backgroundColor: '#377CD6',
												color: 'white',
												fontSize: '36px',
												border: '3px solid white',
												boxShadow:
													'0 4px 6px -1px rgba(0, 0, 0, 0.1)',
											}),
								}}
								src={avatarUrl}
							>
								{!avatarUrl && user?.full_name
									? user.full_name
											.trim()
											.split(' ')
											.slice(0, 2)
											.map((n) => n[0])
											.join('')
											.toUpperCase()
									: ''}
							</Avatar>

							{avatarUrl && (
								<IconButton
									size='small'
									onClick={handleDeleteAvatar}
									disabled={avatarLoading}
									sx={{
										position: 'absolute',
										top: -8,
										right: -8,
										backgroundColor: '#F56565',
										color: 'white',
										'&:hover': {
											backgroundColor: '#C53030',
										},
										'&.Mui-disabled': {
											backgroundColor: '#F56565',
											opacity: 0.6,
										},
									}}
								>
									<DeleteIcon fontSize='small' />
								</IconButton>
							)}
						</Box>

						<Box
							sx={{
								display: 'flex',
								flexDirection: 'column',
								gap: 1,
							}}
						>
							<Button
								variant='contained'
								component='label'
								disabled={avatarLoading}
								startIcon={<AddPhotoIcon />}
								sx={{
									fontSize: '12px',
									fontWeight: 600,
									backgroundColor: '#377CD6',
									'&:hover': {
										backgroundColor: '#2B6CB0',
										transform: 'translateY(-1px)',
										transition: '0.3s ease-in-out',
									},
								}}
								onClick={handleAvatarClick}
							>
								{avatarUrl ? 'Изменить фото' : 'Добавить фото'}
							</Button>

							<input
								ref={fileInputRef}
								type='file'
								accept='image/jpeg,image/png'
								hidden
								onChange={handleFileChange}
							/>
						</Box>
					</Box>

					<Typography
						variant='caption'
						sx={{ color: '#718096', display: 'block', mt: 1.5 }}
					>
						Допустимые форматы: JPG, PNG. Макс. размер: 2 МБ.
					</Typography>
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
						Профиль тренера
					</Typography>

					<Box>
						<Typography>ФИО</Typography>
						<TextField
							fullWidth
							value={user?.full_name || ''}
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
								value={user?.email || ''}
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
								value={user?.phone || ''}
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
							disabled={loading || avatarLoading}
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
							{loading ? 'Сохранение...' : 'Сохранить изменения'}
						</Button>

						<Button
							variant='outlined'
							disabled={loading || avatarLoading}
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
