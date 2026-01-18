/**
 * Scheduling Group API Client
 *
 * This class provides domain-specific methods for interacting with scheduling group endpoints.
 * It extends BaseApiClient to inherit the Playwright request context and implements
 * typed methods for creating, retrieving, and deleting scheduling groups.
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
 * - DELETE /scheduling-groups/:id (deleteGroup)
 * - DELETE /scheduling-groups/status/:status (deleteGroupsByStatus)
 */
import { BaseApiClient } from "./BaseApiClient";
import { ENDPOINTS } from "@constants/endpoint";
import { CreateSchedulingGroupRequest, SchedulingGroup, DeleteByIdResponse, DeleteByStatusResponse, CreateSchedulingGroupRequestFromJSON, SchedulingGroupFromJSON, DeleteByIdResponseFromJSON, DeleteByStatusResponseFromJSON } from "@generated/models";

export class SchedulingGroupClient extends BaseApiClient {

  async createGroup(payload: CreateSchedulingGroupRequest): Promise<SchedulingGroup> {

    const response = await this.request.post(ENDPOINTS.SCHD_CREATE_GROUP, { data: payload });

    if (!response.ok()) {
      throw new Error(`Create group failed: ${response.status()}`);
    }

    const json = await response.json();
    return SchedulingGroupFromJSON(json);
  }

  async getAllGroups(): Promise<SchedulingGroup[]> {
    const response = await this.request.get(ENDPOINTS.SCHD_GET_GROUPS);

    if (!response.ok()) {
      throw new Error(`Get groups failed: ${response.status()}`);
    }

    const json = await response.json();
    return (json as any[]).map(SchedulingGroupFromJSON);
  }

  async deleteGroup(id: number): Promise<DeleteByIdResponse> {
    const url = ENDPOINTS.SCHD_DELETE_GROUP.replace(':id', id.toString());
    const response = await this.request.delete(url);

    if (!response.ok()) {
      throw new Error(`Delete group failed: ${response.status()}`);
    }

    const json = await response.json();
    return DeleteByIdResponseFromJSON(json);
  }

  async deleteGroupsByStatus(status: string): Promise<DeleteByStatusResponse> {
    const url = ENDPOINTS.SCHD_DELETE_GROUPS_BY_STATUS.replace(':status', status);
    const response = await this.request.delete(url);

    if (!response.ok()) {
      throw new Error(`Delete groups by status failed: ${response.status()}`);
    }

    const json = await response.json();
    return DeleteByStatusResponseFromJSON(json);
  }
}
