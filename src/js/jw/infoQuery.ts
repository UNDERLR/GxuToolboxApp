import {http, objectToFormUrlEncoded, urlWithParams} from "@/js/http.ts";
import {
    ClassScheduleQueryRes,
    CourseScheduleQueryRes,
    GetCourseScheduleListRes,
} from "@/type/api/infoQuery/classScheduleAPI.ts";
import {SchoolTerms, SchoolTermValue, SchoolValue, SchoolYears} from "@/type/global.ts";
import moment from "moment/moment";
import {
    ExamInfoQueryRes,
    ExamScoreQueryRes,
    UsualInfoQueryRes,
    UsualScoreQueryRes,
} from "@/type/api/infoQuery/examInfoAPI.ts";
import {jwxt} from "./jwxt.ts";
import {ToastAndroid} from "react-native";
import {UserInfo} from "@/type/infoQuery/base.ts";
import {store} from "@/js/store.ts";
import {GetClassListRes, GetSubjectListRes} from "@/type/api/base.ts";

export const defaultYear = moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year();

export const infoQuery = {
    getUserInfo: async (): Promise<UserInfo> => {
        return await store.load<UserInfo>({
            key: "userInfo",
        });
    },
    getSubjectList: async (schoolId: SchoolValue): Promise<GetSubjectListRes> => {
        const res = await http.get(
            urlWithParams("/xtgl/comm_cxZydmList.html", {
                jg_id: schoolId,
            }),
        );
        return res.data;
    },
    getClassList: async (schoolId: SchoolValue, subjectId: string, grade: number): Promise<GetClassListRes> => {
        const res = await http.get(
            urlWithParams("/xtgl/comm_cxBjdmList.html", {
                jg_id: schoolId,
                zyh_id: subjectId,
                njdm_id: grade,
            }),
        );
        return res.data;
    },
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
    getExamInfo: async (year: number, term: SchoolTermValue, page: number = 1): Promise<ExamInfoQueryRes | null> => {
        const yearIndex = SchoolYears.findIndex(v => +v[0] === year);
        if (!(await jwxt.testToken())) {
            return null;
        }
        const reqBody = objectToFormUrlEncoded({
            xnm: SchoolYears[yearIndex ?? SchoolYears.findIndex(v => +v[0] === defaultYear)][0],
            xqm: term ?? SchoolTerms[0][0],
            queryModel: {
                showCount: 15,
                currentPage: page > 0 ? page : 1,
                sortName: "",
                sortOrder: "asc",
            },
        });
        const res = await http.post("/kwgl/kscx_cxXsksxxIndex.html?doType=query", reqBody);
        if (typeof res.data === "object") {
            return res.data;
        } else {
            ToastAndroid.show("获取考试信息失败", ToastAndroid.SHORT);
            return null;
        }
    },
    getExamScore: (year: number, term: SchoolTermValue, page: number = 1): Promise<ExamScoreQueryRes> => {
        const yearIndex = SchoolYears.findIndex(v => +v[0] === year);
        return new Promise(async (resolve, reject) => {
            if (!(await jwxt.testToken())) {
                reject();
                return;
            }
            const reqBody = objectToFormUrlEncoded({
                xnm: SchoolYears[yearIndex ?? SchoolYears.findIndex(v => +v[0] === defaultYear)][0],
                xqm: term ?? SchoolTerms[0][0],
                queryModel: {
                    showCount: 15,
                    currentPage: page > 0 ? page : 1,
                    sortName: "cjbdsj",
                    sortOrder: "desc",
                },
            });
            const res = await http.post("/cjcx/cjcx_cxXsgrcj.html?doType=query", reqBody);
            if (typeof res.data === "object") {
                resolve(res.data);
            } else {
                ToastAndroid.show("获取考试成绩信息失败", ToastAndroid.SHORT);
                reject(res);
            }
        });
    },
    // 获得平时分
    getUsualScore: (year: number, term: SchoolTermValue, id: string): Promise<UsualScoreQueryRes> => {
        const yearIndex = SchoolYears.findIndex(v => +v[0] === year);
        return new Promise(async (resolve, reject) => {
            if (!(await jwxt.testToken())) {
                reject();
                return;
            }
            const reqBody = objectToFormUrlEncoded({
                xnm: SchoolYears[yearIndex ?? SchoolYears.findIndex(v => +v[0] === defaultYear)][0],
                xqm: term ?? SchoolTerms[0][0],
                jxb_id: id,
            });
            const res = await http.post("/cjcx/cjcx_cxXsXmcjList.html?doType=query", reqBody);
            if (typeof res.data === "object") {
                console.log(reqBody);
                resolve(res.data);
            } else {
                ToastAndroid.show("获取平时成绩信息失败", ToastAndroid.SHORT);
                reject(res);
            }
        });
    },
};
