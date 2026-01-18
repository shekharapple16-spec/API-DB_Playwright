/**
 * Base API Client Class
 *
 * This abstract base class provides a foundation for all API client implementations in the framework.
 * It encapsulates the Playwright APIRequestContext, which is used for making HTTP requests during API testing.
 *
 * Purpose:
 * - Provides a common interface for API clients
 * - Manages the Playwright request context injection
 * - Serves as the base class for domain-specific API clients (e.g., SchedulingGroupClient)
 *
 * Relationships:
 * - Extended by concrete API client classes in the clients/ directory
 * - Uses Playwright's APIRequestContext for HTTP operations
 * - Collaborates with generated API clients from src/generated/apis/
 * - Used by test files in tests/ directory for API interactions
 *
 * @abstract
 */
import { APIRequestContext } from "@playwright/test";

export abstract class BaseApiClient {
  protected request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }
}


