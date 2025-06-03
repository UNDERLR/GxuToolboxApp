import {
    Linking,
    Pressable,
    PressableAndroidRippleConfig,
    SectionList,
    StyleSheet,
    ToastAndroid,
    View,
} from "react-native";
import {Button, Text} from "@rneui/themed";
import {Color} from "../../js/color.ts";
import {useNavigation} from "@react-navigation/native";
import {Icon} from "../../components/un-ui/Icon.tsx";
import Flex from "../../components/un-ui/Flex.tsx";
import packageJson from "../../../package.json";
import Clipboard from "@react-native-clipboard/clipboard";
import moment from "moment/moment";
import {ColorPicker} from "../../components/un-ui/ColorPicker.tsx";
import {useUserTheme} from "../../js/theme.ts";
import {launchImageLibrary} from "react-native-image-picker";
import {UnSlider} from "../../components/un-ui/UnSlider.tsx";

interface settingSection {
    title: string;
    data: SettingItem[];
}

interface SettingItem {
    label: string;
    type: "navigation" | "text" | "link" | "any";
    navigation?: string;
    value?: any;
    url?: string;
}

export function SettingIndex() {
    const navigation = useNavigation();
    const {theme, userTheme, updateUserTheme, updateTheme} = useUserTheme();

    function selectBg() {
        launchImageLibrary({
            mediaType: "photo",
        }).then(res => {
            if (!res.didCancel && res.assets && res.assets.length > 0) {
                updateUserTheme({
                    ...userTheme,
                    bgUri: res.assets[0].uri,
                });
            }
        });
    }

    const settingList = [
        {
            title: "账号",
            data: [
                {
                    label: "教务账号设置",
                    type: "navigation",
                    navigation: "jwAccount",
                },
            ],
        },
        {
            title: "主题",
            data: [
                {
                    label: "主题色",
                    type: "any",
                    value: (
                        <ColorPicker
                            color={theme.colors.primary}
                            onColorChange={v => {
                                updateUserTheme({...userTheme, colors: {primary: v}});
                            }}
                        />
                    ),
                },
                {
                    label: "背景图（需要重启）",
                    type: "any",
                    value: (
                        <Flex gap={10} inline>
                            <Button
                                onPress={() => {
                                    updateUserTheme({...userTheme, bgUri: ""});
                                }}
                                size="sm">
                                重置背景
                            </Button>
                            <Button onPress={selectBg} size="sm">
                                选择图片
                            </Button>
                        </Flex>
                    ),
                },
                {
                    label: "背景蒙版相对透明度（需重启）",
                    type: "any",
                    value: (
                        <Flex gap={10} inline style={{width: "45%"}}>
                            <Text>{userTheme.bgOpacity}</Text>
                            <Slider
                                step={1}
                                minimumValue={0}
                                maximumValue={130}
                                value={userTheme.bgOpacity}
                                onValueChange={v => {
                                    updateUserTheme({...userTheme, bgOpacity: v});
                                }}
                            />
                        </Flex>
                    ),
                },
            ],
        },
        {
            title: "软件",
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
        if (url) {
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
                        case "any":
                            return (
                                <Flex style={style.settingItem} justifyContent="space-between">
                                    <Text>{item.label}</Text>
                                    {item.value}
                                </Flex>
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
