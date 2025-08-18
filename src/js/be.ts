import axios from "axios";

export const httpBE = axios.create({
    baseURL: "http://192.168.1.7:5090",
    headers: {
        "Content-Type": "application/json; charset=UTF-8",
    },
});
