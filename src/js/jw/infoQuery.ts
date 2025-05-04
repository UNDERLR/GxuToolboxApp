import {http} from "../http.ts";
import {CourseScheduleQueryRes} from "../../type/api/classScheduleAPI.ts";
import {SchoolTerms, SchoolYears} from "../../type/global.ts";
import moment from "moment/moment";
import {ExamInfoQueryRes} from "../../type/api/examInfoAPI.ts";

export const defaultYear = moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year();

export const infoQuery = {
    getCourseSchedule: (year: number, term: string): Promise<CourseScheduleQueryRes> => {
        const yearIndex = SchoolYears.findIndex(v => +v[0] === year);
        return new Promise((resolve, reject) => {
            http.post("/kbcx/xskbcx_cxXsgrkb.html", {
                xnm: SchoolYears[yearIndex ?? SchoolYears.findIndex(v => +v[0] === defaultYear)][0],
                xqm: term ?? SchoolTerms[0][0],
            }).then(res => {
                if (res.status === 200) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            });
        });
    },
    getExamInfo: (year: number, term: string, page: number = 1): Promise<ExamInfoQueryRes> => {
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
                if (res.status === 200) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            });
        });
    },
    getExamScore: (year: number, term: string, page: number = 1): Promise<ExamInfoQueryRes> => {
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
                if (res.status === 200) {
                    resolve(res.data);
                } else {
                    reject(res);
                }
            });
        });
    },
};
