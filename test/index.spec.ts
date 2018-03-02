import PWSDK from '../lib/index'
console.log(PWSDK)

describe('PWSDK', function () {
  let sdk
  let origin = 'http://localhost'
  let instanceId = '1'
  beforeEach(function() {
    sdk = new PWSDK(origin, instanceId)
  })

  after(function () {
    sdk = null
  })

  it('should exists', function () {
    assert(typeof PWSDK.init === 'function')
    assert.isOk(sdk)
  })

})

