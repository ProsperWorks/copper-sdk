import { version } from '../package.json';
import Deferred from './defer';
import EntityModel, { IContextData } from './entity-model';
import { createArrayWhenEmpty, getParameterByName, log } from './utils';

export interface IMessageData {
  type: string;
  data?: any;
}

export interface IContextMessageData extends IMessageData {
  data: {
    entityType: string;
    entityData: object;
    editableFields: string[];
  };
}

export interface IPostMessageData {
  type: string;
  instanceId: string;
  version: string;
  params?: {[name: string]: string};
  [propName: string]: any;
}

export default class PWSDK {
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

  public static get version() {
    return version;
  }

  /**
   * store deferred queues by name
   */
  private deferredQueues: { [name: string]: Array<Deferred<IMessageData>> } = {};

  /**
   * store event callbacks by event name
   */
  private events: { [name: string]: Array<() => any> } = {};

  /**
   * Creates an instance of PWSDK.
   * @param {*} [_win=window] has to be any type to support testing
   * @memberof PWSDK
   */
  constructor(
    private parentOrigin: string,
    private instanceId: string,
    private _win: any = window,
  ) {
    if (!this.parentOrigin || !this.instanceId) {
      throw new TypeError('parentOrigin or instanceId is empty');
    }

    this._listenMessage();
  }

  public get win(): Window {
    return this._win;
  }

  public getContext() {
    const deferred = new Deferred<IContextData>();
    this._enqueueDeferred('getContext', deferred);
    this._postMessage('getContext');
    return deferred.promise.then(this._createContextModel.bind(this));
  }

  public saveContext(context: EntityModel) {
    const deferred = new Deferred<IContextData>();
    this._enqueueDeferred('saveContext', deferred);
    this._postMessage('saveContext', {
      data: {
        entityType: context.type,
        entityData: context.toObject(),
      },
    });
    return deferred.promise.then(this._createContextModel.bind(this));
  }

  public setAppUI(data: {}) {
    this._postMessage('setUI', { data });
  }

  public showModal(params = {}) {
    this._postMessage('showModal', { params });
  }

  public closeModal() {
    this._postMessage('closeModal');
  }

  /**
   * Allows developer to send message to another instance of its app
   * e.g. Sending data from modal to sidebar, so sidebar can display some data immediately
   *
   * @param target another instance/location of the app
   * @param data
   */
  public proxyMessage(target: string, data = {}) {
    this._postMessage('proxyMessage', {
      target,
      data,
    });
  }

  public on(eventName: string, cb: () => any) {
    createArrayWhenEmpty(this.events, eventName);
    this.events[eventName].push(cb);
  }

  public trigger(eventName: string, data: {}) {
    if (this.events[eventName]) {
      this.events[eventName].forEach((cb) => {
        cb.call(this, data);
      });
    }
  }

  private _postMessage(type: string, message: { [name: string]: any } = {}) {
    this.win.top.postMessage(
      {
        // actual messages
        ...message,
        // as a credential to the parent frame, so parent frame can recoganize the origin
        instanceId: this.instanceId,
        // tell parent frame current sdk version
        version,
        // type of message
        type,
      },
      this.parentOrigin,
    );
  }

  private _listenMessage() {
    this.win.addEventListener(
      'message',
      (event: MessageEvent) => {
        if (!this._isOriginValid(event)) {
          return;
        }

        // if type is a deferred type, we resolve it
        // otherwise we do something else
        this._resolveDeferred(event.data.type, event.data as IMessageData);

        // if event type exists, we pass the event to SDK
        // so sdk user can subscribe those events
        if (event.data.type) {
          this.trigger(event.data.type, event.data);
        }
      },
      false,
    );
  }

  private _isOriginValid(event: MessageEvent): boolean {
    // only check origin for now
    return event.origin === this.parentOrigin;
  }

  private _enqueueDeferred(queueName: string, deferred: Deferred<IMessageData>) {
    createArrayWhenEmpty(this.deferredQueues, queueName);
    this.deferredQueues[queueName].push(deferred);
  }

  private _resolveDeferred(queueName: string, data: IMessageData) {
    if (!this.deferredQueues[queueName]) {
      return;
    }
    const deferred = this.deferredQueues[queueName].shift();
    if (deferred) {
      deferred.resolve(data);
    }
  }

  private _createContextModel({
    type,
    data: { entityType, entityData, editableFields },
  }: IContextMessageData): IContextData {
    const context = new EntityModel(
      entityType,
      entityData,
      editableFields,
      this.saveContext.bind(this),
    );
    return {
      type: entityType,
      context,
    };
  }
}
