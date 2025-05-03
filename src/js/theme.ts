import {createTheme} from "@rneui/themed";
import {DarkTheme, DefaultTheme} from "@react-navigation/native";

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
