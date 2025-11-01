import { Box } from '@mui/material';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Outlet } from 'react-router-dom';

export const Layout = () => {
	return (
		<Box sx={{ position: 'relative' }}>
			<Header />
			<Sidebar />
			<Box
				component='main'
				sx={{
					marginLeft: '280px',
					marginTop: '80px',
					padding: 3,
					minHeight: 'calc(100vh - 80px)',
					background: '#f5f7fa',
				}}
			>
				<Outlet />
			</Box>
		</Box>
	);
};
