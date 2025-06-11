import {ImageBackground, StatusBar, StyleSheet, useColorScheme, View, ViewProps} from "react-native";
import {NavigationContainer} from "@react-navigation/native";
import {RootStack} from "@/route/RootStack.tsx";
import React, {useEffect, useState} from "react";
import {useUserTheme} from "@/js/theme.ts";
import {CheckUpdate} from "@/components/CheckUpdate.tsx";
import {CourseScheduleContext, generateCourseScheduleStyle, useCourseScheduleData} from "@/js/jw/course.ts";

export function Root(props: ViewProps) {
    const {theme, navigationTheme, userTheme} = useUserTheme();
    const colorScheme = useColorScheme();
    const {courseScheduleData, updateCourseScheduleData} = useCourseScheduleData();
    const [courseScheduleStyle, setCourseScheduleStyle] = useState(
        generateCourseScheduleStyle(courseScheduleData, theme),
    );
    useEffect(() => {
        let newStyle = generateCourseScheduleStyle(courseScheduleData, theme);
        setCourseScheduleStyle(newStyle);
    }, [courseScheduleData, theme]);

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
        <CourseScheduleContext.Provider value={{courseScheduleData, courseScheduleStyle, updateCourseScheduleData}}>
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
