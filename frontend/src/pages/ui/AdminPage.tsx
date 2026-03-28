import {
	Box,
	Typography,
	Card,
	Grid,
	Snackbar,
	Alert,
	Table,
	TableHead,
	TableRow,
	TableCell,
	TableBody,
	Chip,
	Paper,
	Select,
	MenuItem,
	type SelectChangeEvent,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogContentText,
	DialogActions,
	Button,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllCoaches, updateRole } from '../../api/admin';
import { getUser } from '../../api/profile';
import Seo from '../../components/Seo';

interface Coach {
	id: number;
	full_name: string;
	email: string;
	phone: string;
	role: string;
	is_active: boolean;
}

export const AdminPage = () => {
	const [coaches, setCoaches] = useState<Coach[]>([]);
	const [loading, setLoading] = useState(false);

	const [snackbar, setSnackbar] = useState<{
		open: boolean;
		message: string;
		severity: 'error' | 'success';
	}>({
		open: false,
		message: '',
		severity: 'error',
	});

	const [confirmDialog, setConfirmDialog] = useState<{
		open: boolean;
		coachId: number | null;
		newRole: string;
		coachName: string;
	}>({
		open: false,
		coachId: null,
		newRole: '',
		coachName: '',
	});

	const navigate = useNavigate();

	useEffect(() => {
		checkAccess();
	}, []);

	const checkAccess = async () => {
		try {
			const user = await getUser();
			if (!user || user.role !== 'admin') {
				navigate('/');
				return;
			}
			fetchCoaches();
		} catch {
			navigate('/');
		}
	};

	const fetchCoaches = async () => {
		try {
			setLoading(true);
			const data = await getAllCoaches();
			setCoaches(data || []);
		} catch {
			showSnackbar('Ошибка загрузки пользователей', 'error');
		} finally {
			setLoading(false);
		}
	};

	const showSnackbar = (message: string, severity: 'success' | 'error') => {
		setSnackbar({ open: true, message, severity });
	};

	const handleCloseSnackbar = () => {
		setSnackbar((prev) => ({ ...prev, open: false }));
	};

	const handleRoleSelect = (coach: Coach, newRole: string) => {
		if (newRole === coach.role) return;

		if (newRole !== 'admin') {
			showSnackbar('Понижение роли запрещено', 'error');
			return;
		}

		setConfirmDialog({
			open: true,
			coachId: coach.id,
			newRole,
			coachName: coach.full_name,
		});
	};

	const handleConfirmRoleChange = async () => {
		if (!confirmDialog.coachId) return;

		try {
			await updateRole(confirmDialog.coachId);

			setCoaches((prev) =>
				prev.map((coach) =>
					coach.id === confirmDialog.coachId
						? { ...coach, role: 'admin' }
						: coach,
				),
			);

			showSnackbar('Пользователь стал администратором', 'success');
		} catch (err: any) {
			showSnackbar(err.message || 'Ошибка изменения роли', 'error');
		} finally {
			setConfirmDialog({
				open: false,
				coachId: null,
				newRole: '',
				coachName: '',
			});
		}
	};

	const handleCloseDialog = () => {
		setConfirmDialog({
			open: false,
			coachId: null,
			newRole: '',
			coachName: '',
		});
	};

	const adminSchema = {
		'@context': 'https://schema.org',
		'@type': 'WebApplication',
		name: 'Админ-панель — Coach App',
		description: 'Панель управления пользователями и правами доступа',
		applicationCategory: 'AdminDashboard',
		offers: {
			'@type': 'Offer',
			availability: 'https://schema.org/InStock',
		},
	};

	if (loading && coaches.length === 0) {
		return (
			<>
				<Seo
					title='Админ-панель'
					description='Панель управления доступом'
					noIndex={true}
					canonical='/admin'
				/>
				<Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
					<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600' />
				</Box>
			</>
		);
	}

	return (
		<>
			<Seo
				title='Админ-панель'
				description='Панель управления пользователями и правами доступа в системе Coach App.'
				noIndex={true}
				canonical='/admin'
				schemaMarkup={adminSchema}
			/>

			<Box
				component='main'
				aria-label='Панель администратора'
				sx={{ backgroundColor: '#F7FAFC', minHeight: '100vh', p: 3 }}
			>
				<Typography
					variant='h4'
					component='h1'
					id='admin-heading'
					sx={{ mb: 4, fontWeight: 700, color: '#2D3748' }}
				>
					Панель администратора
				</Typography>

				<section aria-labelledby='admin-stats-heading'>
					<Grid container spacing={3} sx={{ mb: 4 }}>
						{[
							{ label: 'Всего тренеров', value: coaches.length },
							{
								label: 'Активных',
								value: coaches.filter((c) => c.is_active)
									.length,
							},
							{
								label: 'Администраторов',
								value: coaches.filter((c) => c.role === 'admin')
									.length,
							},
						].map((stat, i) => (
							<Grid item xs={12} sm={4} key={i}>
								<Card
									sx={{
										p: 3,
										textAlign: 'center',
										borderRadius: 2,
										boxShadow:
											'0 4px 6px -1px rgba(0,0,0,0.1)',
									}}
								>
									<Typography
										sx={{
											fontSize: 32,
											fontWeight: 700,
											color: '#377CD6',
										}}
										aria-label={`${stat.label}: ${stat.value}`}
									>
										{stat.value}
									</Typography>
									<Typography sx={{ color: '#4A5568' }}>
										{stat.label}
									</Typography>
								</Card>
							</Grid>
						))}
					</Grid>
				</section>

				<Paper
					sx={{
						borderRadius: 3,
						overflow: 'hidden',
						boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
					}}
					component='section'
					aria-labelledby='users-table-heading'
				>
					<Table
						role='table'
						aria-label='Список пользователей системы с управлением ролями'
					>
						<TableHead sx={{ backgroundColor: '#377CD6' }}>
							<TableRow>
								<TableCell
									component='th'
									scope='col'
									sx={{ color: 'white', fontWeight: 600 }}
								>
									ID
								</TableCell>
								<TableCell
									component='th'
									scope='col'
									sx={{ color: 'white', fontWeight: 600 }}
								>
									ФИО
								</TableCell>
								<TableCell
									component='th'
									scope='col'
									sx={{ color: 'white', fontWeight: 600 }}
								>
									Email
								</TableCell>
								<TableCell
									component='th'
									scope='col'
									sx={{ color: 'white', fontWeight: 600 }}
								>
									Телефон
								</TableCell>
								<TableCell
									component='th'
									scope='col'
									sx={{ color: 'white', fontWeight: 600 }}
								>
									Роль
								</TableCell>
								<TableCell
									component='th'
									scope='col'
									sx={{ color: 'white', fontWeight: 600 }}
								>
									Статус
								</TableCell>
							</TableRow>
						</TableHead>

						<TableBody component='tbody'>
							{coaches.map((coach) => (
								<TableRow
									key={coach.id}
									hover
									role='row'
									aria-label={`Пользователь: ${coach.full_name}, роль: ${coach.role}`}
								>
									<TableCell component='th' scope='row'>
										{coach.id}
									</TableCell>
									<TableCell>{coach.full_name}</TableCell>
									<TableCell>
										<a
											href={`mailto:${coach.email}`}
											style={{
												color: 'inherit',
												textDecoration: 'none',
											}}
											aria-label={`Написать на ${coach.email}`}
										>
											{coach.email}
										</a>
									</TableCell>
									<TableCell>
										<a
											href={`tel:${coach.phone.replace(/[^\d+]/g, '')}`}
											style={{
												color: 'inherit',
												textDecoration: 'none',
											}}
											aria-label={`Позвонить на ${coach.phone}`}
										>
											{coach.phone}
										</a>
									</TableCell>

									<TableCell>
										<Select
											value={coach.role}
											size='small'
											disabled={coach.role === 'admin'}
											onChange={(e: SelectChangeEvent) =>
												handleRoleSelect(
													coach,
													e.target.value,
												)
											}
											sx={{
												minWidth: 140,
												backgroundColor: 'white',
												'& .MuiSelect-select': {
													py: 0.5,
												},
											}}
											aria-label={`Изменить роль для ${coach.full_name}`}
											MenuProps={{
												anchorOrigin: {
													vertical: 'bottom',
													horizontal: 'left',
												},
												transformOrigin: {
													vertical: 'top',
													horizontal: 'left',
												},
											}}
										>
											<MenuItem value='user'>
												Пользователь
											</MenuItem>
											<MenuItem value='admin'>
												Админ
											</MenuItem>
										</Select>
									</TableCell>

									<TableCell>
										<Chip
											label={
												coach.is_active
													? 'Активен'
													: 'Заблокирован'
											}
											color={
												coach.is_active
													? 'success'
													: 'error'
											}
											size='small'
											aria-label={`Статус аккаунта: ${coach.is_active ? 'активен' : 'заблокирован'}`}
										/>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</Paper>

				<Dialog
					open={confirmDialog.open}
					onClose={handleCloseDialog}
					maxWidth='sm'
					fullWidth
					role='alertdialog'
					aria-labelledby='confirm-dialog-title'
					aria-describedby='confirm-dialog-description'
				>
					<DialogTitle
						id='confirm-dialog-title'
						sx={{ color: '#377CD6', fontWeight: 600 }}
					>
						Повышение до администратора
					</DialogTitle>
					<DialogContent>
						<DialogContentText id='confirm-dialog-description'>
							Вы действительно хотите назначить пользователя
							<strong> {confirmDialog.coachName} </strong>
							администратором системы?
						</DialogContentText>
					</DialogContent>
					<DialogActions sx={{ mb: 1 }}>
						<Button onClick={handleCloseDialog} color='inherit'>
							Отмена
						</Button>
						<Button
							onClick={handleConfirmRoleChange}
							variant='contained'
							color='info'
							autoFocus
						>
							Назначить администратором
						</Button>
					</DialogActions>
				</Dialog>

				<Snackbar
					open={snackbar.open}
					autoHideDuration={5000}
					onClose={handleCloseSnackbar}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
				>
					<Alert
						onClose={handleCloseSnackbar}
						severity={snackbar.severity}
						variant='filled'
						sx={{ width: '100%' }}
						role='status'
						aria-live='polite'
					>
						{snackbar.message}
					</Alert>
				</Snackbar>

				{loading && (
					<span className='sr-only' aria-live='polite'>
						Загрузка списка пользователей...
					</span>
				)}
			</Box>
		</>
	);
};
