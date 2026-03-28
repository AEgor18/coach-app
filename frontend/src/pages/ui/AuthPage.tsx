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
import Seo from '../../components/Seo';

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

	const authSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Coach App — Вход и регистрация',
		description:
			'Профессиональная платформа для тренеров: управление спортсменами, тренировками и питанием',
		applicationCategory: 'SportsApplication',
		operatingSystem: 'Web',
		browserRequirements: 'Requires JavaScript',
		offers: {
			'@type': 'Offer',
			availability: 'https://schema.org/InStock',
			price: '0',
			priceCurrency: 'RUB',
		},
	};

	return (
		<>
			<Seo
				title={
					activeTab === 0 ? 'Вход в систему' : 'Регистрация тренера'
				}
				description='Coach App — профессиональное приложение для тренеров. Управление спортсменами, планирование тренировок, аналитика прогресса и питание в одном месте.'
				canonical={activeTab === 0 ? '/auth/login' : '/auth/register'}
				schemaMarkup={authSchema}
			/>

			<Box component='main' aria-label='Страница авторизации'>
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
						role='status'
						aria-live='polite'
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
						role='region'
						aria-labelledby='auth-card-title'
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
								component={activeTab === 0 ? 'h1' : 'h2'}
								id='auth-card-title'
								sx={{
									fontSize: '28px',
									fontWeight: 'bold',
									mb: 1,
								}}
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
							role='tablist'
							aria-label='Выбор действия: вход или регистрация'
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
							<Tab
								label='Вход'
								role='tab'
								aria-selected={activeTab === 0}
								aria-controls='login-panel'
								id='login-tab'
							/>
							<Tab
								label='Регистрация'
								role='tab'
								aria-selected={activeTab === 1}
								aria-controls='register-panel'
								id='register-tab'
							/>
						</Tabs>

						<CardContent sx={{ p: 3 }}>
							{activeTab === 0 && (
								<Box
									component='form'
									onSubmit={handleLoginSubmit}
									noValidate
									role='form'
									aria-labelledby='login-form-title'
									id='login-panel'
								>
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
										inputProps={{
											'aria-required': 'true',
											'aria-describedby': errors.email
												? 'email-error'
												: undefined,
											autoComplete: 'email',
										}}
										id='login-email'
										name='email'
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
										inputProps={{
											'aria-required': 'true',
											'aria-describedby': errors.password
												? 'password-error'
												: undefined,
											autoComplete: 'current-password',
										}}
										id='login-password'
										name='password'
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
										aria-label='Войти в аккаунт'
									>
										Войти
									</Button>
								</Box>
							)}

							{activeTab === 1 && (
								<Box
									component='form'
									onSubmit={handleRegisterSubmit}
									noValidate
									role='form'
									aria-labelledby='register-form-title'
									id='register-panel'
								>
									<Typography
										id='register-form-title'
										sx={{ srOnly: true }}
									>
										Форма регистрации нового тренера
									</Typography>

									<TextField
										fullWidth
										label='ФИО'
										value={registerData.fullName}
										onChange={handleRegisterChange(
											'fullName',
										)}
										placeholder='Иванов Алексей Сергеевич'
										required
										error={!!errors.fullName}
										helperText={errors.fullName}
										sx={{ mb: 2 }}
										inputProps={{
											'aria-required': 'true',
											'aria-describedby': errors.fullName
												? 'fullname-error'
												: undefined,
											autoComplete: 'name',
										}}
										id='register-fullname'
										name='fullName'
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
										inputProps={{
											'aria-required': 'true',
											'aria-describedby': errors.email
												? 'reg-email-error'
												: undefined,
											autoComplete: 'email',
										}}
										id='register-email'
										name='email'
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
												inputProps={{
													'aria-required': 'true',
													'aria-describedby':
														errors.password
															? 'reg-password-error'
															: undefined,
													autoComplete:
														'new-password',
													minLength: 8,
												}}
												id='register-password'
												name='password'
											/>
										</Grid>
										<Grid item xs={12} sm={6}>
											<TextField
												fullWidth
												label='Подтверждение'
												type='password'
												value={
													registerData.confirmPassword
												}
												onChange={handleRegisterChange(
													'confirmPassword',
												)}
												placeholder='Повторите пароль'
												required
												error={!!errors.confirmPassword}
												helperText={
													errors.confirmPassword
												}
												inputProps={{
													'aria-required': 'true',
													'aria-describedby':
														errors.confirmPassword
															? 'reg-confirm-error'
															: undefined,
													autoComplete:
														'new-password',
												}}
												id='register-confirm'
												name='confirmPassword'
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
										inputProps={{
											'aria-required': 'true',
											'aria-describedby': errors.phone
												? 'phone-error'
												: undefined,
											autoComplete: 'tel',
											pattern:
												'^\+?\d{1,3}?[-.\s]?\(?\d{1,4}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,9}$',
										}}
										id='register-phone'
										name='phone'
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
										aria-label='Зарегистрировать новый аккаунт'
									>
										Зарегистрироваться
									</Button>
								</Box>
							)}
						</CardContent>
					</Card>
				</Box>
			</Box>
		</>
	);
};
