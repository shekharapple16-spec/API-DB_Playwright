import { APIRequestContext } from '@playwright/test';

export abstract class BaseApiClient {
  protected request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }
}
