import { test, expect } from '@playwright/test';
import { setupMocks } from '../helpers';

test('opens the movie detail view from a result', async ({ page }) => {
  await setupMocks(page);
  await page.goto('/');

  await page.getByPlaceholder('Search movies').fill('inception');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button', { name: /Inception/i }).click();

  await expect(page.getByText('A mind-bending thriller')).toBeVisible();
  await expect(page.getByText('Excellent movie')).toBeVisible();
});
