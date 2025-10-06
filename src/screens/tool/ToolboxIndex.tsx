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
        title: "信息查询",
        data: [
            {
                label: "课表查询",
                icon: <Icon name="calendar-month" size={iconSize} />,
                type: "navigation",
                navigation: "courseScheduleQuery",
            },
            {
                label: "班级课表查询",
                icon: <Icon name="calendar-month-outline" size={iconSize} />,
                navigation: "classCourseSchedule",
            },
            {
                label: "考试信息查询",
                icon: <Icon name="information-box-outline" size={iconSize} />,
                navigation: "examInfo",
            },
            {
                label: "考试成绩查询",
                icon: <Icon name="chart-box" size={iconSize} />,
                navigation: "examScore",
            },
            // {
            //     label: "自主选课",
            //     icon: <Icon name="barschart" size={iconSize} />,
            //     navigation: "SelfSelectedCourse",
            // },
        ],
    },
    {
        title: "实践课",
        data: [
            {
                label: "物理实验课查询",
                icon: <Icon name="flask" size={iconSize} />,
                navigation: "phyExpScreen",
            },
            {
                label: "金工实训查询",
                icon: <Icon name="tools" size={iconSize} />,
                navigation: "engTrainingScheduleScreen",
            },
        ],
    },
    {
        title: "通知",
        data: [
            {
                label: "调课信息查询",
                icon: <Icon name="clock-star-four-points-outline" size={iconSize} />,
                navigation: "reschedulingNews",
            },
            {
                label: "调休信息查询",
                icon: <Icon name="calendar-clock" size={iconSize} />,
                navigation: "timeShiftScreen",
            },
        ],
    },
    {
        title: "教学评价",
        data: [
            {
                label: "期末学生评价",
                icon: <Icon name="invoice-text-edit" size={iconSize} />,
                navigation: "EvaluationOverview",
            },
        ],
    },
    {
        title: "其他",
        data: [
            {
                label: "地图导航",
                icon: <Icon name="map" size={iconSize} />,
                navigation: "PositionListScreen",
            },
            {
                label: "小部件预览",
                icon: <Icon name="widgets" size={iconSize} />,
                navigation: "WidgetPreviewScreen",
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
            cardBg: Color(theme.mode === "light" ? theme.colors.background : theme.colors.grey5).setAlpha(
                0.1 + ((theme.mode === "light" ? 0.7 : 0.1) * userConfig.theme.bgOpacity) / 100,
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
            paddingVertical: 10,
        },
        toolIcon: {
            marginVertical: 10,
        },
    });

    return (
        <ScrollView contentContainerStyle={style.settingContainer}>
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
                                <Flex direction="column" inline>
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
