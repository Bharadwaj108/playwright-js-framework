// @ts-check
import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';
import path from 'path';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
const environment = process.env.NODE_ENV || 'development';
console.log(environment);
dotenv.config({
  path: path.resolve(__dirname, `.env.${environment}`),
  override: true,
});


const testDir = defineBddConfig({
  features: 'tests/bdd-features/*.feature',
  steps: 'tests/bdd-steps/*.js',
});

/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: testDir,
  reporter: 'html',
  use: {
    testIdAttribute: 'data-test',
    launchOptions: {
      args: ['--start-maximized'],
    },
    headless: true,
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0 Safari/537.36",
    /* Configure projects for major browsers */
    projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  // load environment variables from the .env file
  baseURL: process.env.BASE_URL,
  envName: process.env.ENV_NAME,
  SMALL_WAIT_TIME: process.env.SMALL_WAIT_TIME,
  MEDIUM_WAIT_TIME: process.env.MEDIUM_WAIT_TIME,
  LONG_WAIT_TIME: process.env.LONG_WAIT_TIME,
}

});



