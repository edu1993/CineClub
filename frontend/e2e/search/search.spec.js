import { test, expect } from '@playwright/test';
import { setupMocks } from '../helpers';

test('shows search results for a valid query', async ({ page }) => {
  await setupMocks(page);
  await page.goto('/');

  await page.getByPlaceholder('Search movies').fill('inception');
  await page.getByRole('button', { name: 'Search' }).click();

  await expect(page.getByText('Inception')).toBeVisible();
});
