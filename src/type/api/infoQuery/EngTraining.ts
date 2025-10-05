/** 工程训练中心接口返回体基础结构 */
export interface EngTrainingResRoot<T = any> {
    datas: T;
    message: string;
    status: number;
}

/** 工程训练中心获取Token接口返回体 */
export interface EngTrainingTokenRes extends EngTrainingResRoot<EngTrainingTokenResData> {}

/** 工程训练中心获取Token接口返回体数据，仅大致标注第一级，具体内容请调用接口查看 */
export interface EngTrainingTokenResData {
    /** 认证相关 */
    auths: any[];
    /** 菜单相关 */
    menus: Record<string, any>[];
    /** 请求接口使用的token */
    token: string;
    /** 用户信息 */
    user: Record<string, any>;
}

/** 表格查询返回体，例金工实训安排表查询 */
export interface EngTrainingScheduleRes extends EngTrainingResRoot<EngTrainingTableCell[][]> {}

/** 表格单元 */
export interface EngTrainingTableCell {
    /** 列跨度 */
    colNumber: number;
    /** 单元内容 */
    content: string;
    /** id */
    id: string;
    /** 行跨度 */
    rowNumber: number;
    /** 开始列 */
    startCol: number;
    /** 开始行 */
    startRow: number;
    /** 类型 */
    type: number;
}
