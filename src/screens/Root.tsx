import {ImageBackground, StatusBar, StyleSheet, useColorScheme, View} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {RootStack} from "../route/RootStack.tsx";
import React, {useEffect, useState} from "react";
import {useUserTheme} from "../js/theme.ts";
import {CheckUpdate} from "../components/CheckUpdate.tsx";

export function Root() {
    const {theme, navigationTheme, userTheme} = useUserTheme();
    const colorScheme = useColorScheme();
    // 添加背景图URI的状态
    const [bgUri, setBgUri] = useState(userTheme.bgUri);

    // 监听 userTheme 变化，更新背景图
    useEffect(() => {
        setBgUri(userTheme.bgUri);
    }, [userTheme.bgUri]);

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
            <ImageBackground
                style={style.bg}
                source={{uri: bgUri}}
                loadingIndicatorSource={{uri: bgUri}}
                resizeMode="cover">
                <StatusBar barStyle={colorScheme === "light" ? "dark-content" : "light-content"} />
                <CheckUpdate/>
                <NavigationContainer theme={navigationTheme[colorScheme ?? "light"]}>
                    <RootStack />
                </NavigationContainer>
            </ImageBackground>
        </View>
    );
}
