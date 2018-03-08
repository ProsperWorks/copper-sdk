import { expect } from 'chai';
import { getParameterByName } from '../src/utils';

describe('utils', function () {

  it('should get parameters correctly', function () {
    const foo = getParameterByName('foo', 'https://prosperworks.com?foo=Alice');
    expect(foo).to.equal('Alice');
  });

});
