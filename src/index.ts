import Deferred from './defer';
import { getParameterByName } from './utils';

class PWSDK {
  public static init() {
    const origin = getParameterByName('origin');
    const instanceId = getParameterByName('instanceId');

    return new PWSDK(origin, instanceId);
  }

  private deferred: any = {};
  private events = {};

  constructor(private origin: string, private instanceId: string) {
    if (window.top === window) {
      throw new Error('PWSDK can only work inside an iframe');
    }

    window.addEventListener('message', (event) => {
      if (event.origin === this.origin) {
        if (this.deferred.getContext) {
          this.deferred.getContext.resolve(event.data);
          this.deferred.getContext = null;
        }
      }

      switch (event.data.type) {
        case 'closeWindow':
          this.trigger('closeWindow', 'hey');
          break;
        case 'addButtonClicked':
          this.trigger('addButtonClicked');
          break;
        case 'addNewConversation':
          this.trigger('addNewConversation', event.data);
          break;
        default:
          break;
      }

    }, false);
  }

  public postMessage(message) {
    window.top.postMessage({
      instanceId: this.instanceId,
      // iframeOrigin: window.location.origin,
      ...message,
    }, this.origin);
  }

  public getContext() {
    this.deferred.getContext = new Deferred();
    this.postMessage({
      type: 'getContext',
    });
    return this.deferred.getContext.promise;
  }

  public setAppUI(data) {
    return new Promise((resolve) => {
      this.deferred.setAppUI = { resolve };
      this.postMessage({
        type: 'setUI',
        data,
      });
    });
  }

  public showModal(params = {}) {
    this.postMessage({
      type: 'showModal',
      params,
    });
  }

  public closeModal() {
    this.postMessage({
      type: 'closeModal',
    });
  }

  public proxyMessage(target, data = {}) {
    this.postMessage({
      type: 'proxyMessage',
      target,
      data,
    });
  }

  public on(eventName, cb) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push(cb);
  }

  public trigger(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((cb) => {
        cb.call(this, ...args);
      });
    }
  }
}

export default PWSDK;
