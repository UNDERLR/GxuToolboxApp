import {http} from "@/js/http.ts";
import RSAUtils from "@/js/authRSA.ts";
import cheerio from "react-native-cheerio";

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
     */
    login: async (username: string, password: string, pubKey: string, pubKeyLength: string): Promise<boolean> => {
        const key = RSAUtils.getKeyPair(pubKeyLength, "", pubKey);
        const reversedPwd = password.split("").reverse().join("");
        const encryptedPwd = RSAUtils.encryptedString(key, reversedPwd);

        const html = await http.get("https://ca.gxu.edu.cn:8443/zfca/login");
        const $ = cheerio.load(html.data);
        const execution = $('#fm1 > input[name="execution"]').attr("value");

        const res = await http.post("https://ca.gxu.edu.cn:8443/zfca/login", {
            username,
            password: encryptedPwd,
            execution,
            _eventId: "submit",
        });
        return /统一身份认证-主页/.test(res.data);
    },
};
