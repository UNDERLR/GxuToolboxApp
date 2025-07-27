import {
    Linking,
    Pressable,
    PressableAndroidRippleConfig,
    SectionList,
    StyleSheet,
    ToastAndroid,
    View,
} from "react-native";
import {ListItem, Text} from "@rneui/themed";
import {Color} from "@/js/color.ts";
import {useNavigation} from "@react-navigation/native";
import {Icon} from "@/components/un-ui/Icon.tsx";
import Flex from "@/components/un-ui/Flex.tsx";
import Clipboard from "@react-native-clipboard/clipboard";
import {useUserTheme} from "@/js/theme.ts";

interface settingSection {
    title: string;
    data: ToolboxItem[];
}

interface ToolboxItem {
    label: string;
    type: "navigation" | "text" | "link";
    icon?: React.ReactNode;
    navigation?: string;
    value?: string;
    url?: string;
}

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
                icon: <Icon name="calendar" size={20} />,
                type: "navigation",
                navigation: "classCourseSchedule",
            },
        ],
    },
    {
        title: "考试",
        data: [
            {
                label: "考试信息查询",
                icon: <Icon name="book" size={20} />,
                type: "navigation",
                navigation: "examInfo",
            },
            {
                label: "考试成绩查询",
                icon: <Icon name="barschart" size={20} />,
                type: "navigation",
                navigation: "examScore",
            },
        ],
    },
] as settingSection[];

export function ToolboxIndex() {
    const navigation = useNavigation();
    const {theme, userTheme} = useUserTheme();

    const data = {
        style: {
            cardBg: Color(theme.colors.background).setAlpha(
                0.1 + ((theme.mode === "light" ? 0.7 : 0.4) * userTheme.bgOpacity) / 100,
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
        settingSectionHeader: {
            marginTop: 10,
        },
        settingItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 20,
            paddingHorizontal: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey3,
        },
        linkText: {
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.black,
        },
    });

    function openUrl(url: string) {
        Linking.canOpenURL(url)
            .then(v => {
                if (v) {
                    Linking.openURL(url);
                    return;
                } else {
                    ToastAndroid.show("打开链接失败，已将链接复制至剪切板", ToastAndroid.LONG);
                    Clipboard.setString(url);
                }
            })
            .catch(() => {
                ToastAndroid.show("打开链接失败，已将链接复制至剪切板", ToastAndroid.LONG);
                Clipboard.setString(url);
            });
    }

    return (
        <View style={style.settingContainer}>
            <SectionList
                sections={toolList}
                renderItem={({item}: {item: ToolboxItem}) => {
                    switch (item.type) {
                        case "navigation":
                            return (
                                <Pressable
                                    onPress={() => navigation.navigate(item.navigation)}
                                    style={style.settingItem}
                                    android_ripple={data.style.settingItemRipple}>
                                    <Flex gap={5}>
                                        {item.icon}
                                        <Text>{item.label}</Text>
                                    </Flex>
                                    <Icon name="right" size={16} />
                                </Pressable>
                            );
                        case "text":
                            return (
                                <Flex style={style.settingItem} justifyContent="space-between">
                                    <Text>{item.label}</Text>
                                    <Text>{item.value}</Text>
                                </Flex>
                            );
                        case "link":
                            return (
                                <Pressable
                                    onPress={() => openUrl(item.url)}
                                    style={style.settingItem}
                                    android_ripple={data.style.settingItemRipple}>
                                    <Text>{item.label}</Text>
                                    <Text style={style.linkText}>
                                        <Icon name="link" size={16} />
                                        {item.value ?? item.url}
                                    </Text>
                                </Pressable>
                            );
                        default:
                            return (
                                <View style={style.settingItem}>
                                    <Text>{item.label}</Text>
                                </View>
                            );
                    }
                }}
                contentContainerStyle={style.settingSectionContainer}
                renderSectionHeader={({section: {title}}) => (
                    <ListItem.Subtitle style={style.settingSectionHeader}>
                        <Text h4>{title}</Text>
                    </ListItem.Subtitle>
                )}
            />
        </View>
    );
}
