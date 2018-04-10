import { version } from '../package.json';
import {
  createEntityDataGenerator,
  logActivityDataGenerator,
  relateEntityDataGenerator,
} from './action-data-generator';
import { ENTITY_TYPE, HTTP_METHOD } from './constant';
import Deferred from './defer';
import EntityModel, { IContextData, IEntityModel } from './entity-model';
import {
  IActionApiData,
  IApiOptions,
  IContextMessageData,
  IMessageData,
  IRefreshTargetMessage,
} from './interfaces';
import {
  checkEnvironment,
  createArrayWhenEmpty,
  delayExecution,
  getParameterByName,
  log,
} from './utils';

export default class PWSDK {
  public static init() {
    const parentOrigin = getParameterByName('origin');
    const instanceId = getParameterByName('instanceId');

    if (!checkEnvironment()) {
      throw new Error('Environment checking does not pass.');
    }

    return new PWSDK(parentOrigin, instanceId);
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

  private _context: IEntityModel | null;

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

  public async getContext(): Promise<IContextData> {
    const messageData = await this._createDeferredMethod('getContext', () => {
      this._postMessage('getContext');
    });

    return this._createContextModel(messageData);
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
   * @param target another instance/location of the app. '*' means broadcast to all other locations.
   */
  public publishMessage(messageType: string, target: string, msg = {}) {
    this._postMessage('publishMessage', {
      target,
      data: {
        type: messageType,
        msg,
      },
    });
  }

  public async logActivity(
    activityType: number,
    details: string,
    activityDate?: number,
    refreshDelay = 1000,
  ) {
    const context = await this._getCachedContext();
    const data = logActivityDataGenerator(context, {
      activityType,
      details,
      activityDate,
    });
    return this._action(data, refreshDelay);
  }

  public async createEntity(entityType: ENTITY_TYPE, entityData: object, refreshDelay = 4000) {
    const context = await this._getCachedContext();
    const data = createEntityDataGenerator(context, {
      entityType,
      data: entityData,
    });
    return this._action(data, refreshDelay);
  }

  public async relateEntity(
    entityType: ENTITY_TYPE,
    entityId: number,
    relateData: { id: number; type: ENTITY_TYPE },
    refreshDelay = 0,
  ) {
    const context = await this._getCachedContext();
    const data = relateEntityDataGenerator(context, {
      entityType,
      entityId: parseInt(entityId as any, 10),
      data: relateData,
    });
    return this._action(data, refreshDelay);
  }
  /**
   * refresh ui of the parent frame
   */
  public refreshUI(target: IRefreshTargetMessage) {
    this._postMessage('refreshUI', { target });
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

  public api(url: string, options?: IApiOptions) {
    if (!url) {
      return Promise.reject({
        id: 'sdk-api',
        version: PWSDK.version,
        detail: 'url cannot be empty',
      });
    }
    if (options && options.body) {
      try {
        JSON.parse(options.body);
      } catch (e) {
        return Promise.reject({
          id: 'sdk-api',
          version: PWSDK.version,
          detail: 'body must be a valid JSON string',
        });
      }
    }
    const deferred = new Deferred<any>();
    this._enqueueDeferred('api', deferred);
    this._postMessage('api', {
      url,
      options,
    });
    return deferred.promise;
  }

  private async _getCachedContext(): Promise<IEntityModel> {
    if (this._context) {
      return this._context;
    }

    const { context } = await this.getContext();
    return context;
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
          this.trigger(event.data.type, event.data.msg);
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
      if (data.error) {
        return deferred.reject(data.error);
      }
      deferred.resolve(data.data);
    }
  }

  private _createContextModel({
    entityType,
    entityData,
    editableFields,
  }: IContextMessageData): IContextData {
    const context = new EntityModel(
      entityType,
      entityData,
      editableFields,
      this.saveContext.bind(this),
    );
    this._context = context;
    return {
      type: entityType,
      context,
    };
  }

  private async _action({ url, method, data, target }: IActionApiData, delay: number) {
    const result = await this.api(url, { method, body: JSON.stringify(data) });
    if (target) {
      delayExecution(() => {
        this.refreshUI(target);
      }, delay);
    }
    return result;
  }

  private _createDeferredMethod(queueName: string, executor: () => any) {
    const deferred = new Deferred<any>();
    this._enqueueDeferred(queueName, deferred);
    executor();
    return deferred.promise;
  }
}
