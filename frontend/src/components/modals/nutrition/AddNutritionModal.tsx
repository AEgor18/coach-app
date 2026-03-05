import React, { useEffect, useState } from 'react';
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Grid,
	Box,
	Typography,
	Divider,
	Checkbox,
	ListItemText,
	OutlinedInput,
} from '@mui/material';
import type { NutritionFormData, AthletesData } from '../../../types/types';
import { getAllAthletes } from '../../../api/athletes';

interface AddNutritionModalProps {
	open: boolean;
	onClose: () => void;
	onSave: (nutritionData: NutritionFormData) => void;
	loading?: boolean;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250,
		},
	},
};

export const AddNutritionModal: React.FC<AddNutritionModalProps> = ({
	open,
	onClose,
	onSave,
	loading = false,
}) => {
	const [formData, setFormData] = React.useState<NutritionFormData>({
		title: '',
		nutrition_type: 'поддержание',
		status: 'Активен',
		calories: 2000,
		protein: 150,
		fats: 70,
		carbs: 250,
		period_weeks: 4,
		breakfast: '',
		lunch: '',
		dinner: '',
		description: '',
		athlete_ids: [],
	});

	const [athletes, setAthletes] = useState<AthletesData[]>([]);
	const [errors, setErrors] = React.useState<Record<string, string>>({});

	useEffect(() => {
		if (open) {
			fetchAthletes();
		}
	}, [open]);

	const fetchAthletes = async () => {
		try {
			const athletesData = await getAllAthletes();
			setAthletes(athletesData);
		} catch (error) {
			console.error('Ошибка при загрузке спортсменов:', error);
		}
	};

	const validateForm = (): boolean => {
		const newErrors: Record<string, string> = {};

		if (!formData.title.trim()) {
			newErrors.title = 'Название плана обязательно';
		} else if (formData.title.trim().length < 2) {
			newErrors.title = 'Название должно содержать минимум 2 символа';
		}

		if (formData.calories < 500 || formData.calories > 10000) {
			newErrors.calories =
				'Калорийность должна быть от 500 до 10000 ккал';
		}

		if (formData.protein < 0 || formData.protein > 500) {
			newErrors.protein = 'Белки должны быть от 0 до 500 г';
		}

		if (formData.fats < 0 || formData.fats > 300) {
			newErrors.fats = 'Жиры должны быть от 0 до 300 г';
		}

		if (formData.carbs < 0 || formData.carbs > 1000) {
			newErrors.carbs = 'Углеводы должны быть от 0 до 1000 г';
		}

		if (formData.period_weeks < 1 || formData.period_weeks > 52) {
			newErrors.period_weeks = 'Период должен быть от 1 до 52 недель';
		}

		if (!formData.breakfast.trim()) {
			newErrors.breakfast = 'Завтрак обязателен';
		}

		if (!formData.lunch.trim()) {
			newErrors.lunch = 'Обед обязателен';
		}

		if (!formData.dinner.trim()) {
			newErrors.dinner = 'Ужин обязателен';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Описание плана обязательно';
		}

		if (formData.athlete_ids.length === 0) {
			newErrors.athlete_ids = 'Выберите хотя бы одного спортсмена';
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
		(field: keyof NutritionFormData) =>
		(event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
			const value = event.target.value;

			if (
				[
					'calories',
					'protein',
					'fats',
					'carbs',
					'period_weeks',
				].includes(field)
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
			} else if (field === 'athlete_ids') {
				setFormData((prev) => ({
					...prev,
					[field]: value as number[],
				}));
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
			nutrition_type: 'поддержание',
			status: 'Активен',
			calories: 2000,
			protein: 150,
			fats: 70,
			carbs: 250,
			period_weeks: 4,
			breakfast: '',
			lunch: '',
			dinner: '',
			description: '',
			athlete_ids: [],
		});
		setErrors({});
		onClose();
	};

	const getAthleteName = (athleteId: number) => {
		const athlete = athletes.find((a) => a.id === athleteId);
		return athlete ? `${athlete.name} (${athlete.sport_type})` : '';
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
				Создать план питания
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
						label='Название плана *'
						value={formData.title}
						onChange={handleChange('title')}
						error={!!errors.title}
						helperText={errors.title}
						placeholder='План питания для набора мышечной массы'
						sx={{ mb: 2 }}
					/>

					<Grid container spacing={2}>
						<Grid item xs={6}>
							<FormControl fullWidth>
								<InputLabel>Тип плана *</InputLabel>
								<Select
									value={formData.nutrition_type}
									onChange={handleChange('nutrition_type')}
									label='Тип плана *'
								>
									<MenuItem value='набор массы'>
										Набор массы
									</MenuItem>
									<MenuItem value='снижение веса'>
										Снижение веса
									</MenuItem>
									<MenuItem value='поддержание'>
										Поддержание
									</MenuItem>
									<MenuItem value='восстановление'>
										Восстановление
									</MenuItem>
								</Select>
							</FormControl>
						</Grid>

						<Grid item xs={6}>
							<FormControl fullWidth>
								<InputLabel>Статус *</InputLabel>
								<Select
									value={formData.status}
									onChange={handleChange('status')}
									label='Статус *'
								>
									<MenuItem value='Активен'>Активен</MenuItem>
									<MenuItem value='Завершен'>
										Завершен
									</MenuItem>
								</Select>
							</FormControl>
						</Grid>
					</Grid>
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
						Нутриенты
					</Typography>

					<Grid container spacing={2}>
						<Grid item xs={6} sm={3}>
							<TextField
								fullWidth
								type='number'
								label='Калории *'
								value={formData.calories}
								onChange={handleChange('calories')}
								error={!!errors.calories}
								helperText={errors.calories}
								inputProps={{ min: 500, max: 10000 }}
							/>
						</Grid>
						<Grid item xs={6} sm={3}>
							<TextField
								fullWidth
								type='number'
								label='Белки (г) *'
								value={formData.protein}
								onChange={handleChange('protein')}
								error={!!errors.protein}
								helperText={errors.protein}
								inputProps={{ min: 0, max: 500 }}
							/>
						</Grid>
						<Grid item xs={6} sm={3}>
							<TextField
								fullWidth
								type='number'
								label='Жиры (г) *'
								value={formData.fats}
								onChange={handleChange('fats')}
								error={!!errors.fats}
								helperText={errors.fats}
								inputProps={{ min: 0, max: 300 }}
							/>
						</Grid>
						<Grid item xs={6} sm={3}>
							<TextField
								fullWidth
								type='number'
								label='Углеводы (г) *'
								value={formData.carbs}
								onChange={handleChange('carbs')}
								error={!!errors.carbs}
								helperText={errors.carbs}
								inputProps={{ min: 0, max: 1000 }}
							/>
						</Grid>
					</Grid>

					<TextField
						fullWidth
						type='number'
						label='Период (недели) *'
						value={formData.period_weeks}
						onChange={handleChange('period_weeks')}
						error={!!errors.period_weeks}
						helperText={errors.period_weeks}
						inputProps={{ min: 1, max: 52 }}
						sx={{ mt: 2, maxWidth: 200 }}
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
						Рацион питания
					</Typography>

					<TextField
						fullWidth
						multiline
						rows={2}
						label='Завтрак *'
						value={formData.breakfast}
						onChange={handleChange('breakfast')}
						error={!!errors.breakfast}
						helperText={errors.breakfast}
						placeholder='Овсяная каша с фруктами, яйца, тосты...'
						sx={{ mb: 2 }}
					/>

					<TextField
						fullWidth
						multiline
						rows={2}
						label='Обед *'
						value={formData.lunch}
						onChange={handleChange('lunch')}
						error={!!errors.lunch}
						helperText={errors.lunch}
						placeholder='Куриная грудка с гречкой, овощной салат...'
						sx={{ mb: 2 }}
					/>

					<TextField
						fullWidth
						multiline
						rows={2}
						label='Ужин *'
						value={formData.dinner}
						onChange={handleChange('dinner')}
						error={!!errors.dinner}
						helperText={errors.dinner}
						placeholder='Рыба на пару с овощами, творог...'
						sx={{ mb: 2 }}
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
						Участники
					</Typography>

					<FormControl fullWidth error={!!errors.athlete_ids}>
						<InputLabel>Спортсмены *</InputLabel>
						<Select
							multiple
							value={formData.athlete_ids}
							onChange={handleChange('athlete_ids')}
							input={<OutlinedInput label='Спортсмены *' />}
							renderValue={(selected) =>
								selected.map(getAthleteName).join(', ')
							}
							MenuProps={MenuProps}
						>
							{athletes.map((athlete) => (
								<MenuItem key={athlete.id} value={athlete.id}>
									<Checkbox
										checked={
											formData.athlete_ids.indexOf(
												athlete.id,
											) > -1
										}
									/>
									<ListItemText
										primary={athlete.name}
										secondary={athlete.sport_type}
									/>
								</MenuItem>
							))}
						</Select>
						{errors.athlete_ids && (
							<Typography
								variant='caption'
								color='error'
								sx={{ mt: 0.5, display: 'block' }}
							>
								{errors.athlete_ids}
							</Typography>
						)}
					</FormControl>
				</Box>

				<Divider sx={{ my: 2 }} />

				<Box>
					<Typography
						variant='subtitle1'
						sx={{
							fontWeight: 600,
							color: '#2D3748',
							mb: 2,
						}}
					>
						Описание
					</Typography>

					<TextField
						fullWidth
						multiline
						rows={4}
						label='Описание плана *'
						value={formData.description}
						onChange={handleChange('description')}
						error={!!errors.description}
						helperText={errors.description}
						placeholder='Опишите цели плана, рекомендации, особенности...'
					/>
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
					{loading ? 'Создание...' : 'Создать план'}
				</Button>
			</DialogActions>
		</Dialog>
	);
};
