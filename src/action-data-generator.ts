import { ENTITY_PATH_MAP, ENTITY_TYPE } from './constant';
import { IEntityModel } from './entity-model';
import { IActionApiData, UITarget } from './interfaces';
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
    target: {
      name: UITarget.ActivityLog,
    },
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
  const target =
    entityType === context.type
      ? {
          name: UITarget.ListView,
          data: {
            entityType,
            entityData: data,
          },
        }
      : null;
  return {
    url,
    method: 'POST',
    data,
    target,
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
    data: { id: number, type: ENTITY_TYPE };
  },
): IActionApiData {
  const url = `/v1/${ENTITY_PATH_MAP[entityType]}/${entityId}/related`;
  const isCurrentEntity = entityType === context.type && entityId === context.id;
  const target = isCurrentEntity
    ? {
        name: UITarget.Related,
        data,
      }
    : null;
  return {
    url,
    method: 'POST',
    data: {
      resource: data,
    },
    target,
  };
}
