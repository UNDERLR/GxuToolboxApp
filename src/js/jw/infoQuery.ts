import {http, objectToFormUrlEncoded, urlWithParams} from "@/js/http.ts";
import {CourseScheduleQueryRes} from "@/type/api/infoQuery/classScheduleAPI.ts";
import {SchoolTerms, SchoolTermValue, SchoolValue, SchoolYears, SchoolYearValue} from "@/type/global.ts";
import moment from "moment/moment";
import {ExamInfoQueryRes, ExamScoreQueryRes} from "@/type/api/infoQuery/examInfoAPI.ts";
import {jwxt} from "./jwxt.ts";
import {ToastAndroid} from "react-native";
import {UserInfo} from "@/type/infoQuery/base.ts";
import {store} from "@/js/store.ts";
import {GetClassListRes, GetProfessionListRes} from "@/type/api/base.ts";

export const defaultYear = moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year();

export const infoQuery = {
    getUserInfo: async (): Promise<UserInfo> => {
        return await store.load<UserInfo>({
            key: "userInfo",
        });
    },
    getProfessionList: async (schoolId: SchoolValue): Promise<GetProfessionListRes> => {
        const res = await http.get(urlWithParams("/xtgl/comm_cxZydmList.html", {
            jg_id: schoolId,
        }));
        return res.data;
    },
    getClassList: async (schoolId: SchoolValue, professionId: string, grade: number): Promise<GetClassListRes> => {
        const res = await http.get(urlWithParams("/xtgl/comm_cxBjdmList.html", {
            jg_id: schoolId,
            zyh_id: professionId,
            njdm_id: grade,
        }));
        return res.data;
    },
    getCourseSchedule: (year: number, term: SchoolTermValue): Promise<CourseScheduleQueryRes> => {
        const yearIndex = SchoolYears.findIndex(v => +v[0] === year);
        return new Promise(async (resolve, reject) => {
            if (!(await jwxt.testToken())) {
                reject();
                return;
            }
            const reqBody = objectToFormUrlEncoded({
                xnm: SchoolYears[yearIndex ?? SchoolYears.findIndex(v => +v[0] === defaultYear)][0],
                xqm: term ?? SchoolTerms[0][0],
            });
            const res = await http.post("/kbcx/xskbcx_cxXsgrkb.html", reqBody);
            if (typeof res.data === "object") {
                resolve(res.data);
            } else {
                ToastAndroid.show("获取课表信息失败", ToastAndroid.SHORT);
                reject(res);
            }
        });
    },
    getExamInfo: (year: number, term: SchoolTermValue, page: number = 1): Promise<ExamInfoQueryRes> => {
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
                    sortName: "",
                    sortOrder: "asc",
                },
            });
            const res = await http.post("/kwgl/kscx_cxXsksxxIndex.html?doType=query", reqBody);
            if (typeof res.data === "object") {
                resolve(res.data);
            } else {
                ToastAndroid.show("获取考试信息失败", ToastAndroid.SHORT);
                reject(res);
            }
        });
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
                    sortName: "",
                    sortOrder: "asc",
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
};
