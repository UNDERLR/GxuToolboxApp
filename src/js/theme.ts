import {createTheme, CreateThemeOptions} from "@rneui/themed";
import {IUserConfig, IUserTheme} from "@/type/IUserConfig.ts";
import {deepMerge} from "@/utils/objectUtils.ts";
import {ColorSchemeName} from "react-native";

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

export const DefaultUserTheme: IUserTheme = {
    bgUrl: "",
    bgOpacity: 100,
    ripple: {
        color: "gray",
    },
    course: {
        timeSpanHeight: 80,
        weekdayHeight: 60,
        courseItemMargin: 2,
        courseItemBorderWidth: 0,
    },
    primaryColor: "#48A6EF",
};

export function generateUiTheme(config: IUserConfig, colorScheme: ColorSchemeName): CreateThemeOptions {
    return deepMerge<CreateThemeOptions, CreateThemeOptions>(theme, {
        mode: colorScheme ?? "light",
        lightColors: {
            primary: config.theme?.primaryColor ?? "#48A6EF",
        },
        darkColors: {
            primary: config.theme?.primaryColor ?? "#48A6EF",
        },
    });
}
