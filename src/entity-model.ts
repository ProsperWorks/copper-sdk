import { ENTITY_TYPE } from './constant';
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
  [propName: string]: any;

  save(): Promise<IContextData | null>;
  toJSON(): string;
  toObject(): {};
}

export interface IContextData {
  type: ENTITY_TYPE;
  context: IEntityModel;
}

export default class EntityModel implements IEntityModel {
  constructor(
    type: ENTITY_TYPE,
    entityData: { [name: string]: any },
    editableFields: string[] = [],
    onSave?: (model: IEntityModel) => Promise<IContextData | null>,
  ) {
    const propertyDefinitions = this._getEntityDataDefinition(entityData, editableFields);

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

    Object.defineProperties(this, propertyDefinitions);
  }

  [propName: string]: any;

  public async save(): Promise<IContextData | null> {
    if (this._onSave) {
      return await this._onSave(this);
    }
    return null;
  }

  public toJSON() {
    return JSON.stringify(this.toObject());
  }

  public toObject() {
    const obj: any = {};
    Object.keys(this).forEach((key) => {
      obj[key] = this[key];
    });
    return obj;
  }

  private _getEntityDataDefinition(entityData: { [name: string]: any }, editableFields: string[] = []) {
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
