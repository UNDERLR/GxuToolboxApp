import {ImageBackground, StatusBar, StyleSheet, useColorScheme, View, ViewProps} from "react-native";
import {DarkTheme, DefaultTheme, NavigationContainer} from "@react-navigation/native";
import {RootStack} from "@/route/RootStack.tsx";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {UpdateCard} from "@/components/UpdateCard.tsx";
import {CourseScheduleContext, generateCourseScheduleStyle, useCourseScheduleData} from "@/js/jw/course.ts";
import {UserConfigContext} from "@/components/AppProvider.tsx";
import {useTheme} from "@rneui/themed";

export function Root(props: ViewProps) {
    const {userConfig} = useContext(UserConfigContext);
    const {theme} = useTheme();
    const colorScheme = useColorScheme();
    const {courseScheduleData, updateCourseScheduleData} = useCourseScheduleData();
    const memoizedUpdateFunction = useCallback(updateCourseScheduleData, []);
    const memoizedStyle = useMemo(
        () => generateCourseScheduleStyle(userConfig.theme.course, theme),
        [courseScheduleData, theme, userConfig],
    );

    // 使用 useMemo 包装 Context value 以避免不必要的重渲染
    const contextValue = useMemo(
        () => ({
            courseScheduleData,
            courseScheduleStyle: memoizedStyle,
            updateCourseScheduleData: memoizedUpdateFunction,
        }),
        [courseScheduleData, memoizedStyle, memoizedUpdateFunction],
    );

    const style = StyleSheet.create({
        backgroundStyle: {
            flex: 1,
            backgroundColor: theme.colors.grey5,
        },
        bg: {
            width: "100%",
            height: "100%",
            flex: 1,
        },
    });

    const currentDefaultNavTheme = colorScheme === "light" ? DefaultTheme : DarkTheme;
    const navigationTheme = {
        ...currentDefaultNavTheme,
        dark: colorScheme === "dark",
        colors: {
            ...currentDefaultNavTheme.colors,
            ...theme.colors,
            background: "transparent",
        },
    };
    return (
        <CourseScheduleContext.Provider value={contextValue}>
            <View {...props} style={[style.backgroundStyle, props.style]}>
                <ImageBackground
                    style={style.bg}
                    source={{uri: userConfig.theme.bgUrl}}
                    loadingIndicatorSource={{uri: userConfig.theme.bgUrl}}
                    resizeMode="cover">
                    <StatusBar barStyle={colorScheme === "light" ? "dark-content" : "light-content"} />
                    <NavigationContainer theme={navigationTheme}>
                        <RootStack />
                    </NavigationContainer>
                </ImageBackground>
            </View>
        </CourseScheduleContext.Provider>
    );
}
