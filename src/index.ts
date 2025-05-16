import { version } from '../package.json';
import {
  createEntityDataGenerator,
  logActivityDataGenerator,
  relateEntityDataGenerator,
} from './action-data-generator';
import { ENTITY_TYPE } from './constant';
import Deferred from './defer';
import EntityModel, { IContextData, IEntityModel } from './entity-model';
import {
  IActionApiData,
  IApiOptions,
  IContextMessageData,
  IMessageData,
  IRefreshTargetMessage,
  ISdkInitOptions,
} from './interfaces';
import {
  checkEnvironment,
  createArrayWhenEmpty,
  delayExecution,
  getParameterByName,
} from './utils';

export default class Copper {
  public static init() {
    const parentOrigin = getParameterByName('origin');
    const instanceId = getParameterByName('instanceId');
    const options: ISdkInitOptions = {
      isGlobal: getParameterByName('isGlobal') === '1',
    };

    if (!checkEnvironment()) {
      throw new Error('Environment checking does not pass.');
    }

    return new Copper(parentOrigin, instanceId, options);
  }

  public static get version() {
    return version;
  }

  /**
   * store deferred queues by name
   */
  private deferredQueues: { [name: string]: Deferred<IMessageData>[] } = {};

  /**
   * store event callbacks by event name
   */
  private events: { [name: string]: (() => any)[] } = {};

  private _context: IEntityModel | null;

  /**
   * Creates an instance of Copper.
   * @param {*} [_win=window] has to be any type to support testing
   * @memberof Copper
   */
  constructor(
    private parentOrigin: string,
    private instanceId: string,
    private options: ISdkInitOptions,
    private _win: any = window,
  ) {
    if (!this.parentOrigin || !this.instanceId) {
      throw new TypeError('parentOrigin or instanceId is empty');
    }

    this._listenMessage();

    // listen to contextUpdated event
    this._subscribeContextUpdated();

    // notify parent frame init
    this._postMessage('init');
  }

  public get win(): Window {
    return this._win;
  }

  public async getContext(): Promise<IContextData> {
    const messageData = await this._deferredPost('getContext');
    return this._createContextModel(messageData);
  }

  public async getUserInfo(): Promise<any> {
    return this._deferredPost('getUserInfo');
  }

  public async getRouteInfo(): Promise<any> {
    return this._deferredPost('getRouteInfo');
  }

  public async saveContext(context: EntityModel): Promise<IContextData> {
    const messageData = await this._deferredPost('saveContext', {
      data: {
        entityType: context.type,
        entityData: context.toObject(),
      },
    });
    return this._createContextModel(messageData);
  }

  public setAppUI(data: {}): void {
    this._postMessage('setUI', { data });
  }

  public showModal(params = {}): void {
    this._postMessage('showModal', { params });
  }

  public closeModal(): void {
    this._postMessage('closeModal');
  }

  public showFullScreen(): void {
    this._postMessage('showFullScreen');
  }

  public closeFullScreen(): void {
    this._postMessage('closeFullScreen');
  }

  /**
   * Allows developer to send message to another instance of its app
   * e.g. Sending data from modal to sidebar, so sidebar can display some data immediately
   *
   * @param target another instance/location of the app. '*' means broadcast to all other locations.
   */
  public publishMessage(messageType: string, target: string, msg = {}): void {
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
    refreshDelay = 0,
  ): Promise<any> {
    const context = await this._getCachedContext();
    const data = logActivityDataGenerator(context, {
      activityType,
      details,
      activityDate,
    });
    return this._action(data, refreshDelay);
  }

  public async createEntity(
    entityType: ENTITY_TYPE,
    entityData: object,
    refreshDelay = 0,
  ): Promise<any> {
    let context: IEntityModel;
    try {
      context = await this._getCachedContext();
    } catch (e) {
      // we allow create entity be called without actual context
      context = {} as IEntityModel;
    }
    const apiOptions = createEntityDataGenerator(context, {
      entityType,
      data: entityData,
    });
    const { url, method, data, target } = apiOptions;
    const result = await this.api(url, { method, body: JSON.stringify(data) });
    if (target && target.data) {
      target.data.entityData = result;
      delayExecution(() => {
        this.refreshUI(target);
      }, refreshDelay);
    }
    return result;
  }

  public async relateEntity(
    entityType: ENTITY_TYPE,
    entityId: number,
    relateData: { id: number; type: ENTITY_TYPE },
    refreshDelay = 0,
  ): Promise<any> {
    const context = await this._getCachedContext();
    const data = relateEntityDataGenerator(context, {
      entityType,
      entityId: parseInt(entityId as any, 10),
      data: relateData,
    });
    return this._action(data, refreshDelay);
  }

