import { BaseApiClient } from "./BaseApiClient";
import { ENDPOINTS } from "@constants/endpoint";
import { SchedulingGroupRequest,SchedulingGroupResponse } from "@generated/models";

export class SchedulingGroupClient extends BaseApiClient {

  async createGroup( payload: SchedulingGroupRequest): Promise<SchedulingGroupResponse> {
    const response = await this.request.post(ENDPOINTS.CREATE_GROUP, {
      data: payload,
    });

    if (!response.ok()) {
      throw new Error(`Create group failed: ${response.status()}`);
    }

    return await response.json();
  }

  async getAllGroups(): Promise<SchedulingGroupResponse[]> {
    const response = await this.request.get(ENDPOINTS.GET_GROUPS);

    if (!response.ok()) {
      throw new Error(`Get groups failed: ${response.status()}`);
    }

    return await response.json();
  }
}
