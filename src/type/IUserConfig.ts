import {PressableAndroidRippleConfig} from "react-native";
import {SchoolTermValue, SchoolYearValue} from "@/type/global.ts";
import {Course} from "@/type/infoQuery/course/course.ts";
import {ExamInfo} from "@/type/infoQuery/exam/examInfo.ts";

export interface IUserConfig {
    /** 主题相关配置 */
    theme: IUserTheme;
    /** 部分教务配置 */
    jw: IUserJwConfig;
    /** 偏好配置 */
    preference: IUserPreference;
}

/** 用户教务配置 */
export interface IUserJwConfig {
    /** 学年 */
    year: SchoolYearValue;
    /** 学期 */
    term: SchoolTermValue;
    /** 当前课表起始 */
    startDay: string;
}

/** 偏好配置 */
export interface IUserPreference {
    /** 课程元素详情 */
    courseDetail: Record<keyof Omit<Course, "queryModel" | "userModel">, IDetailItem>;
    /** 考试元素详情 */
    examDetail: Record<keyof Omit<ExamInfo, "queryModel" | "userModel">, IDetailItem>;
}

/** 元素详情元素 */
export interface IDetailItem {
    /** 是否展示 */
    show: boolean;
    /** 对应的标签 */
    label: string;
}

/** 用户主题配置 */
export interface IUserTheme {
    /** 主题色 */
    primaryColor: string;
    /** 背景图链接 */
    bgUrl: string;
    /** 背景透明度 */
    bgOpacity: number;
    ripple: PressableAndroidRippleConfig;
    /** 课程表主题相关属性 */
    course: {
        /** 课表时间段高度（两节课） */
        timeSpanHeight: number;
        /** 课表表头日期部分高度 */
        weekdayHeight: number;
        /** 课表课程元素间距 */
        courseItemMargin: number;
        /** 课表课程元素边框宽度 */
        courseItemBorderWidth: number;
        /** 课程元素颜色Map */
        courseColor: Record<string, string>
    };
}
