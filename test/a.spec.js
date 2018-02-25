import { getParameterByName } from '../lib/utils'

describe('test', function () {
  it('should sum 1+1=2', function () {
    const foo = getParameterByName('foo', 'https://apple.com?foo=woo')
    expect(foo).to.equal('woo')
  })

  it('should fail', function () {
    const foo = getParameterByName('foo', 'https://apple.com?foo=woo')
    expect(foo).to.equal('woo')
  })

  it('should sinon', function () {
    assert.isOk(sinon)
  })
})
