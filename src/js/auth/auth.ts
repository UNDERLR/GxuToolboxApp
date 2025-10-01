import {http, urlWithParams} from "@/js/http.ts";
import RSAUtils from "@/js/authRSA.ts";
import cheerio from "react-native-cheerio";
import {userMgr} from "@/js/mgr/user.ts";

export const authApi = {
    /**
     * 获取统一认证登录rsa需要的公钥
     */
    getPubKey: async (): Promise<{
        exponent: string;
        modulus: string;
    }> => {
        const res = await http.get("https://ca.gxu.edu.cn:8443/zfca/v2/getPubKey");
        return res.data;
    },

    /**
     * 登录统一认证系统
     * @param username
     * @param password
     * @param pubKey 公钥对应的`modulus`
     * @param pubKeyLength 公钥对应的`exponent`
     * @param service 登录到对应的服务
     */
    login: async (
        username: string,
        password: string,
        pubKey: string,
        pubKeyLength: string,
        service: string = "",
    ): Promise<boolean> => {
        const key = RSAUtils.getKeyPair(pubKeyLength, "", pubKey);
        const reversedPwd = password.split("").reverse().join("");
        const encryptedPwd = RSAUtils.encryptedString(key, reversedPwd);

        const html = await http.get("https://ca.gxu.edu.cn:8443/zfca/login");
        const $ = cheerio.load(html.data);
        const execution = $('#fm1 > input[name="execution"]').attr("value");

        const res = await http.post(
            urlWithParams("https://ca.gxu.edu.cn:8443/zfca/login", {
                service,
            }),
            {
                username,
                password: encryptedPwd,
                execution,
                _eventId: "submit",
            },
        );
        return /统一身份认证-主页/.test(res.data);
    },

    /**
     * 使用存储中的账号登入服务，用于获取不同服务的cookie
     * @param serviceUrl 对应服务的url
     */
    loginService: async (serviceUrl: string) => {
        const rsa = await authApi.getPubKey();
        const account = await userMgr.getAuthAccount();
        if (!account?.password || !account?.username) return;
        await authApi.login(account.username, account.password, rsa.modulus, rsa.exponent, serviceUrl);
    },
};
