import { assert, expect } from 'chai';
import sinon from 'sinon';
import EntityModel, { IContextData } from '../src/entity-model';

describe('entity-model', function () {
  let onSaveSpy: (model: EntityModel) => Promise<IContextData>;
  beforeEach(function () {
    onSaveSpy = sinon.spy();
  });

  it('should create a model correctly', function () {
    const model = new EntityModel(
      'person',
      { id: 1, name: 'Alice', age: 21},
      ['age'],
      onSaveSpy,
    );

    expect(model.type).to.equal('person');
  });
});
