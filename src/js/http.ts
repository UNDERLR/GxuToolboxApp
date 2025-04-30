import RNFetchBlob from "react-native-blob-util";
import CookieManager from "@react-native-cookies/cookies";

// 基础类型定义
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD";

export interface HttpRequestConfig {
    url?: string;
    method?: HttpMethod;
    baseURL?: string;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    data?: any;
    timeout?: number;
    trusty?: boolean; // 是否信任自签名证书
    withCredentials?: boolean; // 是否发送 cookies
}

export interface HttpResponse<T = any> {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: T;
    cookies?: string[];
    config: HttpRequestConfig;
}

export interface HttpError<T = any> extends Error {
    config: HttpRequestConfig;
    code?: string;
    response?: HttpResponse<T>;
    isHttpError: boolean;
}

export type RequestInterceptor = (config: HttpRequestConfig) => HttpRequestConfig | Promise<HttpRequestConfig>;
export type ResponseInterceptor<T = any> = (response: HttpResponse<T>) => HttpResponse<T> | Promise<HttpResponse<T>>;
export type ErrorInterceptor = (error: HttpError) => Promise<never>;

export class HttpClient {
    private defaults: HttpRequestConfig;
    private interceptors = {
        request: [] as RequestInterceptor[],
        response: [] as ResponseInterceptor[],
        error: [] as ErrorInterceptor[],
    };

    constructor(config: HttpRequestConfig = {}) {
        this.defaults = {
            baseURL: "",
            timeout: 30000,
            headers: {
                "Content-Type": "application/json",
            },
            trusty: false,
            withCredentials: true,
            ...config,
        };
    }

    public async request<T = any>(config: HttpRequestConfig): Promise<HttpResponse<T>> {
        // 合并配置
        const mergedConfig: HttpRequestConfig = {
            ...this.defaults,
            ...config,
            headers: {
                ...this.defaults.headers,
                ...config.headers,
            },
        };

        // 执行请求拦截器
        let finalConfig = await this.runRequestInterceptors(mergedConfig);

        // 处理 URL
        const fullUrl = this.buildFullUrl(finalConfig);

        try {
            // 处理 Cookie
            if (finalConfig.withCredentials) {
                await this.attachCookies(finalConfig, fullUrl);
            }

            // 发送请求
            const response = await this.sendRequest<T>(finalConfig, fullUrl);

            // 存储 Cookie
            if (finalConfig.withCredentials && response.cookies) {
                await this.storeCookies(fullUrl, response.cookies);
            }

            // 执行响应拦截器
            return this.runResponseInterceptors(response);
        } catch (error) {
            // 错误处理
            const httpError = this.normalizeError(error, finalConfig);

            // 执行错误拦截器
            return this.runErrorInterceptors(httpError);
        }
    }

    // 快捷方法
    public get<T = any>(url: string, config?: Omit<HttpRequestConfig, "url" | "method" | "data">) {
        return this.request<T>({...config, url, method: "GET"});
    }

