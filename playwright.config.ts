/**
 * Playwright Configuration
 *
 * This configuration file sets up Playwright for API testing. It defines test directories,
 * base URLs, and other settings specific to the API automation framework.
 *
 * Purpose:
 * - Configures Playwright test runner for API tests
 * - Sets base URL for all API requests
 * - Defines test file locations and patterns
 * - Enables API testing capabilities
 * - Provides centralized test configuration
 *
 * Relationships:
 * - Uses environment configuration from config/env.config.ts
 * - Points to test files in tests/ directory
 * - Enables APIRequestContext for client classes
 * - Supports the overall testing framework architecture
 *
 * Configuration Details:
 * - testDir: Directory containing test files
 * - baseURL: Base URL for API endpoints (from environment)
 * - use: Default configuration for all tests
 */
import { defineConfig } from '@playwright/test';
import { ENV } from '@config/env.config';
export default defineConfig({
  testDir: './tests',
  use: {
    baseURL: ENV.baseURL
  }
});
