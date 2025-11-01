import { Box, Typography, Card, Button } from '@mui/material';

export const MainPage = () => {
	const daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
	const calendarDays = [
		{ day: 25, otherMonth: true },
		{ day: 26, otherMonth: true },
		{ day: 27, otherMonth: true },
		{ day: 28, otherMonth: true },
		{ day: 29, otherMonth: true },
		{ day: 30, otherMonth: true },

		{ day: 1 },
		{ day: 2 },
		{ day: 3 },
		{ day: 4 },
		{
			day: 5,
			events: [{ time: '10:00', title: 'Силовая тренировка' }],
		},
		{ day: 6 },
		{ day: 7 },
		{ day: 8 },
		{ day: 9 },
		{ day: 10 },
		{
			day: 11,
			current: true,
			events: [
				{ time: '08:30', title: 'Утренняя группа' },
				{ time: '17:00', title: 'Индивидуальная' },
			],
		},
	];

	return (
		<Box>
			<Typography
				variant='h4'
				component='h1'
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
					>
						Декабрь 2025
					</Typography>

					<Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
						<Box
							sx={{
								display: 'flex',
								alignItems: 'center',
								gap: 1,
							}}
						>
							<Button
								sx={{
									minWidth: 'auto',
									color: '#4A5568',
									padding: '5px 10px',
									borderRadius: '5px',
									'&:hover': {
										backgroundColor: '#E2E8F0',
									},
								}}
							>
								‹
							</Button>
							<Typography
								sx={{ fontSize: '14px', color: '#2D3748' }}
							>
								Сегодня
							</Typography>
							<Button
								sx={{
									minWidth: 'auto',
									color: '#4A5568',
									padding: '5px 10px',
									borderRadius: '5px',
									'&:hover': {
										backgroundColor: '#E2E8F0',
									},
								}}
							>
								›
							</Button>
						</Box>

						<Button
							variant='contained'
							sx={{
								backgroundColor: '#377CD6',
								fontWeight: 600,
								fontSize: '14px',
								'&:hover': {
									backgroundColor: '#2B6CB0',
									transform: 'translateY(-1px)',
									boxShadow:
										'0 6px 12px rgba(55, 124, 214, 0.3)',
								},
								transition: 'all 0.3s ease',
							}}
						>
							Создать тренировку
						</Button>
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
									...(dayData.current && { fontWeight: 700 }),
								}}
							>
								{dayData.day}
							</Typography>

							{dayData.events?.map((event, eventIndex) => (
								<Box
									key={eventIndex}
									sx={{
										backgroundColor: '#EBF8FF',
										borderLeft: '3px solid #377CD6',
										padding: '6px 8px',
										mb: 0.5,
										borderRadius: '4px',
										fontSize: '12px',
										cursor: 'pointer',
										transition: 'all 0.2s',
										'&:hover': {
											backgroundColor: '#BEE3F8',
											transform: 'scale(1.02)',
										},
									}}
								>
									<Box
										sx={{
											fontWeight: 600,
											color: '#377CD6',
											fontSize: '11px',
										}}
									>
										{event.time}
									</Box>
									{event.title}
								</Box>
							))}
						</Box>
					))}
				</Box>
			</Card>
		</Box>
	);
};
