/**
 * getParameterByName
 */
export function getParameterByName(name: string, url = ''): string {
  if (!url) {
    url = window.location.href;
  }
  name = name.replace(/[[]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
  const results = regex.exec(url);
  if (!results || !results[2]) {
    return '';
  }
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function log(...msg): void {
  console.log(...msg); // tslint:disable-line
}

/**
 * This method has side effect,
 * it will alter the obj passed in
 */
export function createArrayWhenEmpty<T>(obj: { [key: string]: T[] }, name: string): void {
  if (!obj[name]) {
    obj[name] = [];
  }
}
