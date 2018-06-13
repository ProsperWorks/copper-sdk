import { ENTITY_TYPE, HTTP_METHOD } from './constant';

export enum UITarget {
  ActivityLog = 'ActivityLog',
  ListView = 'ListView',
  Related = 'Related',
}

export interface IContextMessageData {
  entityType: ENTITY_TYPE;
  entityData: object;
  editableFields: string[];
}

export interface IMessageData {
  type: string;
  error?: string;
  data?: any;
}

export interface IRefreshTargetMessage {
  name: UITarget;
  data?: any;
}

export interface IActionApiData {
  url: string;
  method?: HTTP_METHOD;
  data: object;
  target: IRefreshTargetMessage | null;
}

export interface IApiOptions {
  method?: HTTP_METHOD;
  body?: string;
}

export interface IPostMessageData {
  type: string;
  instanceId: string;
  version: string;
  params?: { [name: string]: string };
  [propName: string]: any;
}

export interface ISdkInitOptions {
  isGlobal: boolean;
}
