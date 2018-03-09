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
});
