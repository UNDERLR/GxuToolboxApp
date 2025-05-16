import {http} from "../http.ts";
import {CourseScheduleQueryRes} from "../../type/api/classScheduleAPI.ts";
import {SchoolTerms, SchoolYears} from "../../type/global.ts";
import moment from "moment/moment";
import {ExamInfoQueryRes, ExamScoreQueryRes} from "../../type/api/examInfoAPI.ts";
import {jwxt} from "./jwxt.ts";
import {ToastAndroid} from "react-native";

export const defaultYear = moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year();

export const infoQuery = {
    getCourseSchedule: (year: number, term: string, retry = true): Promise<CourseScheduleQueryRes> => {
        const yearIndex = SchoolYears.findIndex(v => +v[0] === year);
        return new Promise((resolve, reject) => {
            http.post("/kbcx/xskbcx_cxXsgrkb.html", {
                xnm: SchoolYears[yearIndex ?? SchoolYears.findIndex(v => +v[0] === defaultYear)][0],
                xqm: term ?? SchoolTerms[0][0],
            }).then(res => {
                if (typeof res.data === "object") {
                    ToastAndroid.show("获取课表成功", ToastAndroid.SHORT);
                    resolve(res.data);
                } else {
                    reject(res);
                    ToastAndroid.show("获取课表信息失败，尝试刷新Token", ToastAndroid.SHORT);
                    if (retry) {
                        jwxt.refreshToken(() => infoQuery.getCourseSchedule(year, term, false));
                    }
                }
            });
        });
    },
    getExamInfo: (year: number, term: string, page: number = 1, retry = true): Promise<ExamInfoQueryRes> => {
        const yearIndex = SchoolYears.findIndex(v => +v[0] === year);
        return new Promise((resolve, reject) => {
            http.post("/kwgl/kscx_cxXsksxxIndex.html?doType=query", {
                xnm: SchoolYears[yearIndex ?? SchoolYears.findIndex(v => +v[0] === defaultYear)][0],
                xqm: term ?? SchoolTerms[0][0],
                queryModel: {
                    showCount: 15,
                    currentPage: page > 0 ? page : 1,
                    sortName: "",
                    sortOrder: "asc",
                },
            }).then(res => {
                if (typeof res.data === "object") {
                    ToastAndroid.show("获取考试信息成功", ToastAndroid.SHORT);
                    resolve(res.data);
                } else {
                    reject(res);
                    ToastAndroid.show("获取考试信息失败，尝试刷新Token", ToastAndroid.SHORT);
                    if (retry) {
                        jwxt.refreshToken(() => infoQuery.getCourseSchedule(year, term, false));
                    }
                }
            });
        });
    },
    getExamScore: (year: number, term: string, page: number = 1, retry = true): Promise<ExamScoreQueryRes> => {
        const yearIndex = SchoolYears.findIndex(v => +v[0] === year);
        return new Promise((resolve, reject) => {
            http.post("/cjcx/cjcx_cxXsgrcj.html?doType=query", {
                xnm: SchoolYears[yearIndex ?? SchoolYears.findIndex(v => +v[0] === defaultYear)][0],
                xqm: term ?? SchoolTerms[0][0],
                queryModel: {
                    showCount: 15,
                    currentPage: page > 0 ? page : 1,
                    sortName: "",
                    sortOrder: "asc",
                },
            }).then(res => {
                if (typeof res.data === "object") {
                    ToastAndroid.show("获取考试成绩信息成功", ToastAndroid.SHORT);
                    resolve(res.data);
                } else {
                    reject(res);
                    ToastAndroid.show("获取考试成绩信息失败，尝试刷新Token", ToastAndroid.SHORT);
                    if (retry) {
                        jwxt.refreshToken(() => infoQuery.getCourseSchedule(year, term, false));
                    }
                }
            });
        });
    },
};
