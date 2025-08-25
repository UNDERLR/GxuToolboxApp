import {BuildingList, IPos} from "@/type/pos.ts";
import {Linking} from "react-native";
import {urlWithParams} from "@/js/http.ts";

const sourceApplication = "gxujwt";

export const Pos = {
    /**
     * 解析字符串为地点
     * @param str 目标字符串
     */
    parseStr: (str: string): IPos | null => {
        let res: IPos | null = null;
        for (const pos of BuildingList) {
            if (
                (typeof pos.test === "function" && pos.test(str)) ||
                (pos.test instanceof RegExp && "test" in pos.test && pos.test.test(str))
            ) {
                res = pos;
                break;
            }
        }
        return res;
    },
    /**
     * 在地图中打开搜索的地点
     * @param pos 目标地点
     */
    searchInMap: async (pos: IPos | string) => {
        const keyword = typeof pos === "string" ? pos : pos.fullName;
        const url = urlWithParams("androidamap://poi", {sourceApplication: sourceApplication, keywords: keyword});
        return Linking.canOpenURL(url).then(() => {
            Linking.openURL(url);
        });
    },
};
