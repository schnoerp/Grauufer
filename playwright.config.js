// Browser-Tests für Grauufer (Chromium, Tablet-ähnliche Fenstergröße)
const { defineConfig } = require('@playwright/test');
const exe = process.env.PW_CHROMIUM; // nur für lokale Läufe mit eigenem Chromium
module.exports = defineConfig({
  testDir: './tests',
  timeout: 90_000,
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  use: {
    viewport: { width: 1250, height: 650 },
    launchOptions: exe ? { executablePath: exe, args: ['--no-sandbox'] } : { args: ['--no-sandbox'] },
    screenshot: 'only-on-failure',
  },
});
