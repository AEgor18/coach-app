import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: './src/test/e2e',

	timeout: 60_000,
	expect: { timeout: 10_000 },

	fullyParallel: false,
	workers: 1,

	retries: 1,
	reporter: 'html',

	use: {
		baseURL: 'http://localhost:5173',
		trace: 'on-first-retry',
		screenshot: 'only-on-failure',
		video: 'retain-on-failure',

		actionTimeout: 15_000,
		navigationTimeout: 45_000,
		launchOptions: {
			slowMo: 100,
		},
	},

	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],

	webServer: {
		command: 'npm run dev',
		url: 'http://localhost:5173',
		reuseExistingServer: true,
		timeout: 120_000,
	},
});
