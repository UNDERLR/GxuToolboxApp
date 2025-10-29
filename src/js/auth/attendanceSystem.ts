import {http, urlWithParams} from "@/js/http.ts";
import {userMgr} from "@/js/mgr/user.ts";
import {AttendanceSystemType} from "@/type/api/auth/attendanceSystem.ts";
import AST = AttendanceSystemType;

/**
 * 考勤系统相关的API接口封装
 */
export const attendanceSystemApi = {
    /**
     * 获取菜单数据，带有学期数据
     * @returns 返回首页数据
     */
    getIndexData: async (): Promise<AST.ResRoot<AST.IndexData> | undefined> => {
        const queryParams = {
            rm: "SYS004", // 写死的
        };
        // 获取登录凭证，若无有效token则直接返回
        const loginRes = await userMgr.attendanceSystem.getLoginRes();
        if (!loginRes || !loginRes.data.token) return;
        // 发起GET请求获取个人考勤数据
        const res = await http.get<AST.ResRoot<AST.IndexData>>(
            urlWithParams("https://yktuipweb.gxu.edu.cn/api/account/getIndexData", queryParams),
            {
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: "Token " + loginRes.data.token,
                },
            },
        );
        return res.data;
    },

    /**
     * 获取个人考勤数据列表（分页）
     * @param termId 学期ID，默认为18
     * @param data 查询参数对象，可选
     * @returns 返回分页查询结果，包含数据列表和分页信息；如果未登录则返回undefined
     */
    getPersonalData: async (
        termId = 18,
        data?: AST.PageQueryParam,
    ): Promise<AST.PageRes<AST.AttendanceData[]> | undefined> => {
        // 合并默认参数与传入参数
        const defaultData = {
            page_index: 1,
            page_size: 30,
            order_by: "",
            search: {
                ksrq: "",
                jsrq: "",
                courseId: "",
            },
            ...data,
        };

        // 获取登录凭证，若无有效token则直接返回
        const loginRes = await userMgr.attendanceSystem.getLoginRes();
        if (!loginRes || !loginRes.data.token) return;

        // 发起POST请求获取个人考勤数据
        const res = await http.post<AST.PageRes<AST.AttendanceData[]>>(
            urlWithParams("https://yktuipweb.gxu.edu.cn/api/personalData/getPersonalData", {
                cal: termId,
                rm: "SYS004",
            }),
            defaultData,
            {
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: "Token " + loginRes.data.token,
                },
            },
        );
        return res.data;
    },

    /**
     * 获取个人考勤统计数据
     * @param termId 学期ID，默认为18
     * @param data 查询参数对象，可选
     * @returns 返回考勤统计结果数组，正常情况应该只有一个元素；如果未登录则返回undefined
     */
    getPersonalDataCount: async (
        termId = 18,
        data?: AST.SearchParam,
    ): Promise<AST.ResRoot<AST.AttendanceDataStatistic[]> | undefined> => {
        // 合并默认参数与传入参数
        const defaultData = {
            ksrq: "",
            jsrq: "",
            courseId: "",
            ...data,
        };

        // 获取登录凭证，若无有效token则直接返回
        const loginRes = await userMgr.attendanceSystem.getLoginRes();
        if (!loginRes || !loginRes.data.token) return;

        // 发起POST请求获取个人考勤统计数据
        const res = await http.post<AST.ResRoot<any>>(
            urlWithParams("https://yktuipweb.gxu.edu.cn/api/personalData/getPersonalDataCount", {
                cal: termId,
                rm: "SYS004",
            }),
            defaultData,
            {
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    Authorization: "Token " + loginRes.data.token,
                },
            },
        );
        console.log(res);
        return res.data;
    },
};