    public post<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, "url" | "method" | "data">) {
        return this.request<T>({...config, url, method: "POST", data});
    }

    public put<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, "url" | "method" | "data">) {
        return this.request<T>({...config, url, method: "PUT", data});
    }

    public delete<T = any>(url: string, config?: Omit<HttpRequestConfig, "url" | "method" | "data">) {
        return this.request<T>({...config, url, method: "DELETE"});
    }

    public patch<T = any>(url: string, data?: any, config?: Omit<HttpRequestConfig, "url" | "method" | "data">) {
        return this.request<T>({...config, url, method: "PATCH", data});
    }

    // 拦截器管理
    public useRequestInterceptor(interceptor: RequestInterceptor) {
        this.interceptors.request.push(interceptor);
    }

    public useResponseInterceptor<T = any>(interceptor: ResponseInterceptor<T>) {
        this.interceptors.response.push(interceptor);
    }

    public useErrorInterceptor(interceptor: ErrorInterceptor) {
        this.interceptors.error.push(interceptor);
    }

    // 私有方法
    private buildFullUrl(config: HttpRequestConfig): string {
        if (config.baseURL && config.url) {
            return `${config.baseURL.replace(/\/+$/, "")}/${config.url.replace(/^\/+/, "")}`;
        }
        return config.url || config.baseURL || "";
    }

    private async attachCookies(config: HttpRequestConfig, url: string) {
        try {
            const cookies = await CookieManager.get(url);
            const cookieString = Object.values(cookies)
                .filter(cookie => cookie.name && cookie.value)
                .map(cookie => `${cookie.name}=${cookie.value}`)
                .join("; ");

            if (cookieString) {
                config.headers = {
                    ...config.headers,
                    Cookie: cookieString,
                };
            }
        } catch (error) {
            console.warn("Failed to attach cookies:", error);
        }
    }

    private async storeCookies(url: string, cookieHeaders: string[]) {
        try {
            for (const cookieHeader of cookieHeaders) {
                const [nameValue, ...options] = cookieHeader.split(";").map(s => s.trim());
                const [name, value] = nameValue.split("=");

                if (name && value) {
                    const cookie: any = {
                        name,
                        value,
                        domain: new URL(url).hostname,
                        path: "/",
                    };

                    // 处理 cookie 选项
                    options.forEach(option => {
                        const [key, val] = option.split("=").map(s => s.trim());
                        const lowerKey = key.toLowerCase();
                        if (lowerKey === "expires" && val) {
                            cookie.expires = new Date(val);
                        } else if (lowerKey === "max-age" && val) {
                            cookie.expires = new Date(Date.now() + parseInt(val, 10) * 1000);
                        } else if (lowerKey === "secure") {
                            cookie.secure = true;
                        } else if (lowerKey === "httponly") {
                            cookie.httpOnly = true;
                        }
                    });

                    await CookieManager.set(url, cookie);
                }
            }
        } catch (error) {
            console.warn("Failed to store cookies:", error);
        }
    }

    private async sendRequest<T>(config: HttpRequestConfig, url: string): Promise<HttpResponse<T>> {
        const rnFetchBlobConfig = {
            trusty: config.trusty,
            timeout: config.timeout,
        };

        const response = await RNFetchBlob.config(rnFetchBlobConfig).fetch(
            // @ts-ignore
            config.method || "GET",
            url,
            config.headers,
            config.data ? JSON.stringify(config.data) : null,
        );

        const respInfo = response.info();
        const data = await this.parseResponseData<T>(response);

        return {
            status: respInfo.status,
            statusText: respInfo.state || "",
            headers: respInfo.headers,
            data,
            cookies: respInfo.headers["Set-Cookie"] || respInfo.headers["set-cookie"],
            config,
        };
    }

    private async parseResponseData<T>(response: any): Promise<T> {
        const contentType = response.info().headers["Content-Type"] || "";

        if (contentType.includes("application/json")) {
            try {
                return await response.json();
            } catch {
                return response.text() as any;
            }
        }

        if (contentType.startsWith("text/")) {
            return response.text() as any;
        }

        return response.base64() as any;
    }

    private normalizeError(error: any, config: HttpRequestConfig): HttpError {
        if (this.isHttpError(error)) {
            return error;
        }

        const httpError: HttpError = {
            name: "HttpError",
            message: error.message || "Unknown error occurred",
            config,
            code: error.code || "UNKNOWN_ERROR",
            isHttpError: true,
        };

        if (error.response) {
            httpError.response = {
                status: error.response.info().status,
                statusText: error.response.info().state || "",
                headers: error.response.info().headers,
                data: error.response.data,
                config,
            };
        }

        return httpError;
    }

    private isHttpError(error: any): error is HttpError {
        return error && error.isHttpError === true;
    }

    private async runRequestInterceptors(config: HttpRequestConfig): Promise<HttpRequestConfig> {
        let currentConfig = config;
        for (const interceptor of this.interceptors.request) {
            currentConfig = await interceptor(currentConfig);
        }
        return currentConfig;
    }

    private async runResponseInterceptors<T>(response: HttpResponse<T>): Promise<HttpResponse<T>> {
        let currentResponse = response;
        for (const interceptor of this.interceptors.response) {
            currentResponse = await interceptor(currentResponse);
        }
        return currentResponse;
    }

    private async runErrorInterceptors(error: HttpError): Promise<never> {
        let currentError = error;
        for (const interceptor of this.interceptors.error) {
            try {
                return await interceptor(currentError);
            } catch (e) {
                // @ts-ignore
                currentError = e;
            }
        }
        throw currentError;
    }
}

// 默认导出实例
export const http = new HttpClient({
    baseURL: "https://jwxt2018.gxu.edu.cn/jwglxt",
    headers: {
        "Content-Type": "application/x-www-form-urlencoded",
    },
});

export function urlWithParams(url: string, params: Record<string, any> = {}) {
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
