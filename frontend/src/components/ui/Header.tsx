import { AppBar, Toolbar, Typography, Avatar } from '@mui/material';

export function Header() {
	return (
		<AppBar sx={{ background: '#377CD6', height: 80, zIndex: 1000 }}>
			<Toolbar
				sx={{
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				<Typography
					className='text-shadow-amber-50'
					sx={{ fontSize: 24, mt: 2 }}
				>
					Тренерский центр
				</Typography>
			</Toolbar>
		</AppBar>
	);
}
