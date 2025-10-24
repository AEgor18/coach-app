import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MainPage, AthletesPage, AuthPage, NutritionPage, ProfilePage, ReportsPage, TrainingsPage } from '../pages';

export function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<MainPage />} />
				<Route path='/athletes' element={<AthletesPage />} />
				<Route path='/auth' element={<AuthPage />} />
				<Route path='/nutrition' element={<NutritionPage />} />
				<Route path='/profile' element={<ProfilePage />} />
				<Route path='/reports' element={<ReportsPage />} />
				<Route path='/trainings' element={<TrainingsPage />} />
			</Routes>
		</BrowserRouter>
	);
}
