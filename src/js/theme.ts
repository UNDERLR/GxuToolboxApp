import {createTheme, useTheme} from "@rneui/themed";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useEffect, useState} from "react";
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
            trackStyle: {
                height: 5,
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
        },
        uiTheme: theme,
        colors: {
            primary: uiTheme.theme.colors.primary,
        },
    };
    const DefaultNavigationTheme = {
        light: {
            ...DefaultTheme,
            dark: false,
            colors: {
                ...DefaultTheme.colors,
                ...theme.lightColors,
            },
        },
        dark: {
            ...DarkTheme,
            dark: true,
            colors: {
                ...DarkTheme.colors,
                ...theme.darkColors,
            },
        },
    };

    const [navigationTheme, setNavigationTheme] = useState(DefaultNavigationTheme);
    const [userTheme, setUserTheme] = useState(DefaultUserTheme);

    function update(newUserTheme: typeof DefaultUserTheme) {
        const newUiTheme = createTheme({
            ...theme,
            ...newUserTheme.uiTheme,
            lightColors: {
                primary: newUserTheme.colors.primary,
            },
            darkColors: {
                primary: newUserTheme.colors.primary,
            },
        });
        uiTheme.replaceTheme(newUiTheme);
        setUserTheme(newUserTheme);
        setNavigationTheme((old)=> {
            return {
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
            };
        });
    }

    const updateUserTheme = (newUserTheme: typeof DefaultUserTheme) => {
        store.save({key: "userTheme", data: newUserTheme});
        update(newUserTheme);
    };

    useEffect(() => {
        store.load({key: "userTheme"}).then(userTheme => {
            update(userTheme);
        });
    }, [colorScheme]);
    return {userTheme, updateUserTheme, ...uiTheme, navigationTheme, setNavigationTheme};
}
