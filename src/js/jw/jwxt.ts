import {http, urlWithParams} from "@/js/http.ts";
import {getEncryptedPassword} from "@/js/rasPassword";
import CookieManager from "@react-native-cookies/cookies";
import {AxiosResponse} from "axios";
import {userMgr} from "@/js/mgr/user.ts";
import {SchoolTerms} from "@/type/global.ts";
import {ToastAndroid} from "react-native";

export const jwxt = {
    getPublicKey: (): Promise<{modulus: string; exponent: string}> => {
        return new Promise(async resolve => {
            await CookieManager.clearAll();
            const res = await http.get(
                urlWithParams("/xtgl/login_getPublicKey.html", {
                    time: Date.now(),
                }),
            );
            console.log(res);
            resolve(res.data);
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

    refreshToken: () => {
        return new Promise(resolve => {
            userMgr.getAccount().then(({username, password}) => {
                userMgr.storeAccount(username, password);
                jwxt.getPublicKey().then(data => {
                    if (data.exponent) {
                        jwxt.login(username, password, data.modulus, data.exponent).then(res => resolve(res));
                    }
                });
            });
        });
    },

    testToken: (autoRefresh = true) => {
        return new Promise(async resolve => {
            const res = await http.post("/kbcx/xskbcx_cxXsgrkb.html", {
                xnm: "2021",
                xqm: SchoolTerms[0][0],
            });
            if (typeof res.data === "object") {
                resolve(true);
            } else {
                if (autoRefresh) {
                    // 自动刷新逻辑
                    await jwxt.refreshToken();
                    if (await jwxt.testToken(false)) {
                        resolve(true);
                    } else {
                        ToastAndroid.show("自动刷新Token失败，请检查账号设置", ToastAndroid.SHORT);
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            }
        });
    },
};
