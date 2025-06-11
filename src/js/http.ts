import axios from "axios";
import {userMgr} from "./mgr/user.ts";
import {ToastAndroid} from "react-native";
import Clipboard from "@react-native-clipboard/clipboard";

// 默认导出实例
export const http = axios.create({
    baseURL: "https://jwxt2018.gxu.edu.cn/jwglxt",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    withCredentials: true,
});

http.interceptors.request.use(config => {
    userMgr
        .getAccount()
        .then(data => {
            if (!data.username || !data.password) {
                ToastAndroid.show("未正确设置账号，请前往设置设置账号", ToastAndroid.SHORT);
            }
        })
        .catch(() => {
            ToastAndroid.show("未正确设置账号，请前往设置设置账号", ToastAndroid.SHORT);
        });
    return config;
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
        if (obj[key] === undefined) {
            break;
        }
        if (typeof obj[key] === "object") {
            res += objectToFormUrlEncoded(obj[key], prefix + key + ".");
        } else res += prefix + key + "=" + encodeURIComponent(obj[key]) + "&";
    }
    if (!prefix) res = res.slice(0, -1);
    return res;
}
