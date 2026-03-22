import {
	Box,
	Avatar,
	Typography,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
} from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { sidebarPages } from '../../constants';
import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getUser } from '../../api/profile';

interface User {
	id: number;
	full_name: string;
	email: string;
	role: string;
	is_active: boolean;
	avatar_url?: string | null;
}

export function Sidebar() {
	const location = useLocation();

	const [user, setUser] = useState<User | null>(null);
	const [showName, setShowName] = useState<string>('');

	useEffect(() => {
		fetchUser();
	}, []);

	const fetchUser = async () => {
		try {
			const res = await getUser();

			if (res) {
				setUser(res);
				formatFullName(res.full_name);
			}
		} catch (error) {
			console.error('Ошибка загрузки пользователя');
		}
	};

	const formatFullName = (fullName: string) => {
		const names = fullName.trim().split(' ').filter(Boolean);

		if (names.length === 0) {
			setShowName('?');
		} else if (names.length === 1) {
			setShowName(names[0].slice(0, 1).toUpperCase());
		} else {
			const initials =
				names[0].slice(0, 1).toUpperCase() +
				names[1].slice(0, 1).toUpperCase();
			setShowName(initials);
		}
	};

	const hasAvatar = user?.avatar_url && user.avatar_url.trim() !== '';

	return (
		<Box
			sx={{
				width: 280,
				backgroundColor: '#dae4f7',
				height: 'calc(100vh - 80px)',
				position: 'fixed',
				overflowY: 'auto',
				padding: '30px 20px',
			}}
		>
			<Box sx={{ textAlign: 'center', mb: 5 }}>
				<Avatar
					sx={{
						width: 80,
						height: 80,
						...(hasAvatar
							? {
									objectFit: 'cover',
									border: '3px solid white',
									margin: '0 auto 15px',
									boxShadow:
										'0 4px 6px -1px rgba(0, 0, 0, 0.1)',
								}
							: {
									backgroundColor: 'white',
									color: '#377CD6',
									border: '3px solid white',
									fontSize: '32px',
									margin: '0 auto 15px',
									boxShadow:
										'0 4px 6px -1px rgba(0, 0, 0, 0.1)',
								}),
					}}
					src={user?.avatar_url}
				>
					{!hasAvatar && showName}
				</Avatar>

				<Typography
					sx={{
						fontSize: '18px',
						fontWeight: 600,
						color: '#2D3748',
						marginBottom: '5px',
					}}
				>
					{user?.full_name}
				</Typography>

				<Typography
					sx={{
						color: '#4A5568',
						fontSize: '14px',
					}}
				>
					{user?.role === 'admin'
						? 'Администратор системы'
						: 'Профессиональный тренер'}
				</Typography>
			</Box>

			<List sx={{ p: 0 }}>
				{sidebarPages.map((item) => {
					const isActive = location.pathname === item.link;

					return (
						<ListItem key={item.name} sx={{ p: 0, mb: 1 }}>
							<ListItemButton
								component={Link}
								to={item.link}
								sx={{
									display: 'flex',
									alignItems: 'center',
									padding: '12px 16px',
									borderRadius: '8px',
									transition: 'all 0.3s ease',
									fontWeight: 600,
									textDecoration: 'none',
									...(isActive && {
										backgroundColor: 'white',
										color: '#377CD6',
										boxShadow:
											'0 4px 6px -1px rgba(0, 0, 0, 0.1)',
									}),
									...(!isActive && {
										color: '#2D3748',
										'&:hover': {
											backgroundColor:
												'rgba(255, 255, 255, 0.6)',
											transform: 'translateX(5px)',
										},
									}),
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										marginRight: '12px',
										color: isActive ? '#377CD6' : '#2D3748',
									}}
								>
									{item.icon}
								</ListItemIcon>

								<ListItemText
									primary={item.name}
									sx={{
										'& .MuiTypography-root': {
											fontWeight: 600,
											fontSize: '14px',
										},
									}}
								/>
							</ListItemButton>
						</ListItem>
					);
				})}
			</List>

			{user?.role === 'admin' && (
				<>
					<Divider sx={{ my: 3 }} />

					<List sx={{ p: 0 }}>
						<ListItem sx={{ p: 0 }}>
							<ListItemButton
								component={Link}
								to='/admin'
								sx={{
									padding: '12px 16px',
									borderRadius: '8px',
									fontWeight: 600,
									transition: 'all 0.3s ease',
									color:
										location.pathname === '/admin'
											? '#377CD6'
											: '#2D3748',
									backgroundColor:
										location.pathname === '/admin'
											? 'white'
											: 'transparent',
									boxShadow:
										location.pathname === '/admin'
											? '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
											: 'none',
									'&:hover': {
										backgroundColor:
											'rgba(255, 255, 255, 0.6)',
										transform: 'translateX(5px)',
									},
								}}
							>
								<ListItemIcon
									sx={{
										minWidth: 0,
										marginRight: '12px',
										color:
											location.pathname === '/admin'
												? '#377CD6'
												: '#2D3748',
									}}
								>
									<AdminPanelSettingsIcon />
								</ListItemIcon>

								<ListItemText
									primary='Администрирование'
									sx={{
										'& .MuiTypography-root': {
											fontWeight: 600,
											fontSize: '14px',
										},
									}}
								/>
							</ListItemButton>
						</ListItem>
					</List>
				</>
			)}
		</Box>
	);
}
