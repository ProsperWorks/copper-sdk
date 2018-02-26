/**
 * getParameterByName
 */
export function getParameterByName(name: string, url: string): string {
  if (!url) {
    url = window.location.href
  }
  name = name.replace(/[[]]/g, '\\$&')
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
  const results = regex.exec(url)
  if (!results || !results[2]) {
    return ''
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '))
}

/**
 * defer
 *
 * @returns {Promise.defer}
 */
export function defer() {
  if (typeof Promise !== 'undefined' && ('defer' in Promise)) {
    return Promise.defer()
  } else {
    const deferred: any = {}
    deferred.promise = new Promise<any>(function (resolve, reject) {
      deferred.resolve = resolve
      deferred.reject = reject
    })
    return deferred
  }
}
