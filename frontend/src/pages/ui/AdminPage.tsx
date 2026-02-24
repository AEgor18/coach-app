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
			const token = localStorage.getItem('access_token')!;
			const user = await getUser(token);
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
			const token = localStorage.getItem('access_token')!;
			const data = await getAllCoaches(token);
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
			const token = localStorage.getItem('access_token')!;
			await updateRole(confirmDialog.coachId, token);

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

	return (
		<Box sx={{ backgroundColor: '#F7FAFC', minHeight: '100vh', p: 3 }}>
			<Typography
				variant='h4'
				sx={{ mb: 4, fontWeight: 700, color: '#2D3748' }}
			>
				Панель администратора
			</Typography>

			<Grid container spacing={3} sx={{ mb: 4 }}>
				{[
					{ label: 'Всего тренеров', value: coaches.length },
					{
						label: 'Активных',
						value: coaches.filter((c) => c.is_active).length,
					},
					{
						label: 'Администраторов',
						value: coaches.filter((c) => c.role === 'admin').length,
					},
				].map((stat, i) => (
					<Grid item xs={12} sm={4} key={i}>
						<Card
							sx={{
								p: 3,
								textAlign: 'center',
								borderRadius: 2,
								boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
							}}
						>
							<Typography
								sx={{
									fontSize: 32,
									fontWeight: 700,
									color: '#377CD6',
								}}
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

			<Paper
				sx={{
					borderRadius: 3,
					overflow: 'hidden',
					boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
				}}
			>
				<Table>
					<TableHead sx={{ backgroundColor: '#377CD6' }}>
						<TableRow>
							<TableCell sx={{ color: 'white', fontWeight: 600 }}>
								ID
							</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 600 }}>
								ФИО
							</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 600 }}>
								Email
							</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 600 }}>
								Телефон
							</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 600 }}>
								Роль
							</TableCell>
							<TableCell sx={{ color: 'white', fontWeight: 600 }}>
								Статус
							</TableCell>
						</TableRow>
					</TableHead>

					<TableBody>
						{coaches.map((coach) => (
							<TableRow key={coach.id} hover>
								<TableCell>{coach.id}</TableCell>
								<TableCell>{coach.full_name}</TableCell>
								<TableCell>{coach.email}</TableCell>
								<TableCell>{coach.phone}</TableCell>

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
											'& .MuiSelect-select': { py: 0.5 },
										}}
									>
										<MenuItem value='user'>
											Пользователь
										</MenuItem>
										<MenuItem value='admin'>Админ</MenuItem>
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
			>
				<DialogTitle sx={{ color: '#377CD6', fontWeight: 600 }}>
					Повышение до администратора
				</DialogTitle>
				<DialogContent>
					<DialogContentText>
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
			>
				<Alert
					onClose={handleCloseSnackbar}
					severity={snackbar.severity}
					variant='filled'
					sx={{ width: '100%' }}
				>
					{snackbar.message}
				</Alert>
			</Snackbar>
		</Box>
	);
};
