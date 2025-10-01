export class BaseClass<T>{
    _ori: T;

    constructor(ori: T) {
        Object.assign(this, ori);
        this._ori = ori;
    }
}
