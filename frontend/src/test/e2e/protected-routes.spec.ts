import { test, expect } from './fixtures';

test.describe('Защита маршрутов', () => {
	test('неавторизованный пользователь редиректится на /auth', async ({
		page,
	}) => {
		await page.goto('/athletes');
		await expect(page).toHaveURL(/\/auth/);
	});

	test('coach может зайти на страницу спортсменов', async ({
		page,
		loginAs,
	}) => {
		await loginAs('coach');
		await page.goto('/athletes');
		await expect(page).toHaveURL(/athletes/);
		await expect(page.getByText('Управление спортсменами')).toBeVisible();
	});

	test('admin может зайти в админ-панель', async ({ page, loginAs }) => {
		await loginAs('admin');
		await page.goto('/admin');
		await expect(page).toHaveURL(/admin/);
		await expect(page.getByText('Панель администратора')).toBeVisible();
	});
});
