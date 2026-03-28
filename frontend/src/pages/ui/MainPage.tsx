import { Box, Typography, Card, Button, TextField, Chip } from '@mui/material';
import { useEffect, useState, useRef } from 'react';
import { getAllTrainings } from '../../api/trainings';
import { getWeatherByCity } from '../../api/weather';
import type { TrainingsPlan } from '../../types/types';
import Seo from '../../components/Seo';

interface WeatherData {
	city: string;
	temperature: number;
	feels_like: number;
	humidity: number;
	wind_speed: number;
	description: string;
	icon: string;
	recommendation: string;
}

const getEventColor = (type: string) => {
	switch (type) {
		case 'Индивидуальные':
			return '#EBF8FF';
		case 'Групповые':
			return '#F0FFF4';
		case 'Силовые':
			return '#FFF5F5';
		case 'Кардио':
			return '#FAF5FF';
		default:
			return '#EDF2F7';
	}
};

const getEventBorderColor = (type: string) => {
	switch (type) {
		case 'Индивидуальные':
			return '#3182CE';
		case 'Групповые':
			return '#38A169';
		case 'Силовые':
			return '#E53E3E';
		case 'Кардио':
			return '#805AD5';
		default:
			return '#4A5568';
	}
};

const getEventHoverColor = (type: string) => {
	switch (type) {
		case 'Индивидуальные':
			return '#BEE3F8';
		case 'Групповые':
			return '#C6F6D5';
		case 'Силовые':
			return '#FED7D7';
		case 'Кардио':
			return '#E9D8FD';
		default:
			return '#E2E8F0';
	}
};

const getEventTextColor = (type: string) => {
	switch (type) {
		case 'Индивидуальные':
			return '#2C5282';
		case 'Групповые':
			return '#276749';
		case 'Силовые':
			return '#C53030';
		case 'Кардио':
			return '#553C9A';
		default:
			return '#2D3748';
	}
};

const getEventTypeColor = (type: string) => {
	switch (type) {
		case 'Индивидуальные':
			return '#3182CE';
		case 'Групповые':
			return '#38A169';
		case 'Силовые':
			return '#E53E3E';
		case 'Кардио':
			return '#805AD5';
		default:
			return '#4A5568';
	}
};

const formatTrainingTime = (duration: number): string => {
	const hours = Math.floor(duration / 60);
	const minutes = duration % 60;
	return hours > 0
		? `${hours}:${minutes.toString().padStart(2, '0')}`
		: `${minutes} мин`;
};

function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return debouncedValue;
}

