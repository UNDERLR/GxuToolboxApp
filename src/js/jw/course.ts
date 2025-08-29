import {BaseColor, Color} from "@/js/color.ts";
import {createContext, useCallback, useEffect, useState} from "react";
import {StyleSheet, ToastAndroid} from "react-native";
import {store} from "@/js/store.ts";
import {IUserConfig} from "@/type/IUserConfig.ts";
import {SchoolTerms, SchoolTermValue, SchoolValue, SchoolYears} from "@/type/global.ts";
import {
    ClassScheduleQueryRes,
    CourseScheduleQueryRes,
    GetCourseScheduleListRes,
} from "@/type/api/infoQuery/classScheduleAPI.ts";
import {jwxt} from "@/js/jw/jwxt.ts";
import {http, objectToFormUrlEncoded} from "@/js/http.ts";
import {defaultYear} from "@/js/jw/infoQuery.ts";

const CourseScheduleData = {
    courseInfoVisible: {
        name: true,
        position: true,
        teacher: true,
    },
    startDay: "2025-02-24",
    randomColor: [
        BaseColor.pink,
        BaseColor.lightgreen,
        BaseColor.skyblue,
        BaseColor.orange,
        BaseColor.tan,
        BaseColor.sandybrown,
        BaseColor.navy,
        BaseColor.maroon,
        BaseColor.mediumspringgreen,
        BaseColor.slateblue,
        BaseColor.yellowgreen,
        BaseColor.red,
        BaseColor.yellow,
        BaseColor.gold,
        BaseColor.lightskyblue,
        BaseColor.lightsteelblue,
        BaseColor.limegreen,
        BaseColor.mediumaquamarine,
        BaseColor.mediumblue,
    ],
    weekdayList: ["一", "二", "三", "四", "五", "六", "日"],
    timeSpanList: [
        "08:00\n08:45",
        "08:55\n09:40",
        "10:00\n10:45",
        "10:55\n11:40",
        "14:30\n15:15",
        "15:20\n16:05",
        "16:25\n17:10",
        "17:15\n18:00",
        "18:10\n18:55",
        "18:45\n19:30",
        "19:40\n20:25",
        "20:30\n21:15",
        "21:20\n22:05",
    ],
};

export function generateCourseScheduleStyle(config: IUserConfig["theme"]["course"], theme: any) {
    return StyleSheet.create({
        timeSpanHighLight: {
            position: "absolute",
            height: config.timeSpanHeight,
            flex: 1,
            width: "100%",
            left: 0,
            overflow: "hidden",
            borderRadius: 5,
            backgroundColor: Color(theme.colors.primary).setAlpha(0.1).rgbaString,
        },
        courseSchedule: {
            flex: 1,
            flexDirection: "row",
        },
        timeSpanContainer: {
            flex: undefined,
        },
        weekdayContainer: {
            flex: 1,
            justifyContent: "flex-start",
            borderRadius: 5,
            marginVertical: 10,
        },
        weekdayItem: {
            alignItems: "center",
            justifyContent: "center",
            height: config.weekdayHeight,
        },
        weekdayText: {
            fontSize: 14,
            textAlign: "center",
            color: theme.colors.grey2,
        },
        timeSpanItem: {
            height: config.timeSpanHeight,
        },
        timeSpanText: {
            textAlign: "center",
            fontSize: 12,
            color: theme.colors.grey2,
        },
        courseItem: {
            overflow: "hidden",
            width: "96%",
            marginHorizontal: "2%",
            borderRadius: 5,
            borderWidth: config.courseItemBorderWidth,
            borderStyle: "solid",
            paddingVertical: 5,
            paddingHorizontal: 2,
        },
        practicalCourseItem: {
            gap: 3,
            marginHorizontal: "2%",
            marginVertical: 10,
        },
    });
}

export function useCourseScheduleData() {
    const [courseScheduleData, setCourseScheduleData] = useState<typeof CourseScheduleData>(CourseScheduleData);
    const updateCourseScheduleData = useCallback(
        (data: Partial<typeof CourseScheduleData>) => {
            const newData = {
                ...courseScheduleData,
                ...data,
            };
            setCourseScheduleData(newData);
            store.save({key: "courseScheduleSetting", data: newData});
        },
        [courseScheduleData],
    );

    useEffect(() => {
        store
            .load({key: "courseScheduleSetting"})
            .then(data => {
                setCourseScheduleData(prevData => ({
                    ...prevData,
                    ...data,
                }));
            })
            .catch(err => {
                console.error("加载课程表设置失败:", err);
            });
    }, []); // 移除依赖，只在组件挂载时执行一次

    return {courseScheduleData, updateCourseScheduleData};
}

export const CourseScheduleContext = createContext<{
    courseScheduleData: typeof CourseScheduleData;
    courseScheduleStyle: ReturnType<typeof generateCourseScheduleStyle>;
    updateCourseScheduleData: (data: Partial<typeof CourseScheduleData>) => void;
} | null>(null);

export const courseApi = {
    getCourseSchedule: async (year: number, term: SchoolTermValue): Promise<CourseScheduleQueryRes | null> => {
        const yearIndex = SchoolYears.findIndex(v => +v[0] === year);
        if (!(await jwxt.testToken())) {
            return null;
        }
        const reqBody = objectToFormUrlEncoded({
            xnm: SchoolYears[yearIndex ?? SchoolYears.findIndex(v => +v[0] === defaultYear)][0],
            xqm: term ?? SchoolTerms[0][0],
        });
        const res = await http.post("/kbcx/xskbcx_cxXsgrkb.html", reqBody);
        if (typeof res.data === "object") {
            return res.data;
        } else {
            ToastAndroid.show("获取课表信息失败", ToastAndroid.SHORT);
            return null;
        }
    },
    getClassCourseScheduleList: async (
        year?: number,
        term?: SchoolTermValue,
        schoolId?: SchoolValue,
        subjectId?: string,
        grade?: number,
        classId?: string,
    ): Promise<GetCourseScheduleListRes> => {
        const reqBody = objectToFormUrlEncoded({
            xnm: year,
            xqm: term,
            njdm_id: grade,
            jg_id: schoolId,
            zyh_id: subjectId,
            bh_id: classId,
            queryModel: {
                showCount: 1000,
            },
        });
        const res = await http.post("/kbdy/bjkbdy_cxBjkbdyTjkbList.html", reqBody);
        return res.data;
    },
    getClassCourseSchedule: async (
        year: number,
        term: SchoolTermValue,
        schoolId: SchoolValue,
        subjectId: string,
        grade: number,
        classId: string,
    ): Promise<ClassScheduleQueryRes> => {
        const reqBody = objectToFormUrlEncoded({
            xnm: year,
            xqm: term,
            njdm_id: grade,
            jg_id: schoolId,
            zyh_id: subjectId,
            bh_id: classId,
            // 不确定，但得有
            tjkbzdm: 1,
            tjkbzxsdm: 0,
        });
        const res = await http.post("/kbdy/bjkbdy_cxBjKb.html", reqBody);
        return res.data;
    },
};
