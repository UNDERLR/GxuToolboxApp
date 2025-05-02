import {Pressable, PressableAndroidRippleConfig, SectionList, StyleSheet, View} from "react-native";
import {Text, useTheme} from "@rneui/themed";
import {BaseColor, Color} from "../../js/color.ts";
import {useNavigation} from "@react-navigation/native";
import {UnIcon} from "../../components/un-ui/UnIcon.tsx";

interface settingSection {
    title: string;
    data: SettingItem[];
}

interface SettingItem {
    label: string;
    type: "navigation";
    navigation: string;
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
        },
        settingItem: {
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 20,
            paddingHorizontal: 10,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.grey3,
        },
    });
    return (
        <View style={style.settingContainer}>
            <SectionList
                sections={settingList}
                renderItem={({item}: {item: SettingItem}) => {
                    if (item.type === "navigation") {
                        return (
                            <Pressable
                                onPress={() => navigation.navigate(item.navigation)}
                                style={style.settingItem}
                                android_ripple={data.style.settingItemRipple}>
                                <Text>{item.label}</Text>
                                <UnIcon name="right" size={16} />
                            </Pressable>
                        );
                    } else {
                        return (
                            <View style={style.settingItem}>
                                <Text>{item.label}</Text>
                            </View>
                        );
                    }
                }}
                contentContainerStyle={style.settingSectionContainer}
                renderSectionHeader={({section: {title}}) => (
                    <View>
                        <Text h4>{title}</Text>
                    </View>
                )}
            />
        </View>
    );
}
