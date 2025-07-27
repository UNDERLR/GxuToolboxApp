import {ImageBackground, StatusBar, StyleSheet, useColorScheme, View, ViewProps} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {RootStack} from "@/route/RootStack.tsx";
import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {useUserTheme} from "@/js/theme.ts";
import {CheckUpdate} from "@/components/CheckUpdate.tsx";
import {CourseScheduleContext, generateCourseScheduleStyle, useCourseScheduleData} from "@/js/jw/course.ts";
import {UserConfigContext} from "@/components/AppProvider.tsx";

export function Root(props: ViewProps) {
    const {userConfig} = useContext(UserConfigContext);
    const {theme, navigationTheme, userTheme} = useUserTheme();
    const colorScheme = useColorScheme();
    const {courseScheduleData, updateCourseScheduleData} = useCourseScheduleData();
    const memoizedUpdateFunction = useCallback(updateCourseScheduleData, []);
    const memoizedStyle = useMemo(() =>
            generateCourseScheduleStyle(userConfig.theme.course, theme),
        [courseScheduleData, theme, userConfig]
    );

    // 使用 useMemo 包装 Context value 以避免不必要的重渲染
    const contextValue = useMemo(() => ({
        courseScheduleData,
        courseScheduleStyle: memoizedStyle,
        updateCourseScheduleData: memoizedUpdateFunction,
    }), [courseScheduleData, memoizedStyle, memoizedUpdateFunction]);

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
        <CourseScheduleContext.Provider value={contextValue}>
            <View {...props} style={[style.backgroundStyle, props.style]}>
                <ImageBackground
                    style={style.bg}
                    source={{uri: bgUri}}
                    loadingIndicatorSource={{uri: bgUri}}
                    resizeMode="cover">
                    <StatusBar barStyle={colorScheme === "light" ? "dark-content" : "light-content"} />
                    <CheckUpdate />
                    <NavigationContainer theme={navigationTheme[colorScheme ?? "light"]}>
                        <RootStack />
                    </NavigationContainer>
                </ImageBackground>
            </View>
        </CourseScheduleContext.Provider>
    );
}
