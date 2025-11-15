import {
	Box,
	Typography,
	Card,
	CardContent,
	Button,
	TextField,
	Tabs,
	Tab,
	FormControlLabel,
	Checkbox,
	Grid,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { loginUser, registerUser } from '../../api/profile';
import { Header } from '../../components/ui/Header';
import { useNavigate } from 'react-router-dom';

export const AuthPage = () => {
	const navigate = useNavigate();
	const [activeTab, setActiveTab] = useState(0);
	const [loginData, setLoginData] = useState({
		email: '',
		password: '',
	});
	const [registerData, setRegisterData] = useState({
		fullName: '',
		email: '',
		password: '',
		confirmPassword: '',
		phone: '',
	});

	useEffect(() => {
		if (localStorage.getItem('access_token')) {
			navigate('/');
		}
	}, []);

	const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
		setActiveTab(newValue);
	};

	const handleLoginChange =
		(field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			const value =
				field === 'remember'
					? event.target.checked
					: event.target.value;
			setLoginData((prev) => ({
				...prev,
				[field]: value,
			}));
		};

	const handleRegisterChange =
		(field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
			setRegisterData((prev) => ({
				...prev,
				[field]: event.target.value,
			}));
		};

	const handleLoginSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		const res = await loginUser(loginData);
		if (res) {
			localStorage.setItem('access_token', res.access_token);
		}

		navigate('/');
	};

	const handleRegisterSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		if (registerData.confirmPassword != registerData.password) {
			alert('Пароли не совпадают');
			return;
		}
		const data = {
			full_name: registerData.fullName,
			phone: registerData.phone,
			email: registerData.email,
			password: registerData.password,
		};

		await registerUser(data);
		setActiveTab(0);
	};

	return (
		<Box>
			<Header />
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
							sx={{
								fontSize: '28px',
								fontWeight: 'bold',
								mb: 1,
							}}
						>
							Тренерский Центр
						</Typography>
						<Typography
							sx={{
								fontSize: '16px',
								opacity: 0.9,
							}}
						>
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
							'& .Mui-selected': {
								color: '#377CD6',
							},
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
							<Box
								component='form'
								onSubmit={handleLoginSubmit}
								sx={{
									animation: 'fadeIn 0.5s ease',
									'@keyframes fadeIn': {
										from: {
											opacity: 0,
											transform: 'translateY(10px)',
										},
										to: {
											opacity: 1,
											transform: 'translateY(0)',
										},
									},
								}}
							>
								<TextField
									fullWidth
									label='Email'
									type='email'
									value={loginData.email}
									onChange={handleLoginChange('email')}
									placeholder='example@mail.ru'
									required
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
									sx={{ mb: 2 }}
								/>

								{/* <FormControlLabel
								control={
									<Checkbox
										checked={loginData.remember}
										onChange={handleLoginChange('remember')}
										sx={{
											color: '#377CD6',
											'&.Mui-checked': {
												color: '#377CD6',
											},
										}}
									/>
								}
								label='Запомнить меня'
								sx={{ mb: 2 }}
							/> */}

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

								<Box
									sx={{
										textAlign: 'center',
										paddingTop: '20px',
										borderTop: '1px solid #E2E8F0',
										color: '#4A5568',
										fontSize: '14px',
									}}
								>
									{/* <Button
									sx={{
										color: '#377CD6',
										fontWeight: 600,
										textTransform: 'none',
										fontSize: '14px',
										'&:hover': {
											textDecoration: 'underline',
											backgroundColor: 'transparent',
										},
									}}
								>
									Забыли пароль?
								</Button> */}
								</Box>
							</Box>
						)}

						{activeTab === 1 && (
							<Box
								component='form'
								onSubmit={handleRegisterSubmit}
								sx={{
									animation: 'fadeIn 0.5s ease',
									'@keyframes fadeIn': {
										from: {
											opacity: 0,
											transform: 'translateY(10px)',
										},
										to: {
											opacity: 1,
											transform: 'translateY(0)',
										},
									},
								}}
							>
								<TextField
									fullWidth
									label='ФИО'
									value={registerData.fullName}
									onChange={handleRegisterChange('fullName')}
									placeholder='Иванов Алексей Сергеевич'
									required
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
												'password'
											)}
											placeholder='Придумайте пароль'
											required
										/>
									</Grid>
									<Grid item xs={12} sm={6}>
										<TextField
											fullWidth
											label='Подтверждение'
											type='password'
											value={registerData.confirmPassword}
											onChange={handleRegisterChange(
												'confirmPassword'
											)}
											placeholder='Повторите пароль'
											required
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
