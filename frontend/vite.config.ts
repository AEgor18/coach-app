import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [tailwindcss(), react()],

	define: {
		'import.meta.env.VITE_API_BASE_URL': JSON.stringify(
			process.env.VITE_API_BASE_URL || '/api',
		),
		'import.meta.env.VITE_MINIO_PUBLIC_URL': JSON.stringify(
			process.env.VITE_MINIO_PUBLIC_URL || 'http://localhost:9000',
		),
	},

	server: {
		host: '0.0.0.0',
		port: 5173,

		proxy: {
			'/api': {
				target: 'http://localhost:8000',
				changeOrigin: true,
				secure: false,
			},
		},
	},

	test: {
		environment: 'jsdom',
		setupFiles: './src/test/setup.ts',
		globals: true,
		threads: false,

		deps: {
			inline: ['@mui/material'],
			external: ['@mui/icons-material'],
		},

		include: [
			'src/test/unit/**/*.test.{ts,tsx}',
			'src/test/unit/**/*.spec.{ts,tsx}',
		],

		exclude: ['src/test/e2e/**'],
	},
});
