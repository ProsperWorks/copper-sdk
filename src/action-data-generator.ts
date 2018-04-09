import { IActionApiData, UITarget } from '.';
import { ENTITY_PATH_MAP, ENTITY_TYPE } from './constant';
import { IEntityModel } from './entity-model';
import { delayExecution } from './utils';

export function logActivityDataGenerator(
  context: IEntityModel,
  {
    activityType,
    details,
    activityDate,
  }: {
    activityType: number;
    details: string;
    activityDate?: number;
  },
): IActionApiData {
  const url = '/v1/activities';
  const data: any = {
    parent: {
      type: context.type,
      id: context.id,
    },
    type: {
      category: 'user',
      id: activityType,
    },
    details,
  };
  if (activityDate) {
    data.activity_date = activityDate;
  }

  return {
    url,
    method: 'POST',
    data,
    target: UITarget.ActivityLog,
    delay: 1000,
  };
}

export function createEntityDataGenerator(
  context: IEntityModel,
  {
    entityType,
    data,
  }: {
    entityType: ENTITY_TYPE;
    data: any;
  },
): IActionApiData {
  const url = `/v1/${ENTITY_PATH_MAP[entityType]}`;
  const target = entityType === context.type ? UITarget.ListView : null;
  return {
    url,
    method: 'POST',
    data,
    target,
    delay: 2000,
  };
}

export function relateEntityDataGenerator(
  context: IEntityModel,
  {
    entityType,
    entityId,
    data,
  }: {
    entityType: ENTITY_TYPE;
    entityId: number;
    data: any;
  },
): IActionApiData {
  const url = `/v1/${ENTITY_PATH_MAP[entityType]}/${entityId}/related`;
  const target = entityType === context.type ? UITarget.Related : null;
  return {
    url,
    method: 'POST',
    data,
    target,
    delay: 2000,
  };
}
