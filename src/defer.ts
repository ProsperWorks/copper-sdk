export default class Deferred<T> {
  public static resetNextId() {
    Deferred._nextId = 0;
  }

  private static _nextId: number = 0;

  private static getNextId() {
    return Deferred._nextId++;
  }

  private _promise: Promise<T>;
  private _resolve: (value?: T | PromiseLike<T>) => void;
  private _reject: (reason?: any) => void;
  private _id: number;

  constructor() {
    this._promise = new Promise<T>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
    this._id = Deferred.getNextId();
  }

  public get promise(): Promise<T> {
    return this._promise;
  }

  public get id(): number {
    return this._id;
  }

  public resolve = (value?: T | PromiseLike<T>): void => {
    this._resolve(value);
  }

  public reject = (reason?: any): void => {
    this._reject(reason);
  }
}
