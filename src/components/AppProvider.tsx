import {createContext, ProviderProps, useEffect, useMemo, useState} from "react";
import {store} from "@/js/store.ts";
import {IUserConfig} from "@/type/IUserConfig.ts";
import {createTheme, useTheme} from "@rneui/themed";
import {DefaultUserTheme, generateUiTheme} from "@/js/theme.ts";
import {useColorScheme} from "react-native";
import {deepMerge} from "@/utils/objectUtils.ts";
import {cowsay} from "@/js/cowsay.ts";
import moment from "moment/moment";
import {SchoolTerms, SchoolYearValue} from "@/type/global.ts";

const defaultUserConfig: IUserConfig = {
    theme: DefaultUserTheme,
    jw: {
        year: ("" +
            (moment().isBefore(moment("8", "M"), "M") ? moment().year() - 1 : moment().year())) as SchoolYearValue,
        term: moment().isBetween(moment("02", "MM"), moment("07", "MM"), "month", "[]")
            ? SchoolTerms[1][0]
            : SchoolTerms[0][0],
        startDay: "2025-09-08",
    },
    preference: {
        courseDetail: {
            kcmc: {label: "课程名称", show: true},
            cdmc: {label: "地点", show: true},
            khfsmc: {label: "考核方式", show: true},
            xm: {label: "上课教师", show: true},
            xf: {label: "学分", show: true},
            bklxdjmc: {label: "", show: false},
            cd_id: {label: "", show: false},
            cdbh: {label: "", show: false},
            cdlbmc: {label: "", show: false},
            cxbj: {label: "", show: false},
            cxbjmc: {label: "", show: false},
            date: {label: "", show: false},
            dateDigit: {label: "", show: false},
            dateDigitSeparator: {label: "", show: false},
            day: {label: "", show: false},
            jc: {label: "", show: false},
            jcor: {label: "", show: false},
            jcs: {label: "", show: false},
            jgh_id: {label: "", show: false},
            jgpxzd: {label: "", show: false},
            jxb_id: {label: "", show: false},
            jxbmc: {label: "", show: false},
            jxbsftkbj: {label: "", show: false},
            jxbzc: {label: "", show: false},
            kcbj: {label: "", show: false},
            kch: {label: "", show: false},
            kch_id: {label: "", show: false},
            kclb: {label: "", show: false},
            kcxszc: {label: "", show: false},
            kcxz: {label: "", show: false},
            kczxs: {label: "", show: false},
            kkzt: {label: "", show: false},
            lh: {label: "", show: false},
            listnav: {label: "", show: false},
            localeKey: {label: "", show: false},
            month: {label: "", show: false},
            oldjc: {label: "", show: false},
            oldzc: {label: "", show: false},
            pageTotal: {label: "", show: false},
            pageable: {label: "", show: false},
            pkbj: {label: "", show: false},
            px: {label: "", show: false},
            qqqh: {label: "", show: false},
            rangeable: {label: "", show: false},
            rk: {label: "", show: false},
            rsdzjs: {label: "", show: false},
            sfjf: {label: "", show: false},
            skfsmc: {label: "", show: false},
            sxbj: {label: "", show: false},
            totalResult: {label: "", show: false},
            xkbz: {label: "", show: false},
            xnm: {label: "", show: false},
            xqdm: {label: "", show: false},
            xqh1: {label: "", show: false},
            xqh_id: {label: "", show: false},
            xqj: {label: "", show: false},
            xqjmc: {label: "", show: false},
            xqm: {label: "", show: false},
            xqmc: {label: "", show: false},
            xsdm: {label: "", show: false},
            xslxbj: {label: "", show: false},
            year: {label: "", show: false},
            zcd: {label: "", show: false},
            zcmc: {label: "", show: false},
            zfjmc: {label: "", show: false},
            zhxs: {label: "", show: false},
            zxs: {label: "", show: false},
            zxxx: {label: "", show: false},
            zyfxmc: {label: "", show: false},
            zyhxkcbj: {label: "", show: false},
            zzmm: {label: "", show: false},
            zzrl: {label: "", show: false},
        },
        examDetail: {
            kcmc: {label: "课程名称", show: true},
            kssj: {label: "考试时间", show: true},
            cdmc: {label: "地点", show: true},
            zwh: {label: "座位号", show: true},
            ksmc: {label: "考试名称", show: true},
            bj: {label: "", show: false},
            cdbh: {label: "", show: false},
            cdjc: {label: "", show: false},
            cdxqmc: {label: "", show: false},
            jgmc: {label: "", show: false},
            jsxx: {label: "", show: false},
            jxbmc: {label: "", show: false},
            jxbzc: {label: "", show: false},
            jxdd: {label: "", show: false},
            kch: {label: "", show: false},
            khfs: {label: "", show: false},
            kkxy: {label: "", show: false},
            njmc: {label: "", show: false},
            pycc: {label: "", show: false},
            row_id: {label: "", show: false},
            sjbh: {label: "", show: false},
            sksj: {label: "", show: false},
            totalresult: {label: "", show: false},
            xb: {label: "", show: false},
            xf: {label: "", show: false},
            xh: {label: "", show: false},
            xh_id: {label: "", show: false},
            xm: {label: "", show: false},
            xnm: {label: "", show: false},
            xnmc: {label: "", show: false},
            xqm: {label: "", show: false},
            xqmc: {label: "", show: false},
            xqmmc: {label: "", show: false},
            zymc: {label: "", show: false},
        },
    },
};

export const UserConfigContext = createContext<{
    userConfig: IUserConfig;
    updateUserConfig: (config: Partial<IUserConfig>) => void;
}>({
    userConfig: defaultUserConfig,
    updateUserConfig: config => {},
});

export function AppProvider(props: Omit<ProviderProps<IUserConfig>, "value">) {
    const [userContext, setUserContext] = useState(defaultUserConfig);
    const colorScheme = useColorScheme();
    const uiTheme = useTheme();
    const contextValue = useMemo<IUserConfig>(
        () => ({
            ...defaultUserConfig,
            ...userContext,
        }),
        [userContext],
    );

    async function init() {
        const data: IUserConfig = (await store.load({key: "userConfig"})) ?? defaultUserConfig;
        updateUserConfig(deepMerge(defaultUserConfig, data));
    }

    function updateUserConfig(config: Partial<IUserConfig>) {
        const newConfig = deepMerge(deepMerge(defaultUserConfig, userContext), config);
        setUserContext(newConfig);
        store.save({
            key: "userConfig",
            data: newConfig,
        });
        // 生成新的主题
        const newUiTheme = createTheme(generateUiTheme(newConfig, colorScheme));
        uiTheme.updateTheme(newUiTheme);
    }

    useEffect(() => {
        init();
    }, [colorScheme]);

    useEffect(() => {
        init();
        cowsay({
            text: "恭喜你，成功启动了开发服",
            f: "dragon",
        });
    }, []);

    return (
        <UserConfigContext.Provider
            value={{
                userConfig: contextValue,
                updateUserConfig,
            }}>
            {props.children}
        </UserConfigContext.Provider>
    );
}
