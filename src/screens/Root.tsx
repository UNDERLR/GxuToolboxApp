import {Appearance, StatusBar, View} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {RootStack} from "../route/RootStack.tsx";
import React from "react";
import {useTheme, useThemeMode} from "@rneui/themed";
import {NavigationDarkTheme, NavigationLightTheme} from "../js/theme.ts";

export function Root() {
    const {theme, updateTheme} = useTheme();
    const {mode, setMode} = useThemeMode();

    Appearance.addChangeListener(({colorScheme}) => {
        setMode(colorScheme === "dark" ? "dark" : "light");
    });

    const backgroundStyle = {
        flex: 1,
        backgroundColor: theme.colors.background,
    };
    return (
        <View style={backgroundStyle}>
            <StatusBar
                barStyle={mode === "light" ? "dark-content" : "light-content"}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <NavigationContainer theme={mode === "dark" ? NavigationDarkTheme : NavigationLightTheme}>
                <RootStack />
            </NavigationContainer>
        </View>
    );
}
