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

export function log(...msg: any[]): void {
  console.log(...msg); // tslint:disable-line
}

export function checkEnvironment(): boolean {
  // when the running environment is node.js, throwing error
  if (typeof window === 'undefined') {
    log('PWSDK can only run in browser environment');
    return false;
  }

  if (window.top === window) {
    log('PWSDK should be inside an iframe, otherwise it might not work as expected.');
  }

  return true;
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

export function delayExecution(func: () => any, delay = 1000) {
  setTimeout(() => {
    func();
  }, delay);
}
