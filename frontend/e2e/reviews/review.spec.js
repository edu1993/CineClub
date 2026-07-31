import { test, expect } from '@playwright/test';
import { setupMocks } from '../helpers';

test('submits a review from the detail view', async ({ page }) => {
  await setupMocks(page);
  await page.goto('/');

  await page.getByPlaceholder('Search movies').fill('inception');
  await page.getByRole('button', { name: 'Search' }).click();
  await page.getByRole('button', { name: /Inception/i }).click();

  await page.getByLabel('Author').fill('Ana');
  await page.getByLabel('Score').selectOption('5');
  await page.getByLabel('Comment').fill('Great movie');
  await page.getByRole('button', { name: 'Submit review' }).click();

  await expect(page.getByText('Review submitted')).toBeVisible();
});
