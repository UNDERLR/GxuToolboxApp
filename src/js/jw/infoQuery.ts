import {http} from "../http.ts";
import {CourseScheduleQueryRes} from "../../type/api/classScheduleAPI.ts";
import {SchoolTerms, SchoolYears} from "../../type/global.ts";
import moment from "moment/moment";

export const infoQuery = {
    getCourseSchedule: (year: number, term: 1 | 2 | 3): Promise<CourseScheduleQueryRes> => {
        const defaultYear = moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year();
        const yearIndex = SchoolYears.findIndex(v => +v[0] === year);
        return new Promise((resolve, reject) => {
            http.post("/kbcx/xskbcx_cxXsgrkb.html", {
                xnm: SchoolYears[yearIndex ?? SchoolYears.findIndex(v => +v[0] === defaultYear)][0],
                xqm: SchoolTerms[term - 1][0] ?? SchoolTerms[0][0],
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
