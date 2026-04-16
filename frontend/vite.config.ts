import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [tailwindcss(), react()],
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
