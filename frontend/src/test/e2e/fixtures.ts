import { test as base, expect } from '@playwright/test';

type UserRole = 'admin' | 'coach';

type TestUser = {
	email: string;
	password: string;
	role: UserRole;
};

const testUsers: Record<UserRole, TestUser> = {
	admin: {
		email: 'admin@mail.ru',
		password: 'qwerty123',
		role: 'admin',
	},
	coach: {
		email: 'coach@mail.ru',
		password: 'qwerty123',
		role: 'coach',
	},
};

export const test = base.extend<{
	loginAs: (role: UserRole) => Promise<void>;
}>({
	loginAs: async ({ page }, use) => {
		await use(async (role: UserRole) => {
			const user = testUsers[role];
			if (!user) throw new Error(`Unknown role: ${role}`);

			console.log(`🔑 Logging in as ${role} (${user.email})`);

			await page.goto('/auth', { waitUntil: 'domcontentloaded' });

			await page
				.getByRole('tab', { name: /вход/i })
				.click({ force: true });

			await page.getByLabel(/email/i).fill(user.email);
			await page.getByLabel(/пароль/i).fill(user.password);

			await page.getByRole('button', { name: /войти/i }).click();

			await page.waitForURL('/', { timeout: 20000 });
			await expect(page.getByText('Календарь тренировок')).toBeVisible({
				timeout: 15000,
			});

			console.log(`✅ Successfully logged in as ${role}`);
		});
	},
});

export { expect } from '@playwright/test';
