import { assert, expect } from 'chai';
import sinon from 'sinon';
import EntityModel from '../src/entity-model';

describe('entity-model', function () {
  let onSaveStub: sinon.SinonStub;
  beforeEach(function () {
    onSaveStub = sinon.stub();
  });

  it('should create a model correctly', async function () {
    const obj = {
      id: 1,
      name: 'Alice',
      age: 21,
      gender: 'female',
    };
    const model = new EntityModel('person', obj, ['age'], onSaveStub);
    expect(() => {
      model.type = 'yo';
    }).to.throw();
    expect(model.type).to.equal('person');
    expect(model.name).to.equal('Alice');

    expect(model.toObject()).to.eql({ ...obj });
    expect(model.toJSON()).to.equal(JSON.stringify(obj));

    const data = await model.save();
    assert(onSaveStub.calledOnce);
  });

  it('should update model correctly', async function () {
    const obj = {
      id: 1,
      name: 'Alice',
      age: 21,
      gender: 'female',
    };
    const model = new EntityModel('person', obj, ['age'], onSaveStub);
    onSaveStub.resolves({ type: model.type, context: model });
    model.age = 22;
    const result = await model.save();
    expect(result).to.be.ok;
    if (result) {
      const { type, context } = result;
      expect(type).to.equal('person');
      expect(context.age).to.equal(22);
    }
  });
});
