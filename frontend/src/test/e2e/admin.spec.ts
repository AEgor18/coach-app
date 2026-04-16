import { test, expect } from './fixtures';

test.describe('Админ-панель', () => {
	test.beforeEach(async ({ loginAs }) => {
		await loginAs('admin');
	});

	test('админ видит панель и список пользователей', async ({ page }) => {
		await page.goto('/admin');
		await expect(page.getByText('Панель администратора')).toBeVisible();
		await expect(page.getByRole('table')).toBeVisible();
	});
});
