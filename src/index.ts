import Deferred from './defer';
import { getParameterByName, log } from './utils';

class PWSDK {
  public static init() {
    const parentOrigin = getParameterByName('origin');
    const instanceId = getParameterByName('instanceId');

    if (!PWSDK.checkEnvironment()) {
      throw new Error('Environment checking does not pass.');
    }

    return new PWSDK(parentOrigin, instanceId);
  }

  public static checkEnvironment(): boolean {
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
   * store deferred queues by name
   */
  private deferredQueues: {[name: string]: Array<Deferred<any>>} = {};

  /**
   * store event callbacks by event name
   */
  private events: {[name: string]: Array<() => any>} = {};

  constructor(private parentOrigin: string, private instanceId: string) {
    this._listenMessage();
  }

  public getContext() {
    const deferred = new Deferred<any>();
    this._enqueueDeferred('getContext', deferred);
    this._postMessage({
      type: 'getContext',
    });
    return deferred.promise;
  }

  public setAppUI(data: {}) {
    this._postMessage({
      type: 'setUI',
      data,
    });
  }

  public showModal(params = {}) {
    this._postMessage({
      type: 'showModal',
      params,
    });
  }

  public closeModal() {
    this._postMessage({
      type: 'closeModal',
    });
  }

  /**
   * Allows developer to send message to another instance of its app
   * e.g. Sending data from modal to sidebar, so sidebar can display some data immediately
   *
   * @param target another instance/location of the app
   * @param data
   */
  public proxyMessage(target: string, data = {}) {
    this._postMessage({
      type: 'proxyMessage',
      target,
      data,
    });
  }

  public on(eventName: string, cb: () => any) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(cb);
  }

  public trigger(eventName: string, data: {}) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((cb) => {
        cb.call(this, data);
      });
    }
  }

  private _postMessage(message: {[name: string]: any}) {
    window.top.postMessage({
      instanceId: this.instanceId,
      ...message,
    }, this.parentOrigin);
  }

  private _listenMessage() {
    window.addEventListener('message', (event: MessageEvent) => {
      if (!this._isOriginValid(event)) {
        return;
      }

      // if type is a deferred type, we resolve it
      // otherwise we do something else
      this._resolveDeferred(event.data.type, event.data);

      // if event type exists, we pass the event to SDK
      // so sdk user can subscribe those events
      if (event.data.type) {
        this.trigger(event.data.type, event.data);
      }
    }, false);
  }

  private _isOriginValid(event): boolean {
    // only check origin for now
    return event.origin === this.parentOrigin;
  }

  private _enqueueDeferred(queueName: string, deferred: Deferred<any>) {
    if (!this.deferredQueues[queueName]) {
      this.deferredQueues[queueName] = [];
    }
    this.deferredQueues[queueName].push(deferred);
  }

  private _resolveDeferred(queueName: string, data: any) {
    if (!this.deferredQueues[queueName]) {
      return;
    }
    const deferred = this.deferredQueues[queueName].shift();
    if (deferred) {
      deferred.resolve(data);
    }
  }
}

export default PWSDK;
