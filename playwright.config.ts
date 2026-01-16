import { defineConfig } from '@playwright/test';
import { ENV } from '@config/env.config';
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: ENV.baseURL
  }
});
