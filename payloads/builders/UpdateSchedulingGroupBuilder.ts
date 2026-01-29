/**
 * Update Scheduling Group Request Builder
 *
 * This class implements the Builder Pattern for creating UpdateSchedulingGroupRequest payloads.
 * It provides a fluent interface for constructing partial update requests with all fields optional.
 *
 * Purpose:
 * - Creates UpdateSchedulingGroupRequest payloads programmatically
 * - Provides fluent method chaining for easy payload construction
 * - All fields are optional (PATCH semantics)
 * - No validation required (allows partial updates)
 * - Ensures type safety using generated TypeScript models
 *
 * Relationships:
 * - Uses generated models from src/generated/models/
 * - Called by test files in tests/ directory to create update payloads
 * - Payloads are passed to API clients in clients/ directory via updateGroup()
 * - Replaces manual JSON files for request creation
 * - Collaborates with API clients for sending requests
 *
 * Builder Pattern Benefits:
 * - Method chaining for readable payload construction
 * - Immutable construction (returns new instances)
 * - All fields optional (flexible updates)
 * - Default values can be set for common updates
 *
 * Usage Example:
 * const payload = new UpdateSchedulingGroupBuilder()
 *   .withNotes('Updated notes')
 *   .withAllocationsMenu('true')
 *   .build();
 *
 * // Sends only non-empty fields to API
 * const updated = await client.updateGroup(groupId, payload);
 */

import { UpdateSchedulingGroupRequest, UpdateSchedulingGroupRequestStatusEnum } from '@generated/models';

export class UpdateSchedulingGroupBuilder {
  private payload: UpdateSchedulingGroupRequest;

  constructor() {
    this.payload = {};
  }

  withGroupName(name: string) {
    this.payload.groupName = name;
    return this;
  }

  withStatus(status: UpdateSchedulingGroupRequestStatusEnum) {
    this.payload.status = status;
    return this;
  }

  withArea(area: string) {
    this.payload.area = area;
    return this;
  }

  withNotes(notes: string) {
    this.payload.notes = notes;
    return this;
  }

  withAllocationsMenu(allocationsMenu: string) {
    this.payload.allocationsMenu = allocationsMenu;
    return this;
  }

  /**
   * Build the update payload
   * Note: Does NOT validate required fields (all are optional for PATCH semantics)
   * Use this to update any combination of fields
   */
  build(): UpdateSchedulingGroupRequest {
    return this.payload;
  }

  /**
   * Clear all fields (start fresh)
   */
  clear() {
    this.payload = {};
    return this;
  }
}
