import React from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Grid,
	Box,
	Typography,
	Divider,
} from '@mui/material';
import type { ReportFormData } from '../../../types/types';

interface AddReportModalProps {
	open: boolean;
	onClose: () => void;
	onSave: (reportData: ReportFormData) => void;
	loading?: boolean;
}

export const AddReportModal: React.FC<AddReportModalProps> = ({
	open,
	onClose,
	onSave,
	loading = false,
}) => {
	const [formData, setFormData] = React.useState<ReportFormData>({
		title: '',
		start_date: new Date().toISOString().split('T')[0],
		end_date: new Date().toISOString().split('T')[0],
		created_date: new Date().toISOString().split('T')[0],
		attendance: 0,
		trainings: 0,
		skips: 0,
		participants: 0,
	});

	const [errors, setErrors] = React.useState<Record<string, string>>({});

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = 'Название отчета обязательно';
		} else if (formData.title.trim().length < 2) {
			newErrors.title = 'Название должно содержать минимум 2 символа';
		}

		if (!formData.start_date) {
			newErrors.start_date = 'Дата начала периода обязательна';
		}

		if (!formData.end_date) {
			newErrors.end_date = 'Дата конца периода обязательна';
		} else if (
			new Date(formData.end_date) < new Date(formData.start_date)
		) {
			newErrors.end_date =
				'Дата конца периода не может быть раньше даты начала';
		}

		if (!formData.created_date) {
			newErrors.created_date = 'Дата создания отчета обязательна';
		}

		if (formData.attendance < 0 || formData.attendance > 100) {
			newErrors.attendance = 'Посещаемость должна быть от 0 до 100%';
		}

		if (formData.trainings < 0) {
			newErrors.trainings =
				'Количество тренировок не может быть отрицательным';
		}

		if (formData.skips < 0) {
			newErrors.skips =
				'Количество пропусков не может быть отрицательным';
		}

		if (formData.participants < 0) {
			newErrors.participants =
				'Количество участников не может быть отрицательным';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			onSave(formData);
		}
	};

	const handleChange =
		(field: keyof ReportFormData) =>
		(event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
			const value = event.target.value;

			if (
				['attendance', 'trainings', 'skips', 'participants'].includes(
					field
				)
			) {
				if (value === '') {
					setFormData((prev) => ({
						...prev,
						[field]: 0,
					}));
				} else {
					const numValue = Number(value);
					if (!isNaN(numValue)) {
						setFormData((prev) => ({
							...prev,
							[field]: numValue,
						}));
					}
				}
			} else {
				setFormData((prev) => ({
					...prev,
					[field]: value as string,
				}));
			}

			if (errors[field]) {
				setErrors((prev) => ({
					...prev,
					[field]: '',
				}));
			}
		};

	const handleClose = () => {
		setFormData({
			title: '',
			start_date: new Date().toISOString().split('T')[0],
			end_date: new Date().toISOString().split('T')[0],
			created_date: new Date().toISOString().split('T')[0],
			attendance: 0,
			trainings: 0,
			skips: 0,
			participants: 0,
		});
		setErrors({});
		onClose();
	};

	return (
		<Dialog
			open={open}
			onClose={handleClose}
			maxWidth='md'
			fullWidth
			PaperProps={{
				sx: {
					borderRadius: 2,
					boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
				},
			}}
		>
			<DialogTitle
				sx={{
					backgroundColor: '#377CD6',
					color: 'white',
					fontWeight: 600,
					py: 2,
				}}
			>
				Создать отчет
			</DialogTitle>

			<DialogContent sx={{ p: 3 }}>
				<Box sx={{ mb: 3, mt: 3 }}>
					<Typography
						variant='subtitle1'
						sx={{
							fontWeight: 600,
							color: '#2D3748',
							mb: 2,
						}}
					>
						Основная информация
					</Typography>

					<TextField
						fullWidth
						label='Название отчета *'
						value={formData.title}
						onChange={handleChange('title')}
						error={!!errors.title}
						helperText={errors.title}
						placeholder='Отчет за январь 2024'
						sx={{ mb: 2 }}
					/>

					<Grid container spacing={2}>
						<Grid item xs={6}>
							<TextField
								fullWidth
								type='date'
								label='Дата начала периода *'
								value={formData.start_date}
								onChange={handleChange('start_date')}
								error={!!errors.start_date}
								helperText={errors.start_date}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>

						<Grid item xs={6}>
							<TextField
								fullWidth
								type='date'
								label='Дата конца периода *'
								value={formData.end_date}
								onChange={handleChange('end_date')}
								error={!!errors.end_date}
								helperText={errors.end_date}
								InputLabelProps={{ shrink: true }}
							/>
						</Grid>
					</Grid>

					<TextField
						fullWidth
						type='date'
						label='Дата создания отчета *'
						value={formData.created_date}
						onChange={handleChange('created_date')}
						error={!!errors.created_date}
						helperText={errors.created_date}
						InputLabelProps={{ shrink: true }}
						sx={{ mt: 2 }}
					/>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Box sx={{ mb: 3 }}>
					<Typography
						variant='subtitle1'
						sx={{
							fontWeight: 600,
							color: '#2D3748',
							mb: 2,
						}}
					>
						Статистика
					</Typography>

					<Grid container spacing={2}>
						<Grid item xs={6} sm={3}>
							<TextField
								fullWidth
								type='number'
								label='Посещаемость (%) *'
								value={formData.attendance}
								onChange={handleChange('attendance')}
								error={!!errors.attendance}
								helperText={errors.attendance}
								inputProps={{ min: 0, max: 100 }}
							/>
						</Grid>
						<Grid item xs={6} sm={3}>
							<TextField
								fullWidth
								type='number'
								label='Тренировки *'
								value={formData.trainings}
								onChange={handleChange('trainings')}
								error={!!errors.trainings}
								helperText={errors.trainings}
								inputProps={{ min: 0 }}
							/>
						</Grid>
						<Grid item xs={6} sm={3}>
							<TextField
								fullWidth
								type='number'
								label='Пропуски *'
								value={formData.skips}
								onChange={handleChange('skips')}
								error={!!errors.skips}
								helperText={errors.skips}
								inputProps={{ min: 0 }}
							/>
						</Grid>
						<Grid item xs={6} sm={3}>
							<TextField
								fullWidth
								type='number'
								label='Участники *'
								value={formData.participants}
								onChange={handleChange('participants')}
								error={!!errors.participants}
								helperText={errors.participants}
								inputProps={{ min: 0 }}
							/>
						</Grid>
					</Grid>
				</Box>

				<Typography
					variant='caption'
					sx={{
						color: '#718096',
						mt: 2,
						display: 'block',
					}}
				>
					* Обязательные поля
				</Typography>
			</DialogContent>

			<DialogActions
				sx={{
					p: 3,
					gap: 1,
					borderTop: '1px solid #E2E8F0',
				}}
			>
				<Button
					onClick={handleClose}
					disabled={loading}
					sx={{
						color: '#4A5568',
						px: 3,
						py: 1,
					}}
				>
					Отмена
				</Button>
				<Button
					variant='contained'
					onClick={handleSubmit}
					disabled={loading}
					sx={{
						backgroundColor: '#377CD6',
						fontWeight: 600,
						px: 3,
						py: 1,
						'&:hover': {
							backgroundColor: '#2B6CB0',
							transform: 'translateY(-1px)',
						},
						transition: 'all 0.2s ease',
					}}
				>
					{loading ? 'Создание...' : 'Создать отчет'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
