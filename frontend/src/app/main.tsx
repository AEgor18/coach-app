import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { CssBaseline } from '@mui/material';
import { Router } from './Route';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 5 * 60 * 1000,
		},
	},
});

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<HelmetProvider
			defaultTitle='Coach App — Управление тренировками'
			titleTemplate='%s | Coach App'
		>
			<QueryClientProvider client={queryClient}>
				<CssBaseline />
				<Router />
			</QueryClientProvider>
		</HelmetProvider>
	</StrictMode>,
);
