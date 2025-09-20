import axios from "axios";

export const httpBE = axios.create({
    baseURL: "http://acm.gxu.edu.cn/gxuicpc",
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
    },
});
