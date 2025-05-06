import {ImageBackground, StatusBar, StyleSheet, useColorScheme, View} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {RootStack} from "../route/RootStack.tsx";
import React from "react";
import {useUserTheme} from "../js/theme.ts";

export function Root() {
    const {theme, navigationTheme, userTheme} = useUserTheme();
    const colorScheme = useColorScheme();

    const style = StyleSheet.create({
        backgroundStyle: {
            flex: 1,
        },
        bg: {
            width: "100%",
            height: "100%",
            flex: 1,
        },
    });
    return (
        <View style={style.backgroundStyle}>
            <ImageBackground style={style.bg} source={{uri: userTheme.bgUri}}>
                <StatusBar barStyle={colorScheme === "light" ? "dark-content" : "light-content"} />
                <NavigationContainer theme={navigationTheme[colorScheme ?? "light"]}>
                    <RootStack />
                </NavigationContainer>
            </ImageBackground>
        </View>
    );
}
