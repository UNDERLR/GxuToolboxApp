import axios from "axios";

// 默认导出实例
export const http = axios.create({
    baseURL: "https://jwxt2018.gxu.edu.cn/jwglxt",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    },
    withCredentials: true,
});

http.interceptors.request.use(config => {
    if (config.headers.getContentType(/urlencoded/).length > 0) {
        config.data = objectToFormUrlEncoded(config.data);
    }
    return config;
});

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
