import {PressableAndroidRippleConfig} from "react-native";

export interface IUserConfig {
    /** 主题相关配置 */
    theme: IUserTheme;
}

export interface IUserTheme {
    /** 主题色 */
    primaryColor: string;
    /** 背景图链接 */
    bgUrl: string;
    /** 背景透明度 */
    bgOpacity: number;
    ripple: PressableAndroidRippleConfig,
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
    };
}
