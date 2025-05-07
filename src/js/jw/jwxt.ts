import {http, urlWithParams} from "../http.ts";
import {getEncryptedPassword} from "../rasPassword";
import CookieManager from "@react-native-cookies/cookies";
import {AxiosResponse} from "axios";
import {userMgr} from "../mgr/user.ts";
import {ToastAndroid} from "react-native";

export const jwxt = {
    getPublicKey: (): Promise<{modulus: string; exponent: string}> => {
        CookieManager.clearAll();
        return new Promise(resolve => {
            http.get(
                urlWithParams("/xtgl/login_getPublicKey.html", {
                    time: Date.now(),
                }),
            ).then(res => {
                console.log(res);
                resolve(res.data);
            });
        });
    },

    login: async (
        username: string,
        password: string,
        public_key: string,
        public_length: string,
    ): Promise<AxiosResponse> => {
        return new Promise(resolve => {
            http.post(
                urlWithParams("/xtgl/login_slogin.html", {
                    time: Date.now(),
                }),
                {
                    language: "zh_CN",
                    yhm: username,
                    mm: getEncryptedPassword(password, public_key, public_length),
                    yzm: "",
                },
            ).then(res => {
                resolve(res);
            });
        });
    },

    getToken(username: string, password: string, hasAlerter = true) {
        return new Promise(resolve => {
            userMgr.storeAccount(username, password);
            jwxt.getPublicKey().then(data => {
                if (data.exponent) {
                    jwxt.login(username, password, data.modulus, data.exponent).then(res => {
                        resolve(res);
                        if (!hasAlerter) {
                            return;
                        }
                        if (res.status === 200) {
                            ToastAndroid.show("获取成功", ToastAndroid.SHORT);
                        } else {
                            ToastAndroid.show(`获取失败，错误码：${res.status}`, ToastAndroid.SHORT);
                        }
                    });
                }
            });
        });
    },
};
