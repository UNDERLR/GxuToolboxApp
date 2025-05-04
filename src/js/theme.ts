import {createTheme, useTheme} from "@rneui/themed";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";
import {useState} from "react";
import {PressableAndroidRippleConfig, StyleSheet} from "react-native";
import {PickerProps} from "@react-native-picker/picker";

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

export const NavigationLightTheme = {
    ...DefaultTheme,
    dark: false,
    colors: {
        ...DefaultTheme.colors,
        ...theme.lightColors,
    },
};

export const NavigationDarkTheme = {
    ...DarkTheme,
    dark: true,
    colors: {
        ...DarkTheme.colors,
        ...theme.darkColors,
    },
};

export function useUserTheme() {
    const {theme} = useTheme();
    const DefaultUserTheme = {
        ripple: {
            color: theme.colors.grey4,
        } as PressableAndroidRippleConfig,
        components: {
            Picker: {
                style: {
                    color: theme.colors.black,
                },
                mode: "dropdown",
            } as PickerProps,
        },
    };
    const [userTheme, setUserTheme] = useState(DefaultUserTheme);
    return {userTheme, setUserTheme, theme};
}
