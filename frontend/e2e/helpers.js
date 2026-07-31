export async function setupMocks(page) {
  await page.route('**/api/movies/search*', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        results: [
          {
            id: 1,
            title: 'Inception',
            release_date: '2010-07-16',
            poster_path: '/inception.jpg',
            avgScore: 4.5,
          },
        ],
      }),
    });
  });

  await page.route('**/api/movies/1', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: 1,
        title: 'Inception',
        overview: 'A mind-bending thriller',
        release_date: '2010-07-16',
        poster_path: '/inception.jpg',
        reviews: [{ id: 1, author: 'Ana', score: 5, comment: 'Excellent movie' }],
      }),
    });
  });

  await page.route('**/api/movies/1/reviews', async (route) => {
    await route.fulfill({
      status: 201,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    });
  });
}
