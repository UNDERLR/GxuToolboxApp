import {http, urlWithParams} from "./http.ts";
import {getEncryptedPassword} from "./rasPassword";
import {Cookies} from "@react-native-cookies/cookies";

export const jwxt = {
    getPublicKey: (): Promise<{modulus: string; exponent: string}> => {
        return new Promise(resolve => {
            http.get(
                urlWithParams("/jwglxt/xtgl/login_getPublicKey.html", {
                    time: Date.now(),
                }),
            ).then(res => {
                resolve(res.data);
            });
        });
    },

    getToken: async (username: string, password: string, public_key: string, public_length: string): Promise<string> => {
        return new Promise(resolve => {
            http.post(
                urlWithParams("/jwglxt/xtgl/login_slogin.html", {
                    time: Date.now(),
                }),
                {
                    language: "zh_CN",
                    yhm: username,
                    mm: getEncryptedPassword(password, public_key, public_length),
                    yzm: "",
                },
                {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                },
            ).then(data => {
                resolve(data.config.headers.Cookie);
            });
        });
    },
};
