import { assert, expect } from 'chai';
import sinon from 'sinon';
import EntityModel from '../src/entity-model';

describe('entity-model', function () {
  let onSaveSpy: sinon.SinonSpy;
  beforeEach(function () {
    onSaveSpy = sinon.spy();
  });

  it('should create a model correctly', async function () {
    const obj = {
      id: 1,
      name: 'Alice',
      age: 21,
      gender: 'female',
    };
    const model = new EntityModel('person', obj, ['age'], onSaveSpy);
    expect(() => {
      (model as any).type = 'yo';
    }).to.throw();
    expect(model.type).to.equal('person');
    expect((model as any).name).to.equal('Alice');

    expect(model.toObject()).to.eql({ ...obj });
    expect(model.toJSON()).to.equal(JSON.stringify(obj));

    const data = await model.save();
    assert(onSaveSpy.calledOnce);
  });
});
