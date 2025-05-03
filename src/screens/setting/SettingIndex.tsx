import {
    Linking,
    Pressable,
    PressableAndroidRippleConfig,
    SectionList,
    StyleSheet,
    ToastAndroid,
    View,
} from "react-native";
import {Text, useTheme} from "@rneui/themed";
import {BaseColor, Color} from "../../js/color.ts";
import {useNavigation} from "@react-navigation/native";
import {UnIcon} from "../../components/un-ui/UnIcon.tsx";
import Flex from "../../components/un-ui/Flex.tsx";
import packageJson from "../../../package.json";
import Clipboard from "@react-native-clipboard/clipboard";
import moment from "moment/moment";

interface settingSection {
    title: string;
    data: SettingItem[];
}

interface SettingItem {
    label: string;
    type: "navigation" | "text" | "link";
    navigation?: string;
    value?: string;
    url?: string;
}

export function SettingIndex() {
    const navigation = useNavigation();
    const {theme} = useTheme();

    const settingList = [
        {
            title: "账号相关",
            data: [
                {
                    label: "教务账号设置",
                    type: "navigation",
                    navigation: "jwAccount",
                },
            ],
        },
        {
            title: "软件相关",
            data: [
                {
                    label: "代码版本号",
                    type: "text",
                    value: packageJson.version,
                },
                {
                    label: "源代码",
                    type: "link",
                    value: "GitLab",
                    url: "https://gitlab.unde.site/gxutool/gxu_tool_app",
                },
                {
                    label: "软件信息",
                    type: "text",
                    value: `CopyRight © ${moment().year()} \n寰辰<UNDERLR@foxmail.com>`,
                },
            ],
        },
    ] as settingSection[];

    const data = {
        style: {
            cardBg: new Color(BaseColor.lightgray).setAlpha(theme.mode === "light" ? 0.3 : 0.1).rgbaString,
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
                sections={settingList}
                renderItem={({item}: {item: SettingItem}) => {
                    switch (item.type) {
                        case "navigation":
                            return (
                                <Pressable
                                    onPress={() => navigation.navigate(item.navigation)}
                                    style={style.settingItem}
                                    android_ripple={data.style.settingItemRipple}>
                                    <Text>{item.label}</Text>
                                    <UnIcon name="right" size={16} />
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
                                        <UnIcon name="link" size={16} />
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
                    <View style={style.settingSectionHeader}>
                        <Text h4>{title}</Text>
                    </View>
                )}
            />
        </View>
    );
}
