import {SchoolTermValue, SchoolYearValue} from "@/type/global.ts";

/** 活动元素类型 */
export interface IActivity {
    /** 活动名称 */
    name: string;
    /** 活动描述 */
    desc: string;
    /** 活动当天节次跨度，1-13 */
    timeSpan: [number, number];
    /** 活动学期跨度,1-20 */
    weekSpan: [number, number];
    /** 活动所在当周星期，0-6 */
    weekday: number;
    /** 活动元素颜色 */
    color: string;
}

export interface ITermActivity {
    year: SchoolYearValue | number;
    term: SchoolTermValue;
    list: IActivity[];
}

export interface IUserActivity {
    data: ITermActivity[];
}
