import {Course} from "@/type/infoQuery/course/course.ts";
import {Pressable, StyleSheet, ToastAndroid, View, ViewProps} from "react-native";
import {ListItem, Text} from "@rneui/themed";
import {Icon} from "@/components/un-ui/Icon.tsx";
import Flex from "@/components/un-ui/Flex.tsx";
import Clipboard from "@react-native-clipboard/clipboard";
import React, {useContext} from "react";
import {UserConfigContext} from "@/components/AppProvider.tsx";

interface Props extends ViewProps {
    course: Course;
}

interface Info {
    label: string;
    key: keyof Omit<Course, "queryModel" | "userModel">;
}

export function CourseDetail(props: Props) {
    const {userConfig} = useContext(UserConfigContext);
    const infoList = Object.entries(userConfig.preference.courseDetail)
        .filter(prop => prop[1].show)
        .map<Info>(([key, {label}]) => ({
            key,
            label,
        }));

    const style = StyleSheet.create({
        infoIcon: {
            width: 20,
        },
        infoLabel: {
            fontSize: 20,
            fontWeight: "bold",
        },
        infoData: {
            fontSize: 16,
        },
    });

    function copy(value, tip) {
        Clipboard.setString(value);
        ToastAndroid.show(tip, ToastAndroid.SHORT);
    }

    return (
        <View {...props}>
            <Flex justifyContent="center">
                <Text>点击属性复制到剪切板</Text>
            </Flex>
            {infoList.map((item, index) => (
                <ListItem bottomDivider={index !== infoList.length - 1} key={index}>
                    <Flex justifyContent="space-between" gap={30}>
                        <Flex gap={10} inline>
                            <Text style={style.infoLabel}>{item.label}</Text>
                        </Flex>
                        <Flex justifyContent="flex-end">
                            <Pressable
                                android_ripple={userConfig.theme.ripple}
                                onPress={() => copy(props.course[item.key] ?? "", `复制${item.label}成功`)}>
                                <Text style={style.infoData}>{props.course[item.key] ?? ""}</Text>
                            </Pressable>
                        </Flex>
                    </Flex>
                </ListItem>
            ))}
            <ListItem>
                <Flex justifyContent="space-between" gap={30}>
                    <Flex gap={10} inline>
                        <Flex inline justifyContent="center" style={style.infoIcon}>
                            <Icon type="fontawesome" name="code" size={20} />
                        </Flex>
                        <Text style={style.infoLabel}>复制课程信息JSON</Text>
                    </Flex>
                    <Flex justifyContent="flex-end">
                        <Pressable
                            android_ripple={userConfig.theme.ripple}
                            onPress={() =>
                                copy(JSON.stringify(props.course, null, 4) + "" ?? "", "复制课程信息JSON成功")
                            }>
                            <Text style={style.infoData}>&#123; ... &#125;</Text>
                        </Pressable>
                    </Flex>
                </Flex>
            </ListItem>
        </View>
    );
}