const WeatherWidget: React.FC = () => {
	const [weather, setWeather] = useState<WeatherData | null>(null);
	const [cityInput, setCityInput] = useState('Москва');
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const debouncedCity = useDebounce(cityInput, 500);
	const abortControllerRef = useRef<AbortController | null>(null);

	const fetchWeather = async (cityName: string) => {
		if (abortControllerRef.current) {
			abortControllerRef.current.abort();
		}
		abortControllerRef.current = new AbortController();

		try {
			setLoading(true);
			setError(null);
			const data = await getWeatherByCity(cityName);

			if (data?.error || data?.source === 'fallback') {
				setError(
					data?.error?.includes('не найден')
						? 'Город не найден'
						: 'Нет данных о погоде',
				);
				return;
			}

			setWeather(data);
		} catch (err: any) {
			if (err.name !== 'AbortError') {
				const message = err.message?.toLowerCase() || '';
				if (message.includes('404') || message.includes('not found')) {
					setError('Город не найден');
				} else if (message.includes('timeout')) {
					setError('Сервис погоды не отвечает');
				} else {
					setError('Не удалось загрузить погоду');
				}
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (debouncedCity.trim()) {
			fetchWeather(debouncedCity.trim());
		}
	}, [debouncedCity]);

	const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCityInput(e.target.value);
		if (error) setError(null);
	};

	return (
		<Card
			sx={{
				p: 2,
				background: weather
					? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
					: '#F7FAFC',
				color: weather ? 'white' : 'inherit',
				borderRadius: 3,
			}}
			aria-label={`Погода в городе ${weather?.city || cityInput}`}
		>
			<TextField
				fullWidth
				size='small'
				value={cityInput}
				onChange={handleCityChange}
				placeholder='Город...'
				sx={{
					mb: 2,
					'& .MuiInputBase-input': {
						color: weather ? 'white' : 'inherit',
						'&::placeholder': {
							color: weather
								? 'rgba(255,255,255,0.7)'
								: 'rgba(0,0,0,0.4)',
							opacity: 1,
						},
					},
					'& .MuiOutlinedInput-notchedOutline': {
						borderColor: weather
							? 'rgba(255,255,255,0.5)'
							: 'rgba(0,0,0,0.2)',
					},
					'&:hover .MuiOutlinedInput-notchedOutline': {
						borderColor: weather ? 'white' : 'rgba(0,0,0,0.4)',
					},
				}}
				inputProps={{ 'aria-label': 'Введите название города' }}
			/>

			{loading && !weather && (
				<Typography textAlign='center' sx={{ py: 2 }}>
					Загрузка...
				</Typography>
			)}

			{error && (
				<Box
					sx={{
						textAlign: 'center',
						py: 1,
						px: 2,
						backgroundColor: weather
							? 'rgba(255,255,255,0.15)'
							: '#FFF5F5',
						borderRadius: 1,
						mb: 2,
						color: weather ? 'white' : 'error.main',
						fontSize: '13px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						gap: 0.5,
					}}
					role='status'
					aria-live='polite'
				>
					<span>⚠️</span>
					<span>{error}</span>
					{weather && (
						<Typography
							variant='caption'
							sx={{ opacity: 0.8, ml: 1 }}
						>
							(показаны последние данные)
						</Typography>
					)}
				</Box>
			)}

			{weather && (
				<>
					<Box sx={{ textAlign: 'center', mb: 2 }}>
						<Typography variant='h3' fontWeight='bold'>
							{Math.round(weather.temperature)}°C
						</Typography>
						<Typography variant='body1' sx={{ opacity: 0.9 }}>
							{weather.description}
						</Typography>
						{weather.icon && (
							<Box
								component='img'
								src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
								alt={weather.description}
								sx={{ width: 60, height: 60, my: 1 }}
								loading='lazy'
							/>
						)}
					</Box>

					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-around',
							mb: 2,
							fontSize: '12px',
						}}
					>
						<Box sx={{ textAlign: 'center' }}>
							<Typography sx={{ opacity: 0.8 }}>
								Ощущается
							</Typography>
							<Typography fontWeight='bold'>
								{Math.round(weather.feels_like)}°
							</Typography>
						</Box>
						<Box sx={{ textAlign: 'center' }}>
							<Typography sx={{ opacity: 0.8 }}>
								Влажность
							</Typography>
							<Typography fontWeight='bold'>
								{weather.humidity}%
							</Typography>
						</Box>
						<Box sx={{ textAlign: 'center' }}>
							<Typography sx={{ opacity: 0.8 }}>Ветер</Typography>
							<Typography fontWeight='bold'>
								{weather.wind_speed} м/с
							</Typography>
						</Box>
					</Box>

					{weather.recommendation && (
						<Chip
							label={weather.recommendation}
							size='small'
							sx={{
								backgroundColor: 'rgba(255,255,255,0.2)',
								color: 'white',
								fontWeight: 500,
								'& .MuiChip-label': { px: 1 },
							}}
						/>
					)}
				</>
			)}

			{!weather && !loading && !error && (
				<Box
					sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}
				>
					<Typography variant='body2'>
						Введите город, чтобы увидеть погоду
					</Typography>
					<Typography
						variant='caption'
						display='block'
						sx={{ mt: 0.5, opacity: 0.7 }}
					>
						Например: Москва, Санкт-Петербург, Казань
					</Typography>
				</Box>
			)}
		</Card>
	);
};

