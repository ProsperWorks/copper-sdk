/**
 * getParameterByName
 *
 * @param name
 * @param url
 * @returns {string}
 */
export function getParameterByName(name, url) {
  if (!url) url = window.location.href
  name = name.replace(/[[]]/g, '\\$&')
  var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url)
  if (!results) return null
  if (!results[2]) return ''
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * defer
 *
 * @returns {Promise.defer}
 */
export function defer() {
  if (typeof Promise !== 'undefined' && Promise.defer) {
    return Promise.defer()
  } else {
    const deferred = {}
    deferred.promise = new Promise(function (resolve, reject) {
      deferred.resolve = resolve
      deferred.reject = reject
    })
    return deferred
  }
}
