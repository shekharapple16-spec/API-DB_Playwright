/**
 * Environment Configuration
 *
 * This module provides access to environment-specific configuration values.
 * It loads environment variables and makes them available as a typed object
 * for use throughout the application.
 *
 * Purpose:
 * - Provides centralized access to environment variables
 * - Ensures type safety for configuration values
 * - Separates environment configuration from other config types
 * - Enables different settings for development, testing, and production
 *
 * Relationships:
 * - Used by Playwright configuration (playwright.config.ts) for base URL
 * - Environment variables defined in .env file
 * - Collaborates with db.config.ts for database settings
 * - Required for API client initialization and test execution
 *
 * Environment Variables Required:
 * - BASE_URL: Base URL for the API server (e.g., http://localhost:3000)
 */
import dotenv from 'dotenv';

dotenv.config();

export const ENV = {
  baseURL: process.env.BASE_URL!,
};
