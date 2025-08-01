import {createContext, ProviderProps, useEffect, useMemo, useState} from "react";
import {store} from "@/js/store.ts";
import {IUserConfig} from "@/type/IUserConfig.ts";
import {createTheme, useTheme} from "@rneui/themed";
import {DefaultUserTheme, generateUiTheme} from "@/js/theme.ts";
import {useColorScheme} from "react-native";
import {deepMerge} from "@/utils/objectUtils.ts";
import {cowsay} from "@/js/cowsay.ts";

const defaultUserConfig: IUserConfig = {
    theme: DefaultUserTheme,
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
        const data = (await store.load({key: "userConfig"})) ?? defaultUserConfig;
        updateUserConfig(deepMerge(defaultUserConfig, data));
    }

    function updateUserConfig(config: Partial<IUserConfig>) {
        const newConfig = deepMerge(deepMerge(defaultUserConfig, userContext), config);
        setUserContext(newConfig);
        store.save({
            key: "userConfig",
            data: newConfig,
        });
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
