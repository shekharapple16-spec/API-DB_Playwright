import { SchedulingGroupRequest, SchedulingGroupRequestStatusEnum } from '@generated/models';

export class SchedulingGroupBuilder {
  private payload: SchedulingGroupRequest;

  constructor() {
    this.payload = {
      groupName: '',
      createdBy: 'automation',
      status: SchedulingGroupRequestStatusEnum.Active
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

  withStatus(status: SchedulingGroupRequestStatusEnum) {
    this.payload.status = status;
    return this;
  }

  build(): SchedulingGroupRequest {
    if (!this.payload.groupName) {
      throw new Error('groupName is mandatory');
    }
    return this.payload;
  }
}
