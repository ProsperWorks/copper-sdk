import { assert, expect } from 'chai';
import Deferred from '../src/defer';

describe('defer', function () {
  it('should create a deferred promise', function () {
    const deferred = new Deferred<string>();

    expect(deferred.promise.then).to.be.a('function');
  });

  it('should be able to resolve later', function () {
    const deferred = new Deferred<string>();
    deferred.promise.then((ret) => {
      expect(ret).to.equal('Alice');
    });
    deferred.resolve('Alice');
  });

  it('should be able to throw later', function () {
    const deferred = new Deferred<string>();
    deferred.promise.catch((ret) => {
      expect(ret).to.eql({
        error: 'Bob',
      });
    });
    deferred.reject({ error: 'Bob' });
  });

  it('should contain auto-incremented id', function () {
    Deferred.resetNextId();

    const deferred1 = new Deferred<string>();
    expect(deferred1.id).to.equal(0);

    const deferred2 = new Deferred<string>();
    expect(deferred2.id).to.equal(1);

    const x = 5;
    let deferredX;
    for (let i = 0; i < x; i++) {
      deferredX = new Deferred<string>();
    }

    expect(deferredX?.id).to.equal(1 + x);
  });
});
