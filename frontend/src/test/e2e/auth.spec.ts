import { test, expect } from './fixtures';

test.describe('Авторизация', () => {
	test('успешный логин как admin', async ({ page, loginAs }) => {
		await loginAs('admin');
		await expect(page).toHaveURL('/');
	});

	test('успешный логин как coach', async ({ page, loginAs }) => {
		await loginAs('coach');
		await expect(page).toHaveURL('/');
	});

	test('неверные данные показывают ошибку', async ({ page }) => {
		await page.goto('/auth');
		await page.getByRole('tab', { name: /вход/i }).click();

		await page.getByLabel(/email/i).fill('wrong@mail.ru');
		await page.getByLabel(/пароль/i).fill('wrongpass');

		await page.getByRole('button', { name: /войти/i }).click();

		await expect(
			page.getByText(/ошибка|неверный|неправильный|failed|не удалось/i),
		).toBeVisible({
			timeout: 10000,
		});
	});
});
