import {StatusBar, useColorScheme, View} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {RootStack} from "../route/RootStack.tsx";
import React from "react";
import {useUserTheme} from "../js/theme.ts";

export function Root() {
    const {theme, navigationTheme} = useUserTheme();
    const colorScheme = useColorScheme();

    const backgroundStyle = {
        flex: 1,
        backgroundColor: theme.colors.background,
    };
    return (
        <View style={backgroundStyle}>
            <StatusBar
                barStyle={colorScheme === "light" ? "dark-content" : "light-content"}
                backgroundColor={backgroundStyle.backgroundColor}
            />
            <NavigationContainer theme={navigationTheme[colorScheme ?? "light"]}>
                <RootStack />
            </NavigationContainer>
        </View>
    );
}
