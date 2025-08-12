import {Linking, Pressable, PressableAndroidRippleConfig, SectionList, StyleSheet, View} from "react-native";
import {Button, Text, useTheme} from "@rneui/themed";
import {Color} from "@/js/color.ts";
import {useNavigation} from "@react-navigation/native";
import {Icon} from "@/components/un-ui/Icon.tsx";
import Flex from "@/components/un-ui/Flex.tsx";
import packageJson from "../../../package.json";
import moment from "moment/moment";
import {ColorPicker} from "@/components/un-ui/ColorPicker.tsx";
import {launchImageLibrary} from "react-native-image-picker";
import {UnSlider} from "@/components/un-ui/UnSlider.tsx";
import {useContext} from "react";
import {UserConfigContext} from "@/components/AppProvider.tsx";
import {UnListSection, UnSectionList} from "@/components/un-ui/UnSectionList.tsx";

export function SettingIndex() {
    const {userConfig, updateUserConfig} = useContext(UserConfigContext);

    function selectBg() {
        launchImageLibrary({
            mediaType: "photo",
        }).then(res => {
            if (!res.didCancel && res.assets && res.assets.length > 0) {
                userConfig.theme.bgUrl = res.assets[0].uri ?? "";
                updateUserConfig(userConfig);
            }
        });
    }

    const settingList:UnListSection[] = [
        {
            title: "账号",
            data: [
                {
                    label: "教务账号设置",
                    type: "navigation",
                    value: "jwAccount",
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
                            color={userConfig.theme.primaryColor}
                            onColorChange={v => {
                                userConfig.theme.primaryColor = v;
                                updateUserConfig(userConfig);
                            }}
                        />
                    ),
                },
                {
                    label: "背景图",
                    type: "any",
                    value: (
                        <Flex gap={10} inline>
                            <Button
                                onPress={() => {
                                    userConfig.theme.bgUrl = "";
                                    updateUserConfig(userConfig);
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
                    label: "背景蒙版相对透明度",
                    type: "blockAny",
                    value: (
                        <UnSlider
                            step={1}
                            minimumValue={0}
                            maximumValue={130}
                            value={userConfig.theme.bgOpacity}
                            onValueChange={v => {
                                userConfig.theme.bgOpacity = v;
                                updateUserConfig(userConfig);
                            }}
                        />
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
    ];

    return (
        <View style={{padding: "5%"}}>
            <UnSectionList list={settingList} />
        </View>
    );
}
