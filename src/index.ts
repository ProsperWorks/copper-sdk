import { Deferred } from 'ts-deferred'
import { getParameterByName } from './utils'

class PWSDK {
  public static init() {
    return new PWSDK()
  }

  constructor() {

    if (window.top === window) {
      throw new Error('PWSDK can only work inside an iframe')
    }

    this.deferred = {}
    this.events = {}

    const origin = getParameterByName('origin')
    const instanceId = getParameterByName('instanceId')
    this.origin = origin
    this.instanceId = instanceId


    window.addEventListener('message', event => {
      if (event.origin === this.origin) {
        if (this.deferred.getContext) {
          this.deferred.getContext.resolve(event.data)
          this.deferred.getContext = null
        }
      }

      switch (event.data.type) {
        case 'closeWindow':
          this.trigger('closeWindow', 'hey')
          break
        case 'addButtonClicked':
          this.trigger('addButtonClicked')
          break
        case 'addNewConversation':
          this.trigger('addNewConversation', event.data)
          break
        default:
          break
      }

    }, false)
  }

  postMessage(message) {
    window.top.postMessage({
      instanceId: this.instanceId,
      // iframeOrigin: window.location.origin,
      ...message,
    }, this.origin)
  }

  getContext() {
    this.deferred.getContext = new Deferred()
    this.postMessage({
      type: 'getContext',
    })
    return this.deferred.getContext.promise
  }

  setAppUI(data) {
    return new Promise((resolve) => {
      this.deferred.setAppUI = { resolve }
      this.postMessage({
        type: 'setUI',
        data,
      })
    })
  }

  showModal(params = {}) {
    this.postMessage({
      type: 'showModal',
      params,
    })
  }

  closeModal() {
    this.postMessage({
      type: 'closeModal',
    })
  }

  proxyMessage(target, data = {}) {
    this.postMessage({
      type: 'proxyMessage',
      target,
      data,
    })
  }

  on(eventName, cb) {
    if (!this.events[eventName])
      this.events[eventName] = []

    this.events[eventName].push(cb)
  }

  trigger(eventName, ...args) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((cb) => {
        cb.call(this, ...args)
      })
    }
  }
}

export default PWSDK
