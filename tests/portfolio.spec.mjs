import { test, expect } from '@playwright/test'

async function expectFocusInside(dialog) {
  await expect.poll(() => dialog.evaluate(el => el.contains(document.activeElement))).toBe(true)
}

test('modal contains focus, supports panel changes, and restores the opener', async ({ page }) => {
  await page.goto('/')
  const profile = page.getByRole('button', { name: /Profile$/ })
  await profile.click()
  let dialog = page.getByRole('dialog', { name: 'About the player' })
  await expect(dialog.getByRole('button', { name: 'Close dialog' })).toBeFocused()
  await page.keyboard.press('Tab')
  await expect(dialog.getByRole('button', { name: 'Open player stats' })).toBeFocused()
  await page.keyboard.press('Tab')
  // The native modal may cycle through browser chrome, but never background controls.
  await expect(page.getByRole('button', { name: /Experience$/, includeHidden: true })).not.toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expectFocusInside(dialog)
  await dialog.getByRole('button', { name: 'Open player stats' }).click()
  dialog = page.getByRole('dialog', { name: 'Player stats' })
  await expect(dialog.getByRole('button', { name: 'Close dialog' })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).toHaveCount(0)
  await expect(profile).toBeFocused()

  // Also check the close control and its focus restoration.
  await page.getByRole('button', { name: /Contact$/ }).click()
  dialog = page.getByRole('dialog', { name: 'Let’s connect' })
  await expect(dialog.getByRole('button', { name: 'Close dialog' })).toBeFocused()
  await dialog.getByRole('button', { name: 'Close dialog' }).click()
  await expect(dialog).toHaveCount(0)
  await expect(page.getByRole('button', { name: /Contact$/ })).toBeFocused()
})

test('Profile labels and descriptions do not overlap', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: /Profile$/ }).click()
  const dialog = page.getByRole('dialog', { name: 'About the player' })
  const label = dialog.getByText('ANALYZE', { exact: true })
  const copy = dialog.getByText('Sports statistics · RAG · Knowledge systems', { exact: true })
  await expect(label).toBeVisible()
  await expect(copy).toBeVisible()
  await expect.poll(async () => {
    const a = await label.boundingBox()
    const b = await copy.boundingBox()
    if (!a || !b) return false
    return a.x + a.width <= b.x || a.y + a.height <= b.y || b.y + b.height <= a.y
  }).toBe(true)
  await expect.poll(() => dialog.evaluate(el => el.scrollWidth <= el.clientWidth)).toBe(true)
  await page.screenshot({ path: test.info().outputPath('profile.png') })
})

test('metadata is present in the initial HTML', async ({ page, request }) => {
  const response = await request.get('/')
  const html = await response.text()
  expect(html).toContain('Matías Fandiño — Developer &amp; Educator')
  for (const name of ['description', 'og:title', 'og:description', 'og:url', 'og:type', 'og:image', 'twitter:card', 'twitter:image']) {
    expect(html).toContain(`"${name}"`)
  }
  const image = await request.get('/social-preview.jpg')
  expect(image.ok()).toBe(true)
  expect(image.headers()['content-type']).toContain('image/jpeg')
  await page.goto('/')
  await expect(page).toHaveTitle('Matías Fandiño — Developer & Educator')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://portfolio-mf-omega.vercel.app/')
})
