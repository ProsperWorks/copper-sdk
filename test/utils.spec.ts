import { assert, expect } from 'chai';
import sinon from 'sinon';
import {
  checkEnvironment,
  createArrayWhenEmpty,
  getParameterByName,
  log,
} from '../src/utils';

describe('utils', function () {

  context('#getParameterByName', function () {
    it('should get parameters correctly', function () {
      const foo = getParameterByName('foo', 'https://prosperworks.com?foo=Alice');
      expect(foo).to.equal('Alice');
    });

    it('should return empty string if no parameter', function () {
      const foo = getParameterByName('foo');
      expect(foo).to.equal('');
    });
  });

  context('#log', function () {
    it('should log', function () {
      const spy = sinon.stub(console, 'log');
      log('Alice', 1);
      assert(spy.calledWithExactly('Alice', 1));
      spy.restore();
    });
  });

  context('#checkEnvironment', function () {
    it('should show log depends on if in iframe or not', function () {
      const isTop = window.top === window;
      const spy = sinon.spy(console, 'log');
      assert(checkEnvironment());
      expect(spy.calledOnce).to.equal(isTop);
      spy.restore();
    });
  });

  context('#createArrayWhenEmpty', function () {
    it('should create new array when not empty', function () {
      const obj = { foo: ['bar'] };
      createArrayWhenEmpty(obj, 'foo');
      expect(obj.foo).to.eql(['bar']);
    });

    it('should create new array when empty', function () {
      const obj = { foo: [] };
      createArrayWhenEmpty(obj, 'foo');
      expect(obj.foo).to.be.an('array').that.has.length(0);
    });
  });

});
