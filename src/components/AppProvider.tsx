import {createContext, ProviderProps, useEffect, useMemo, useState} from "react";
import {store} from "@/js/store.ts";
import {IUserConfig} from "@/type/IUserConfig.ts";

const defaultUserConfig: IUserConfig = {
    theme: {
        bgUrl: "",
        course: {
            timeSpanHeight: 80,
            weekdayHeight: 60,
            courseItemMargin: 2,
            courseItemBorderWidth: 0,
        },
        primaryColor: "#459EE2",
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
    const contextValue = useMemo<IUserConfig>(
        () => ({
            ...defaultUserConfig,
            ...userContext,
        }),
        [userContext],
    );

    async function init() {
        const data = (await store.load({key: "userConfig"})) ?? defaultUserConfig;
        setUserContext({
            ...defaultUserConfig,
            ...data,
        });
    }

    function updateUserConfig(config: Partial<IUserConfig>) {
        setUserContext({
            ...defaultUserConfig,
            ...userContext,
            ...config,
        });
    }

    useEffect(() => {
        init();
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
