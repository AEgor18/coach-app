import {
	Box,
	Typography,
	Card,
	CardContent,
	Button,
	TextField,
	Tabs,
	Tab,
	Grid,
	Snackbar,
	Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { loginUser, registerUser } from '../../api/profile';
import { Header } from '../../components/ui/Header';
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState(0);

	const [loginData, setLoginData] = useState({ email: '', password: '' });
	const [registerData, setRegisterData] = useState({
		fullName: '',
		email: '',
		password: '',
		confirmPassword: '',
		phone: '',
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		severity: 'success' as 'success' | 'error',
	});

	useEffect(() => {
		if (localStorage.getItem('access_token')) navigate('/');
	}, []);

	const handleTabChange = (_: any, newValue: number) => {
		setActiveTab(newValue);
		setErrors({});
	};

	const handleLoginChange =
		(field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value;
			setLoginData((prev) => ({ ...prev, [field]: value }));

			// Live validation
			if (field === 'email') {
				if (!value)
					setErrors((prev) => ({ ...prev, email: 'Введите email' }));
				else if (!validateEmail(value))
					setErrors((prev) => ({
						...prev,
						email: 'Введите корректный email',
					}));
				else setErrors((prev) => ({ ...prev, email: '' }));
			}
			if (field === 'password') {
				if (!value)
					setErrors((prev) => ({
						...prev,
						password: 'Введите пароль',
					}));
				else if (value.length < 8)
					setErrors((prev) => ({
						...prev,
						password: 'Минимум 8 символов',
					}));
				else setErrors((prev) => ({ ...prev, password: '' }));
			}
		};

	const handleRegisterChange =
		(field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value;
			setRegisterData((prev) => ({ ...prev, [field]: value }));

			setErrors((prev) => {
				const newErrors = { ...prev };

				if (field === 'fullName')
					newErrors.fullName = value ? '' : 'Введите ФИО';
				if (field === 'email') {
					if (!value) newErrors.email = 'Введите email';
					else if (!validateEmail(value))
						newErrors.email = 'Введите корректный email';
					else newErrors.email = '';
				}
				if (field === 'password') {
					if (!value) newErrors.password = 'Введите пароль';
					else if (value.length < 8)
						newErrors.password = 'Минимум 8 символов';
					else newErrors.password = '';

					if (
						registerData.confirmPassword &&
						value !== registerData.confirmPassword
					)
						newErrors.confirmPassword = 'Пароли не совпадают';
					else if (registerData.confirmPassword)
						newErrors.confirmPassword = '';
				}
				if (field === 'confirmPassword') {
					if (!value) newErrors.confirmPassword = 'Повторите пароль';
					else if (value !== registerData.password)
						newErrors.confirmPassword = 'Пароли не совпадают';
					else newErrors.confirmPassword = '';
				}
				if (field === 'phone') {
					if (!value) newErrors.phone = 'Введите телефон';
					else if (!validatePhone(value))
						newErrors.phone = 'Введите корректный телефон';
					else newErrors.phone = '';
				}
				return newErrors;
			});
		};

	const validateEmail = (email: string) =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const validatePhone = (phone: string) =>
		/^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
			phone,
		);

	const handleLoginSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (!loginData.email || !validateEmail(loginData.email)) {
			setErrors((prev) => ({
				...prev,
				email: 'Введите корректный email',
			}));
			return;
		}
		if (!loginData.password || loginData.password.length < 8) {
			setErrors((prev) => ({
				...prev,
				password: 'Введите корректный пароль',
			}));
			return;
		}

		try {
			const res = await loginUser(loginData);
			if (res) {
				localStorage.setItem('access_token', res.access_token);
				localStorage.setItem('refresh_token', res.refresh_token);
				setSnackbar({
					open: true,
					message: 'Успешный вход!',
					severity: 'success',
				});
				navigate('/');
			}
		} catch (err: any) {
			setSnackbar({
				open: true,
				message:
					err.response?.data?.detail || 'Неверный email или пароль',
				severity: 'error',
			});
		}
	};

	const handleRegisterSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const newErrors: Record<string, string> = {};
		if (!registerData.fullName) newErrors.fullName = 'Введите ФИО';
		if (!registerData.email || !validateEmail(registerData.email))
			newErrors.email = 'Введите корректный email';
		if (!registerData.password || registerData.password.length < 8)
			newErrors.password = 'Минимум 8 символов';
		if (registerData.password !== registerData.confirmPassword)
			newErrors.confirmPassword = 'Пароли не совпадают';
		if (!registerData.phone || !validatePhone(registerData.phone))
			newErrors.phone = 'Введите корректный телефон';

		setErrors(newErrors);
		if (Object.keys(newErrors).some((key) => newErrors[key])) return;

		try {
			const data = {
				full_name: registerData.fullName,
				email: registerData.email,
				phone: registerData.phone,
				password: registerData.password,
			};
			await registerUser(data);
			setSnackbar({
				open: true,
				message: 'Регистрация прошла успешно!',
				severity: 'success',
			});
			setActiveTab(0);
		} catch (err: any) {
			setSnackbar({
				open: true,
				message: err.response?.data?.detail || 'Ошибка регистрации',
				severity: 'error',
			});
		}
	};

	const handleCloseSnackbar = () =>
		setSnackbar((prev) => ({ ...prev, open: false }));

	return (
		<Box>
			<Header />
			<Snackbar
				open={snackbar.open}
				autoHideDuration={4000}
				onClose={handleCloseSnackbar}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>

			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					p: 3,
					mt: 20,
				}}
			>
				<Card
					sx={{
						width: '100%',
						maxWidth: 450,
						borderRadius: '12px',
						boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.1)',
						overflow: 'hidden',
					}}
				>
					<Box
						sx={{
							backgroundColor: '#377CD6',
							color: 'white',
							padding: '30px',
							textAlign: 'center',
						}}
					>
						<Typography
							sx={{ fontSize: '28px', fontWeight: 'bold', mb: 1 }}
						>
							Тренерский Центр
						</Typography>
						<Typography sx={{ fontSize: '16px', opacity: 0.9 }}>
							Профессиональная платформа для тренеров
						</Typography>
					</Box>

					<Tabs
						value={activeTab}
						onChange={handleTabChange}
						variant='fullWidth'
						sx={{
							borderBottom: '1px solid #E2E8F0',
							'& .MuiTab-root': {
								padding: '18px',
								fontSize: '16px',
								fontWeight: 600,
								color: '#4A5568',
								textTransform: 'none',
							},
							'& .Mui-selected': { color: '#377CD6' },
							'& .MuiTabs-indicator': {
								backgroundColor: '#377CD6',
								height: '3px',
							},
						}}
					>
						<Tab label='Вход' />
						<Tab label='Регистрация' />
					</Tabs>

					<CardContent sx={{ p: 3 }}>
						{activeTab === 0 && (
							<Box component='form' onSubmit={handleLoginSubmit}>
								<TextField
									fullWidth
									label='Email'
									type='email'
									value={loginData.email}
									onChange={handleLoginChange('email')}
									placeholder='example@mail.ru'
									required
									error={!!errors.email}
									helperText={errors.email}
									sx={{ mb: 2.5 }}
								/>

								<TextField
									fullWidth
									label='Пароль'
									type='password'
									value={loginData.password}
									onChange={handleLoginChange('password')}
									placeholder='Введите пароль'
									required
									error={!!errors.password}
									helperText={errors.password}
									sx={{ mb: 2 }}
								/>

								<Button
									type='submit'
									fullWidth
									variant='contained'
									sx={{
										backgroundColor: '#377CD6',
										padding: '14px 20px',
										fontSize: '16px',
										fontWeight: 600,
										borderRadius: '8px',
										mb: 2,
										'&:hover': {
											backgroundColor: '#2B6CB0',
											transform: 'translateY(-1px)',
											boxShadow:
												'0 6px 12px rgba(55, 124, 214, 0.3)',
										},
										transition: 'all 0.3s ease',
									}}
								>
									Войти
								</Button>
							</Box>
						)}

						{activeTab === 1 && (
							<Box
								component='form'
								onSubmit={handleRegisterSubmit}
							>
								<TextField
									fullWidth
									label='ФИО'
									value={registerData.fullName}
									onChange={handleRegisterChange('fullName')}
									placeholder='Иванов Алексей Сергеевич'
									required
									error={!!errors.fullName}
									helperText={errors.fullName}
									sx={{ mb: 2 }}
								/>

								<TextField
									fullWidth
									label='Email'
									type='email'
									value={registerData.email}
									onChange={handleRegisterChange('email')}
									placeholder='example@mail.ru'
									required
									error={!!errors.email}
									helperText={errors.email}
									sx={{ mb: 2 }}
								/>

								<Grid container spacing={2} sx={{ mb: 2 }}>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Пароль'
											type='password'
											value={registerData.password}
											onChange={handleRegisterChange(
												'password',
											)}
											placeholder='Придумайте пароль'
											required
											error={!!errors.password}
											helperText={errors.password}
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Подтверждение'
											type='password'
											value={registerData.confirmPassword}
											onChange={handleRegisterChange(
												'confirmPassword',
											)}
											placeholder='Повторите пароль'
											required
											error={!!errors.confirmPassword}
											helperText={errors.confirmPassword}
										/>
									</Grid>
								</Grid>

								<TextField
									fullWidth
									label='Телефон'
									type='tel'
									value={registerData.phone}
									onChange={handleRegisterChange('phone')}
									placeholder='+7 999 123-45-67'
									required
									error={!!errors.phone}
									helperText={errors.phone}
									sx={{ mb: 3 }}
								/>

								<Button
									type='submit'
									fullWidth
									variant='contained'
									sx={{
										backgroundColor: '#377CD6',
										padding: '14px 20px',
										fontSize: '16px',
										fontWeight: 600,
										borderRadius: '8px',
										'&:hover': {
											backgroundColor: '#2B6CB0',
											transform: 'translateY(-1px)',
											boxShadow:
												'0 6px 12px rgba(55, 124, 214, 0.3)',
										},
										transition: 'all 0.3s ease',
									}}
								>
									Зарегистрироваться
								</Button>
							</Box>
						)}
					</CardContent>
				</Card>
			</Box>
		</Box>
	);
};
