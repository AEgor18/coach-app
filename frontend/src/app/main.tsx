import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '../index.css';
import { CssBaseline } from '@mui/material';
import { Router } from './Route';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<CssBaseline />
		<Router />
	</StrictMode>
);
