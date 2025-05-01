import {http} from "../http.ts";
import {CourseScheduleQueryRes} from "../../type/api/classScheduleAPI.ts";

export const infoQuery = {
    getCourseSchedule: (): Promise<CourseScheduleQueryRes> => {
        return new Promise((resolve, reject) => {
            http.post("/kbcx/xskbcx_cxXsgrkb.html", {
                xnm: 2024,
                xqm: 12,
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
