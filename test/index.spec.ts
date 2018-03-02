import { assert } from 'chai';
import PWSDK from '../src/index';

describe('PWSDK', function () {
  let sdk;
  const origin = 'http://localhost';
  const instanceId = '1';
  beforeEach(function () {
    sdk = new PWSDK(origin, instanceId);
  });

  after(function () {
    sdk = null;
  });

  it('should exists', function () {
    assert(typeof PWSDK.init === 'function');
    assert.isOk(sdk);
  });

});
