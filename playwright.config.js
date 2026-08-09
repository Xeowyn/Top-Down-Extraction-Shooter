// @ts-check
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 30000,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:8842',
  },
  webServer: {
    command: 'python3 -m http.server 8842',
    port: 8842,
    reuseExistingServer: false,
    timeout: 10000,
  },
});
