import {http, urlWithParams} from "@/js/http.ts";
import {getEncryptedPassword} from "@/js/rasPassword";
import CookieManager from "@react-native-cookies/cookies";
import {AxiosResponse} from "axios";
import {userMgr} from "@/js/mgr/user.ts";
import {SchoolTerms} from "@/type/global.ts";
import {ToastAndroid} from "react-native";
import {decodeHTMLEntities, DOMParser} from "@/js/domParser.ts";
import {store} from "@/js/store.ts";
import {UserInfo} from "@/type/infoQuery/base.ts";

export const jwxt = {
    getPublicKey: (): Promise<{modulus: string; exponent: string}> => {
        return new Promise(async resolve => {
            await CookieManager.clearAll();
            const res = await http.get(
                urlWithParams("/xtgl/login_getPublicKey.html", {
                    time: Date.now(),
                }),
            );
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

    refreshToken: async (): Promise<AxiosResponse | void> => {
        const {username, password} = await userMgr.getAccount();
        userMgr.storeAccount(username, password);
        const keys = await jwxt.getPublicKey();
        if (keys.exponent) {
            return await jwxt.login(username, password, keys.modulus, keys.exponent);
        }
    },

    testToken: async (autoRefresh = true): Promise<boolean> => {
        const res = await http.post("/kbcx/xskbcx_cxXsgrkb.html", {
            xnm: "2021",
            xqm: SchoolTerms[0][0],
        });
        if (typeof res.data === "object") {
            jwxt.getInfo();
            return true;
        } else {
            if (autoRefresh) {
                // 自动刷新逻辑
                await jwxt.refreshToken();
                if (await jwxt.testToken(false)) {
                    jwxt.getInfo();
                    return true;
                } else {
                    ToastAndroid.show("自动刷新Token失败，请检查账号设置", ToastAndroid.SHORT);
                    return false;
                }
            } else {
                return false;
            }
        }
    },

    getInfo: async (): Promise<UserInfo | undefined> => {
        const res = await http.post("/xtgl/index_cxYhxxIndex.html?xt=jw&localeKey=zh_CN");
        console.log(res);
        if (typeof res.data === "string") {
            const doc = new DOMParser().parseFromString(res.data.replace(/[\b\f\n\r\t]/g, ""));
            const infoEle = doc.querySelector("div.media-body");
            const nameAndCharacterText = decodeHTMLEntities(infoEle?.children[0].innerText);
            const schoolAndClassText = decodeHTMLEntities(infoEle?.children[1].innerText);
            const info = {
                name: nameAndCharacterText.split("  ")[0],
                character: nameAndCharacterText.split("  ")[1],
                school: schoolAndClassText.split(" ")[0],
                class: schoolAndClassText.split(" ")[1],
            };
            store.save({
                key: "userInfo",
                data: info,
            });
            return info;
        }
        return;
    },
};
