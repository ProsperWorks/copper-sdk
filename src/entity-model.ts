import { log } from './utils';

interface IPropertyDefinition {
  enumerable?: boolean;
  get?: () => any;
  set?: () => any;
  value?: any;
  writable?: boolean;
}

// TODO
// create interface per entity and write down all fields
export interface IEntityModel {
  type: string;
  [propName: string]: any;

  save(): Promise<IContextData>;
  toJSON(): string;
  toObject(): {};
}

export interface IContextData {
  type: string;
  context: IEntityModel;
}

export default class EntityModel implements IEntityModel {
  constructor(
    type: string,
    entityData: { [name: string]: any },
    editableFields: string[],
    onSave: (model: EntityModel) => Promise<IContextData>,
  ) {
    const propertyDefinitions: { [name: string]: IPropertyDefinition } = {};

    // override the type getter
    // we don't want type to be enumerable
    // since we want to be aligned with developer api
    propertyDefinitions.type = {
      enumerable: false,
      writable: false,
      value: type,
    };

    // override _onSave function
    propertyDefinitions._onSave = {
      enumerable: false,
      value: onSave,
    };

    Object.assign(propertyDefinitions, this._getEntityDataDefinition(entityData, editableFields));
    Object.defineProperties(this, propertyDefinitions);
  }

  public get type() {
    return 'type';
  }

  public async save(): Promise<IContextData> {
    return await this._onSave(this);
  }

  public toJSON() {
    return JSON.stringify(this.toObject());
  }

  public toObject() {
    const obj: any = {};
    Object.keys(this).forEach((key) => {
      obj[key] = (this as IEntityModel)[key];
    });
    return obj;
  }

  private async _onSave(model: EntityModel) {
    return {} as IContextData;
  }

  private _getEntityDataDefinition(entityData: { [name: string]: any }, editableFields: string[]) {
    const propertyDefinitions: { [name: string]: IPropertyDefinition } = {};
    Object.keys(entityData).forEach((key) => {
      if (editableFields.indexOf(key) === -1) {
        propertyDefinitions[key] = {
          get() {
            return entityData[key];
          },
          set() {
            log(`property ${key} is read only`);
          },
          enumerable: true,
        };
      } else {
        propertyDefinitions[key] = {
          value: entityData[key],
          writable: true,
          enumerable: true,
        };
      }
    });
    return propertyDefinitions;
  }
}
