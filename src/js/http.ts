import axios from "axios";
import {userMgr} from "./mgr/user.ts";
import {ToastAndroid} from "react-native";
import {jwxt} from "./jw/jwxt.ts";

// 默认导出实例
export const http = axios.create({
    baseURL: "https://jwxt2018.gxu.edu.cn/jwglxt",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    maxRedirects: 0,
    withCredentials: true,
});

http.interceptors.request.use(config => {
    return new Promise((resolve, reject) => {
        userMgr
            .getAccount()
            .then(data => {
                if (!data.username || !data.password) {
                    ToastAndroid.show("未正确设置账号，请前往设置设置账号", ToastAndroid.SHORT);
                    reject(config);
                }
                if (config.headers.getContentType(/urlencoded/).length > 0) {
                    config.data = objectToFormUrlEncoded(config.data);
                }
                if (!config.url.includes("/xtgl/login") && config.baseURL === "https://jwxt2018.gxu.edu.cn/jwglxt") {
                    jwxt.getToken(data.username, data.password, false).then(() => {
                        resolve(config);
                    });
                } else {
                    resolve(config);
                }
            })
            .catch(() => {
                ToastAndroid.show("未正确设置账号，请前往设置设置账号", ToastAndroid.SHORT);
                reject(config);
            });
    });
});

http.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    },
);

export function urlWithParams(url: string, params: Record<string, any> = {}): string {
    Object.keys(params).forEach(key => {
        if (params[key] === undefined) {
            delete params[key];
        }
    });
    return (
        url +
        "?" +
        Object.keys(params)
            .map(key => key + "=" + encodeURIComponent(params[key]))
            .join("&")
    );
}

export function objectToFormUrlEncoded(obj: any, prefix = ""): string {
    let res = "";
    for (const key in obj) {
        if (typeof obj[key] === "object") {
            res += objectToFormUrlEncoded(obj[key], prefix + key + ".");
        } else res += prefix + key + "=" + encodeURIComponent(obj[key]) + "&";
    }
    if (!prefix) res = res.slice(0, -1);
    return res;
}
