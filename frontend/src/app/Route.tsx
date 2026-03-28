import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Suspense, lazy } from 'react';

import { Layout } from '../components';

const MainPage = lazy(() =>
	import('../pages/ui/MainPage').then((m) => ({ default: m.MainPage })),
);
const AthletesPage = lazy(() =>
	import('../pages/ui/AthletesPage').then((m) => ({
		default: m.AthletesPage,
	})),
);
const AuthPage = lazy(() =>
	import('../pages/ui/AuthPage').then((m) => ({ default: m.AuthPage })),
);
const NutritionPage = lazy(() =>
	import('../pages/ui/NutritionPage').then((m) => ({
		default: m.NutritionPage,
	})),
);
const ReportsPage = lazy(() =>
	import('../pages/ui/ReportsPage').then((m) => ({ default: m.ReportsPage })),
);
const TrainingsPage = lazy(() =>
	import('../pages/ui/TrainingsPage').then((m) => ({
		default: m.TrainingsPage,
	})),
);
const SettingsPage = lazy(() =>
	import('../pages/ui/SettingsPage').then((m) => ({
		default: m.SettingsPage,
	})),
);
const AdminPage = lazy(() =>
	import('../pages/ui/AdminPage').then((m) => ({ default: m.AdminPage })),
);

function PageLoader() {
	return (
		<div style={{ padding: '2rem', textAlign: 'center' }}>Загрузка...</div>
	);
}

export function Router() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Layout />}>
					<Route
						index
						element={
							<Suspense fallback={<PageLoader />}>
								<MainPage />
							</Suspense>
						}
					/>
					<Route
						path='athletes'
						element={
							<Suspense fallback={<PageLoader />}>
								<AthletesPage />
							</Suspense>
						}
					/>
					<Route
						path='nutrition'
						element={
							<Suspense fallback={<PageLoader />}>
								<NutritionPage />
							</Suspense>
						}
					/>
					<Route
						path='reports'
						element={
							<Suspense fallback={<PageLoader />}>
								<ReportsPage />
							</Suspense>
						}
					/>
					<Route
						path='trainings'
						element={
							<Suspense fallback={<PageLoader />}>
								<TrainingsPage />
							</Suspense>
						}
					/>
					<Route
						path='settings'
						element={
							<Suspense fallback={<PageLoader />}>
								<SettingsPage />
							</Suspense>
						}
					/>
					<Route
						path='admin'
						element={
							<Suspense fallback={<PageLoader />}>
								<AdminPage />
							</Suspense>
						}
					/>
				</Route>

				<Route
					path='auth'
					element={
						<Suspense fallback={<PageLoader />}>
							<AuthPage />
						</Suspense>
					}
				/>
			</Routes>
		</BrowserRouter>
	);
}
