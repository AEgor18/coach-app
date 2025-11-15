import { BrowserRouter, Route, Routes } from 'react-router-dom';
import {
	MainPage,
	AthletesPage,
	AuthPage,
	NutritionPage,
	ReportsPage,
	TrainingsPage,
	SettingsPage,
} from '../pages';
import { Layout } from '../components';

export function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route index element={<MainPage />} />
					<Route path='athletes' element={<AthletesPage />} />
					<Route path='nutrition' element={<NutritionPage />} />
					<Route path='reports' element={<ReportsPage />} />
					<Route path='trainings' element={<TrainingsPage />} />
					<Route path='/settings' element={<SettingsPage />} />
				</Route>
				<Route path='/auth' element={<AuthPage />} />
			</Routes>
		</BrowserRouter>
	);
}
