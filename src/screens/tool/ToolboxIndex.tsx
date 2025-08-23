import {Pressable, PressableAndroidRippleConfig, ScrollView, StyleSheet, View} from "react-native";
import {Text, useTheme} from "@rneui/themed";
import {Color} from "@/js/color.ts";
import {useNavigation} from "@react-navigation/native";
import {Icon} from "@/components/un-ui/Icon.tsx";
import {useContext} from "react";
import {UserConfigContext} from "@/components/AppProvider.tsx";
import Flex from "@/components/un-ui/Flex.tsx";

interface settingSection {
    title: string;
    data: ToolboxItem[];
}

interface ToolboxItem {
    label: string;
    icon?: React.ReactNode;
    navigation: string;
}

const iconSize = 25;
const toolList = [
    {
        title: "课程表",
        data: [
            // {
            //     label: "课表查询",
            //     icon: <Icon name="calendar" size={20} />,
            //     type: "navigation",
            //     navigation: "courseSchedule",
            // },
            {
                label: "班级课表查询",
                icon: <Icon name="calendar" size={iconSize} />,
                navigation: "classCourseSchedule",
            },
        ],
    },
    {
        title: "考试",
        data: [
            {
                label: "考试信息查询",
                icon: <Icon name="book" size={iconSize} />,
                navigation: "examInfo",
            },
            {
                label: "考试成绩查询",
                icon: <Icon name="barschart" size={iconSize} />,
                navigation: "examScore",
            },
        ],
    },
    {
        title: "评价",
        data: [
            {
                label: "期末学生评价",
                icon: <Icon name="infocirlceo" size={iconSize} />,
                navigation: "studentEvaluation",
            },
        ],
    },
] as settingSection[];

export function ToolboxIndex() {
    const navigation = useNavigation();
    const {theme} = useTheme();
    const {userConfig} = useContext(UserConfigContext);

    const data = {
        style: {
            cardBg: Color(theme.colors.background).setAlpha(
                0.1 + ((theme.mode === "light" ? 0.7 : 0.4) * userConfig.theme.bgOpacity) / 100,
            ).rgbaString,
            settingItemRipple: {
                color: theme.colors.grey4,
            } as PressableAndroidRippleConfig,
        },
    };

    const style = StyleSheet.create({
        settingContainer: {
            padding: "5%",
        },
        settingSectionContainer: {
            paddingHorizontal: "3%",
            paddingTop: "2%",
            paddingBottom: "5%",
            borderRadius: 5,
            backgroundColor: data.style.cardBg,
            marginBottom: 10,
        },
        toolListContainer: {
            flexWrap: "wrap",
            width: "100%",
            paddingTop: 10,
        },
        settingItem: {
            width: "33%",
            borderRadius: 8,
            paddingVertical: 4,
        },
        toolIcon: {
            marginVertical: 10,
        },
    });

    return (
        <ScrollView style={style.settingContainer}>
            {toolList.map(section => (
                <View style={style.settingSectionContainer} key={`tool-${section.title}`}>
                    <Text h4>{section.title}</Text>
                    <Flex style={style.toolListContainer}>
                        {section.data.map(tool => (
                            <Pressable
                                key={`tool-${section.title}-${tool.label}`}
                                style={style.settingItem}
                                android_ripple={userConfig.theme.ripple}
                                onPress={() => navigation.navigate(tool.navigation)}>
                                <Flex direction="column">
                                    <View style={style.toolIcon}>{tool.icon}</View>
                                    <View>
                                        <Text>{tool.label}</Text>
                                    </View>
                                </Flex>
                            </Pressable>
                        ))}
                    </Flex>
                </View>
            ))}
        </ScrollView>
    );
}
