import {createTheme, useTheme} from "@rneui/themed";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useCallback, useEffect, useState} from "react";
import {PressableAndroidRippleConfig, useColorScheme} from "react-native";
import {PickerProps} from "@react-native-picker/picker";
import {store} from "./store.ts";

export const theme = createTheme({
    components: {
        Divider: {
            style: {
                marginVertical: 10,
            },
        },
        Slider: {
            style: {
                flex: 1,
            },
            thumbStyle: {
                height: 20,
                width: 20,
                backgroundColor: "gray",
            },
        },
        Text: {
            style: {
                fontSize: 12,
            },
        },
    },
});

export function useUserTheme() {
    const uiTheme = useTheme();
    const colorScheme = useColorScheme();

    // 添加对 colorScheme 的监听
    useEffect(() => {
        store.load({key: "userTheme"}).then(savedTheme => {
            if (savedTheme) {
                const newUiTheme = createTheme({
                    ...theme,
                    ...savedTheme.uiTheme,
                    mode: colorScheme,
                    lightColors: {
                        ...theme.lightColors,
                        primary: savedTheme.colors.primary,
                    },
                    darkColors: {
                        ...theme.darkColors,
                        primary: savedTheme.colors.primary,
                    },
                });
                update({
                    ...savedTheme,
                    uiTheme: newUiTheme,
                    components: {
                        ...savedTheme.components,
                        Picker: {
                            ...savedTheme.components.Picker,
                            style: {
                                color:
                                    colorScheme === "light"
                                        ? "black"
                                        : "white",
                            },
                        },
                    },
                });
            }
        });
    }, [colorScheme]);

    const DefaultUserTheme = {
        ripple: {
            color: uiTheme.theme.colors.grey4,
        } as PressableAndroidRippleConfig,
        components: {
            Picker: {
                style: {
                    color: uiTheme.theme.colors.black,
                },
                mode: "dropdown",
            } as PickerProps,

            Slider: {
                trackStyle: {
                    marginTop: undefined,
                },
            },
        },
        uiTheme: theme,
        colors: {
            primary: uiTheme.theme.colors.primary,
        },
        bgUri: "",
        bgOpacity: 100,
    };
    const DefaultNavigationTheme = {
        light: {
            ...DefaultTheme,
            dark: false,
            colors: {
                ...DefaultTheme.colors,
                ...theme.lightColors,
                background: "transparent",
            },
        },
        dark: {
            ...DarkTheme,
            dark: true,
            colors: {
                ...DarkTheme.colors,
                ...theme.darkColors,
                background: "transparent",
            },
        },
    };

    const [navigationTheme, setNavigationTheme] = useState(DefaultNavigationTheme);
    const [userTheme, setUserTheme] = useState(DefaultUserTheme);
    const update = useCallback(
        (newUserTheme: typeof DefaultUserTheme) => {
            const newUiTheme = createTheme({
                ...theme,
                ...newUserTheme.uiTheme,
                mode: colorScheme,
                lightColors: {
                    primary: newUserTheme.colors.primary,
                },
                darkColors: {
                    primary: newUserTheme.colors.primary,
                },
            });

            // 批量更新状态
            Promise.resolve().then(() => {
                setUserTheme(newUserTheme);
                setNavigationTheme(old => ({
                    light: {
                        ...old.light,
                        colors: {
                            ...old.light.colors,
                            ...newUiTheme.lightColors,
                        },
                    },
                    dark: {
                        ...old.dark,
                        colors: {
                            ...old.dark.colors,
                            ...newUiTheme.darkColors,
                        },
                    },
                }));
            });
        },
        [colorScheme, uiTheme, userTheme],
    );

    const updateUserTheme = (newUserTheme: typeof DefaultUserTheme) => {
        // 先更新UI
        update(newUserTheme);
        // 后台保存
        store.save({key: "userTheme", data: newUserTheme}).catch(error => {
            console.error("保存主题失败:", error);
        });
    };

    useEffect(() => {
        store.load({key: "userTheme"}).then(userTheme => {
            update({...DefaultUserTheme, uiTheme: {...theme}, ...userTheme});
        });
    }, []);
    return {userTheme, updateUserTheme, ...uiTheme, navigationTheme, setNavigationTheme};
}
