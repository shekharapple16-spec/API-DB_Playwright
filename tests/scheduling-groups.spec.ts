import { test, expect } from "@playwright/test";
import { ENDPOINTS } from "@constants/endpoint";
import { SchedulingGroupBuilder } from "@builders/SchedulingGroupBuilder";
import { DB_QUERIES } from "@db/queries";
import { queryDB } from "@utils/dbClient";
import { SchedulingGroupClient } from "@clients/SchedulingGroupClient";

// Swagger-generated types
import {
  SchedulingGroupResponse,
  SchedulingGroupRequestStatusEnum,
} from "@generated/models";

test("Create scheduling group and validate DB", async ({ request }) => {
  const payload = new SchedulingGroupBuilder()
    .withGroupName(`TS_${Date.now()}`)
    .build();

  const client = new SchedulingGroupClient(request);
  const responseBody = await client.createGroup(payload);

  const dbResult = await queryDB(DB_QUERIES.GET_GROUP_BY_ID, [responseBody.id]);

  expect((dbResult[0] as any).group_name).toBe(payload.groupName);
});
