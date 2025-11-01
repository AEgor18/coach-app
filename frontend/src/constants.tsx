import {
	CalendarMonth,
	People,
	FitnessCenter,
	Restaurant,
	Assessment,
	Settings,
} from '@mui/icons-material';

export const sidebarPages = [
	{
		name: 'Календарь',
		icon: <CalendarMonth sx={{ color: '#2D3748' }} />,
		link: '/',
	},
	{
		name: 'Спортсмены',
		icon: <People sx={{ color: '#2D3748' }} />,
		link: '/athletes',
	},
	{
		name: 'Тренировки',
		icon: <FitnessCenter sx={{ color: '#2D3748' }} />,
		link: '/trainings',
	},
	{
		name: 'Питание',
		icon: <Restaurant sx={{ color: '#40434a' }} />,
		link: '/nutrition',
	},
	{
		name: 'Отчёты',
		icon: <Assessment sx={{ color: '#2D3748' }} />,
		link: '/reports',
	},
	{
		name: 'Настройки',
		icon: <Settings sx={{ color: '#2D3748' }} />,
		link: '/settings',
	},
];
