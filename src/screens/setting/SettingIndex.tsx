import {Pressable, PressableAndroidRippleConfig, SectionList, StyleSheet, View} from "react-native";
import {Text} from "@rneui/themed";
import {BaseColor, Color} from "../../js/color.ts";
import AntDesign from "react-native-vector-icons/AntDesign.js";
import {useNavigation} from "@react-navigation/native";

interface settingSection {
    title: string;
    data: SettingItem[];
}

interface SettingItem {
    label: string;
    type: "navigation";
    navigation: string;
}

const staticData = {
    style: {
        cardBg: new Color(BaseColor.lightgray).setAlpha(0.3).rgbaString,
        settingItemRipple: {
            color: BaseColor.lightgray,
        } as PressableAndroidRippleConfig,
    },
};

export function SettingIndex() {
    const navigation = useNavigation();

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
                                android_ripple={staticData.style.settingItemRipple}>
                                <Text>{item.label}</Text>
                                <AntDesign name="right" size={16} />
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
                stickySectionHeadersEnabled
                renderSectionHeader={({section: {title}}) => (
                    <View>
                        <Text h4>{title}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const style = StyleSheet.create({
    settingContainer: {
        padding: "5%",
    },
    settingSectionContainer: {
        paddingHorizontal: "3%",
        paddingTop: "2%",
        paddingBottom: "5%",
        borderRadius: 5,
        backgroundColor: staticData.style.cardBg,
    },
    settingItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 20,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#aaa",
    },
});