  public refreshUI(target: IRefreshTargetMessage): void {
    this._postMessage('refreshUI', { target });
  }

  public on(eventName: string, cb: () => any): void {
    createArrayWhenEmpty(this.events, eventName);
    this.events[eventName].push(cb);
  }

  public trigger(eventName: string, data: {}): void {
    if (this.events[eventName]) {
      this.events[eventName].forEach((cb) => {
        cb.call(this, data);
      });
    }
  }

  public api(url: string, options?: IApiOptions): Promise<any> {
    if (!url) {
      return Promise.reject({
        id: 'sdk-api',
        version: Copper.version,
        detail: 'url cannot be empty',
      });
    }
    if (options && options.body) {
      try {
        JSON.parse(options.body);
      } catch (e) {
        return Promise.reject({
          id: 'sdk-api',
          version: Copper.version,
          detail: 'body must be a valid JSON string',
        });
      }
    }
    return this._deferredPost('api', {
      url,
      options,
    });
  }

  public navigateToEntityDetail(entityType: string, entityId: number): Promise<any> {
    return this._deferredPost('navigateToEntityDetail', { entityType, entityId });
  }

  public navigateToSavedFilter(entityType: string, savedFilterId: number): Promise<any> {
    return this._deferredPost('navigateToSavedFilter', { entityType, savedFilterId });
  }

  public getSelectedRecords({ pageSize = 100, pageNumber = 0 } = {}): Promise<any> {
    return this._deferredPost('getSelectedRecords', { pageSize, pageNumber });
  }

  public getConfig(): Promise<{ appConfig: any, config: any }> {
    return this._deferredPost('getConfig');
  }

  private async _getCachedContext(): Promise<IEntityModel> {
    if (this._context) {
      return this._context;
    }

    const { context } = await this.getContext();
    return context;
  }

  private _postMessage(type: string, message: { [name: string]: any } = {}, id: number = -1): void {
    this.win.top?.postMessage(
      {
        // actual messages
        ...message,
        // as a credential to the parent frame, so parent frame can recoganize the origin
        instanceId: this.instanceId,
        // tell parent frame current sdk version
        version,
        // type of message
        type,
        // optional id for message
        id,
      },
      this.parentOrigin,
    );
  }

  private _listenMessage(): void {
    this.win.addEventListener(
      'message',
      (event: MessageEvent) => {
        if (!this._isOriginValid(event)) {
          return;
        }

        // if type is a deferred type, we resolve it
        // otherwise we do something else
        this._resolveDeferred(event.data.type, event.data.id, event.data as IMessageData);

        // if event type exists, we pass the event to SDK
        // so sdk user can subscribe those events
        if (event.data.type) {
          this.trigger(event.data.type, event.data.msg || event.data.data);
        }
      },
      false,
    );
  }

  private _isOriginValid(event: MessageEvent): boolean {
    // only check origin for now
    return event.origin === this.parentOrigin;
  }

  private _enqueueDeferred(queueName: string, deferred: Deferred<IMessageData>): void {
    createArrayWhenEmpty(this.deferredQueues, queueName);
    this.deferredQueues[queueName].push(deferred);
  }

  private _resolveDeferred(queueName: string, messageId: number, data: IMessageData): void {
    const queue = this.deferredQueues[queueName];
    if (!queue) {
      return;
    }

    const foundIdx = queue.findIndex((d) => {
      return d.id === messageId;
    });

    const deferred = queue[foundIdx];
    if (deferred) {
      queue.splice(foundIdx, 1);
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

  private async _action(
    { url, method, data, target }: IActionApiData,
    delay: number,
  ): Promise<any> {
    const result = await this.api(url, { method, body: JSON.stringify(data) });
    if (target) {
      delayExecution(() => {
        this.refreshUI(target);
      }, delay);
    }
    return result;
  }

  private _createDeferredMethod(
    queueName: string,
    executor: (deferred: Deferred<any>) => any,
  ): Promise<any> {
    const deferred = new Deferred<any>();
    this._enqueueDeferred(queueName, deferred);
    executor(deferred);
    return deferred.promise;
  }

  private _deferredPost(name: string, data?: any): Promise<any> {
    return this._createDeferredMethod(name, (deferred) => {
      if (data) {
        this._postMessage(name, data, deferred.id);
      } else {
        this._postMessage(name, {}, deferred.id);
      }
    });
  }

  private _subscribeContextUpdated() {
    this.on('contextUpdated', () => {
      // remove _context caching
      this._context = null;
    });
  }
}
