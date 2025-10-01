/** 基础类，继承数据所有属性，`_ori` 属性为原始数据 */
export class BaseClass<T>{
    /** 原始数据 */
    readonly _ori: T;

    constructor(ori: T) {
        Object.assign(this, ori);
        this._ori = ori;
    }
}
