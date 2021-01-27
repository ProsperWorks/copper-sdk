import { assert, expect } from 'chai';
import sinon from 'sinon';
import {
  createEntityDataGenerator,
  logActivityDataGenerator,
  relateEntityDataGenerator,
} from 'src/action-data-generator';
import EntityModel, { IEntityModel } from 'src/entity-model';
import { IPostMessageData, UITarget } from 'src/interfaces';

describe('ActionDataGenerator', function () {
  let model: IEntityModel;
  beforeEach(function () {
    model = new EntityModel(
      'person',
      {
        id: 1,
        name: 'Alice',
      },
      [],
    );
  });

  context('#logActivityDataGenerator', function () {
    it('should generate correct logActivity data', function () {
      const now = Math.floor(Date.now() / 1000);
      const result = logActivityDataGenerator(model, {
        activityType: 10,
        details: 'Some details',
        activityDate: now,
      });
      expect(result).to.eql({
        url: '/v1/activities',
        method: 'POST',
        data: {
          parent: {
            type: 'person',
            id: 1,
          },
          type: {
            category: 'user',
            id: 10,
          },
          details: 'Some details',
          activity_date: now,
        },
        target: {
          name: UITarget.ActivityLog,
        },
      });
    });
  });

  context('#createEntityDataGenerator', function () {
    it('should generate correct entityData when entityType match', function () {
      const result = createEntityDataGenerator(model, {
        entityType: 'person',
        data: { foo: 'bar' },
      });
      expect(result).to.eql({
        url: '/v1/people',
        method: 'POST',
        data: { foo: 'bar' },
        target: {
          name: UITarget.ListView,
          data: {
            entityType: 'person',
            entityData: { foo: 'bar' },
          },
        },
      });
    });

    it('should generate correct entityData when entityType not match', function () {
      const result = createEntityDataGenerator(model, {
        entityType: 'lead',
        data: { foo: 'bar' },
      });
      expect(result).to.eql({
        url: '/v1/leads',
        method: 'POST',
        data: { foo: 'bar' },
        target: null,
      });
    });
  });

  context('#relatedEntityDataGenerator', function () {
    it('should generate correct relatedEntityData when entity match', function () {
      const result = relateEntityDataGenerator(model, {
        entityType: 'person',
        entityId: 1,
        data: {
          id: 2,
          type: 'opportunity',
        },
      });
      expect(result).to.eql({
        url: '/v1/people/1/related',
        method: 'POST',
        data: {
          resource: {
            id: 2,
            type: 'opportunity',
          },
        },
        target: {
          name: UITarget.Related,
          data: {
            id: 2,
            type: 'opportunity',
          },
        },
      });
    });

    it('should generate correct relatedEntityData when entity not match', function () {
      const result = relateEntityDataGenerator(model, {
        entityType: 'lead',
        entityId: 1,
        data: {
          id: 2,
          type: 'opportunity',
        },
      });
      expect(result).to.eql({
        url: '/v1/leads/1/related',
        method: 'POST',
        data: {
          resource: {
            id: 2,
            type: 'opportunity',
          },
        },
        target: null,
      });
    });
  });
});
