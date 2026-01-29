/**
 * Scheduling Group Request Builder
 *
 * This class implements the Builder Pattern for creating SchedulingGroupRequest payloads.
 * It provides a fluent interface for constructing request objects with sensible defaults
 * and validation, eliminating the need for manual JSON creation.
 *
 * Purpose:
 * - Creates SchedulingGroupRequest payloads programmatically
 * - Provides fluent method chaining for easy payload construction
 * - Sets sensible defaults in the constructor
 * - Validates required fields before building
 * - Ensures type safety using generated TypeScript models
 *
 * Relationships:
 * - Uses generated models from src/generated/models/
 * - Called by test files in tests/ directory to create request payloads
 * - Payloads are passed to API clients in clients/ directory
 * - Replaces manual JSON files for request creation
 * - Collaborates with API clients for sending requests
 *
 * Builder Pattern Benefits:
 * - Method chaining for readable payload construction
 * - Immutable construction (returns new instances)
 * - Validation at build time
 * - Default values reduce boilerplate
 *
 * Usage Example:
 * const payload = new SchedulingGroupBuilder()
 *   .withGroupName('Test Group')
 *   .withArea('Area-A')
 *   .withStatus(CreateSchedulingGroupRequestStatusEnum.Active)
 *   .build();
 */
import { CreateSchedulingGroupRequest, CreateSchedulingGroupRequestStatusEnum } from '@generated/models';
export class SchedulingGroupBuilder {
  private payload: CreateSchedulingGroupRequest;

  constructor() {
    this.payload = {
      groupName: '',
      createdBy: 'automation',
      status: CreateSchedulingGroupRequestStatusEnum.Active,
      area: '',
      notes: '',
      allocationsMenu: 'false'
    };
  }


  withGroupName(name: string) {
    this.payload.groupName = name;

    return this;
  }

  withCreatedBy(user: string) {
    this.payload.createdBy = user;
    return this;
  }

  withStatus(status: CreateSchedulingGroupRequestStatusEnum) {
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

  build(): CreateSchedulingGroupRequest {
    if (!this.payload.groupName) {
      throw new Error('groupName is mandatory');
    }
    if (!this.payload.area) {
      throw new Error('area is mandatory');
    }
    return this.payload;
  }
}
