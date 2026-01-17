/**
 * Scheduling Group API Client
 *
 * This class provides domain-specific methods for interacting with scheduling group endpoints.
 * It extends BaseApiClient to inherit the Playwright request context and implements
 * typed methods for creating and retrieving scheduling groups.
 *
 * Purpose:
 * - Encapsulates API calls related to scheduling groups
 * - Provides type-safe methods using generated TypeScript models
 * - Handles HTTP responses and error checking
 * - Abstracts the API interaction details from test code
 *
 * Relationships:
 * - Extends BaseApiClient for common API client functionality
 * - Uses endpoint constants from constants/endpoint.ts
 * - Depends on generated models from src/generated/models/
 * - Called by test files in tests/ directory for API operations
 * - Collaborates with builders in payloads/builders/ for request creation
 *
 * API Endpoints Handled:
 * - POST /scheduling-groups (createGroup)
 * - GET /scheduling-groups (getAllGroups)
 */
import { BaseApiClient } from "./BaseApiClient";
import { ENDPOINTS } from "@constants/endpoint";
import { SchedulingGroupRequest, SchedulingGroupResponse } from "@generated/models";

export class SchedulingGroupClient extends BaseApiClient {

  async createGroup(payload: SchedulingGroupRequest): Promise<SchedulingGroupResponse> {

    const response = await this.request.post(ENDPOINTS.SCHD_CREATE_GROUP, {
      data: payload,
    });

    if (!response.ok()) {
      throw new Error(`Create group failed: ${response.status()}`);
    }

    return await response.json();
  }

  async getAllGroups(): Promise<SchedulingGroupResponse[]> {
    const response = await this.request.get(ENDPOINTS.SCHD_GET_GROUPS);

    if (!response.ok()) {
      throw new Error(`Get groups failed: ${response.status()}`);
    }

    return await response.json();
  }
}
