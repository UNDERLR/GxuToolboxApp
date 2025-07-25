import {createContext, ProviderProps, useEffect, useMemo, useState} from "react";
import {store} from "@/js/store.ts";
import {IUserConfig} from "@/type/IUserConfig.ts";

const defaultUserConfig: IUserConfig = {};
export const UserConfigContext = createContext<IUserConfig>(defaultUserConfig);

export function AppProvider(props: Omit<ProviderProps<IUserConfig>, "value">) {
    const [userContext, setUserContext] = useState(defaultUserConfig);
    const contextValue = useMemo<IUserConfig>(
        () => ({
            ...userContext,
            ...defaultUserConfig,
        }),
        [userContext],
    );

    async function init() {
        const data = (await store.load({key: "userConfig"})) ?? defaultUserConfig;
        setUserContext({
            ...data,
            ...defaultUserConfig,
        });
    }

    useEffect(() => {
        init();
    }, []);

    return <UserConfigContext.Provider value={contextValue}>{props.children}</UserConfigContext.Provider>;
}