export const MainPage = () => {
	const [trainings, setTrainings] = useState<TrainingsPlan[]>([]);
	const [currentDate, setCurrentDate] = useState(new Date());
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchTrainings();
	}, []);

	const fetchTrainings = async () => {
		try {
			setLoading(true);
			const data = await getAllTrainings();
			setTrainings(data || []);
		} catch (error) {
			console.error('Ошибка при загрузке тренировок:', error);
		} finally {
			setLoading(false);
		}
	};

	const getMoscowDate = (date: Date): Date => {
		const utcDate = new Date(
			Date.UTC(
				date.getFullYear(),
				date.getMonth(),
				date.getDate(),
				date.getHours(),
				date.getMinutes(),
				date.getSeconds(),
			),
		);
		return new Date(utcDate.getTime() + 60 * 60 * 1000);
	};

	const formatToMoscowDateString = (date: Date): string => {
		return getMoscowDate(date).toISOString().split('T')[0];
	};

	const createMoscowDate = (
		year: number,
		month: number,
		day: number,
	): Date => {
		const date = new Date(Date.UTC(year, month, day, 0, 0, 0));
		return new Date(date.getTime() + 60 * 60 * 1000);
	};

	const getCalendarData = () => {
		const year = currentDate.getFullYear();
		const month = currentDate.getMonth();

		const firstDay = createMoscowDate(year, month, 1);
		const lastDay = createMoscowDate(year, month + 1, 0);

		const firstDayOfWeek = firstDay.getDay();
		const adjustedFirstDayOfWeek =
			firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

		const daysInMonth = lastDay.getDate();
		const days: Array<{
			day: number;
			date: string;
			otherMonth?: boolean;
			current?: boolean;
			events: Array<{
				time: string;
				title: string;
				type: string;
				id: number;
			}>;
		}> = [];

		const prevMonthLastDay = createMoscowDate(year, month, 0).getDate();
		for (
			let i = prevMonthLastDay - adjustedFirstDayOfWeek + 1;
			i <= prevMonthLastDay;
			i++
		) {
			const date = createMoscowDate(year, month - 1, i);
			days.push({
				day: i,
				date: formatToMoscowDateString(date),
				otherMonth: true,
				events: getTrainingsForDate(date),
			});
		}

		const today = getMoscowDate(new Date());
		const todayString = formatToMoscowDateString(today);

		for (let i = 1; i <= daysInMonth; i++) {
			const date = createMoscowDate(year, month, i);
			const dateString = formatToMoscowDateString(date);
			days.push({
				day: i,
				date: dateString,
				current: dateString === todayString,
				events: getTrainingsForDate(date),
			});
		}

		const totalCells = 42;
		const nextMonthDays = totalCells - days.length;
		for (let i = 1; i <= nextMonthDays; i++) {
			const date = createMoscowDate(year, month + 1, i);
			days.push({
				day: i,
				date: formatToMoscowDateString(date),
				otherMonth: true,
				events: getTrainingsForDate(date),
			});
		}

		return days;
	};

	const getTrainingsForDate = (date: Date) => {
		const dateString = formatToMoscowDateString(date);
		return trainings
			.filter((training) => {
				const trainingDate = new Date(training.date + 'T00:00:00Z');
				const trainingDateMoscow = getMoscowDate(trainingDate);
				return (
					formatToMoscowDateString(trainingDateMoscow) === dateString
				);
			})
			.map((training) => ({
				time: formatTrainingTime(training.duration),
				title: training.title,
				type: training.training_type,
				id: training.id,
			}));
	};

	const navigateMonth = (direction: 'prev' | 'next') => {
		setCurrentDate((prev) => {
			const newDate = new Date(prev);
			newDate.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
			return newDate;
		});
	};

	const getMonthName = (date: Date) => {
		const months = [
			'Январь',
			'Февраль',
			'Март',
			'Апрель',
			'Май',
			'Июнь',
			'Июль',
			'Август',
			'Сентябрь',
			'Октябрь',
			'Ноябрь',
			'Декабрь',
		];
		return months[date.getMonth()];
	};

	const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
	const calendarDays = getCalendarData();

	const scheduleSchema = {
		'@context': 'https://schema.org',
		'@type': 'Schedule',
		name: 'Календарь тренировок — Coach App',
		description:
			'Расписание индивидуальных и групповых тренировок для спортсменов',
		scheduleTimezone: 'Europe/Moscow',
		offers: {
			'@type': 'Offer',
			availability: 'https://schema.org/InStock',
		},
	};

	return (
		<>
			<Seo
				title='Календарь тренировок'
				description='Планируйте и отслеживайте тренировки спортсменов: индивидуальные, групповые, силовые и кардио-сессии в удобном календаре.'
				canonical='/trainings/calendar'
				schemaMarkup={scheduleSchema}
			/>

			<Box component='main' aria-label='Календарь тренировок'>
				<Typography
					variant='h4'
					component='h1'
					id='calendar-heading'
					sx={{
						fontSize: '28px',
						fontWeight: 700,
						color: '#2D3748',
						mb: 3,
						textAlign: 'center',
					}}
				>
					Календарь тренировок
				</Typography>

				<Box sx={{ maxWidth: '900px', margin: '0 auto', mb: 3 }}>
					<WeatherWidget />
				</Box>

				<Card
					sx={{
						borderRadius: '12px',
						boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
						padding: '30px',
						maxWidth: '900px',
						margin: '0 auto',
					}}
				>
					<Box
						sx={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'center',
							mb: 3,
						}}
					>
						<Typography
							sx={{
								fontSize: '22px',
								fontWeight: 600,
								color: '#2D3748',
							}}
							aria-live='polite'
						>
							{getMonthName(currentDate)}{' '}
							{currentDate.getFullYear()}
						</Typography>

						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 2,
							}}
						>
							<Box
								sx={{
									display: 'flex',
									alignItems: 'center',
									gap: 1,
								}}
							>
								<Button
									onClick={() => navigateMonth('prev')}
									sx={{
										minWidth: 'auto',
										color: '#4A5568',
										padding: '5px 10px',
										borderRadius: '5px',
										'&:hover': {
											backgroundColor: '#E2E8F0',
										},
									}}
									aria-label='Предыдущий месяц'
								>
									‹
								</Button>
								<Typography
									sx={{ fontSize: '14px', color: '#2D3748' }}
									aria-hidden='true'
								>
									{getMonthName(currentDate)}
								</Typography>
								<Button
									onClick={() => navigateMonth('next')}
									sx={{
										minWidth: 'auto',
										color: '#4A5568',
										padding: '5px 10px',
										borderRadius: '5px',
										'&:hover': {
											backgroundColor: '#E2E8F0',
										},
									}}
									aria-label='Следующий месяц'
								>
									›
								</Button>
							</Box>
						</Box>
					</Box>

					<Box
						sx={{
							display: 'grid',
							gridTemplateColumns: 'repeat(7, 1fr)',
							gap: '1px',
							backgroundColor: '#E2E8F0',
							border: '1px solid #E2E8F0',
							borderRadius: '8px',
							overflow: 'hidden',
						}}
						role='grid'
						aria-labelledby='calendar-heading'
					>
						{daysOfWeek.map((day) => (
							<Box
								key={day}
								sx={{
									backgroundColor: '#377CD6',
									color: 'white',
									padding: '15px 10px',
									textAlign: 'center',
									fontWeight: 600,
									fontSize: '14px',
								}}
								role='columnheader'
								scope='col'
							>
								{day}
							</Box>
						))}

						{calendarDays.map((dayData, index) => (
							<Box
								key={index}
								sx={{
									backgroundColor: 'white',
									padding: '12px 10px',
									minHeight: '100px',
									border: '1px solid #E2E8F0',
									transition: 'background-color 0.2s',
									cursor: 'pointer',
									'&:hover': {
										backgroundColor: '#F7FAFC',
									},
									...(dayData.current && {
										backgroundColor: '#EBF8FF',
										border: '2px solid #377CD6',
									}),
								}}
								role='gridcell'
								aria-selected={dayData.current}
								tabIndex={0}
							>
								<Typography
									sx={{
										fontWeight: 600,
										mb: 1,
										color: dayData.otherMonth
											? '#A0AEC0'
											: dayData.current
												? '#377CD6'
												: '#2D3748',
										...(dayData.current && {
											fontWeight: 700,
										}),
									}}
									component='time'
									dateTime={dayData.date}
								>
									{dayData.day}
								</Typography>

								{dayData.events?.map((event, eventIndex) => (
									<Box
										key={eventIndex}
										sx={{
											backgroundColor: getEventColor(
												event.type,
											),
											borderLeft: `3px solid ${getEventBorderColor(event.type)}`,
											padding: '6px 8px',
											mb: 0.5,
											borderRadius: '4px',
											fontSize: '12px',
											cursor: 'pointer',
											transition: 'all 0.2s',
											'&:hover': {
												backgroundColor:
													getEventHoverColor(
														event.type,
													),
												transform: 'scale(1.02)',
											},
										}}
										onClick={() =>
											console.log(
												'Training clicked:',
												event.id,
											)
										}
										role='article'
										aria-label={`Тренировка: ${event.title}, ${event.type}, длительность ${event.time}`}
									>
										<Box
											sx={{
												fontWeight: 600,
												color: getEventTextColor(
													event.type,
												),
												fontSize: '11px',
												mb: 0.5,
											}}
											component='time'
											dateTime={`PT${event.time.replace(':', 'M')}S`}
										>
											{event.time}
										</Box>
										<Box
											sx={{
												color: getEventTextColor(
													event.type,
												),
												fontSize: '11px',
												lineHeight: 1.2,
											}}
										>
											{event.title}
										</Box>
										<Box
											sx={{
												color: getEventTypeColor(
													event.type,
												),
												fontSize: '10px',
												fontWeight: 600,
												mt: 0.5,
											}}
										>
											{event.type}
										</Box>
									</Box>
								))}
							</Box>
						))}
					</Box>
				</Card>

				{loading && (
					<span className='sr-only' aria-live='polite'>
						Загрузка календаря тренировок...
					</span>
				)}
			</Box>
		</>
	);
};
