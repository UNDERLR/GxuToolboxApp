import {Course} from "../../../../type/course.ts";
import {Pressable, PressableAndroidRippleConfig, StyleSheet, ToastAndroid, View, ViewProps} from "react-native";
import {ListItem, Text, useTheme} from "@rneui/themed";
import {UnIcon} from "../../../un-ui/UnIcon.tsx";
import Flex from "../../../un-ui/Flex.tsx";
import Clipboard from "@react-native-clipboard/clipboard";

interface Props extends ViewProps {
    course: Course;
}

interface Info {
    label: string;
    icon: React.JSX.Element;
    key: keyof Course;
}

export function CourseDetail(props: Props) {
    const {theme} = useTheme();
    const data = {
        style: {
            ripple: {
                color: theme.colors.grey4,
            } as PressableAndroidRippleConfig,
        },
    };
    const infoList = [
        {
            label: "课程名称",
            icon: <UnIcon name="infocirlceo" size={20} />,
            key: "kcmc",
        },
        {
            label: "地点",
            icon: <UnIcon type="fontawesome" name="map-marker" size={20} />,
            key: "cdmc",
        },
        {
            label: "上课教师",
            icon: <UnIcon name="user" size={20} />,
            key: "xm",
        },
        {
            label: "QQ群",
            icon: <UnIcon name="QQ" size={20} />,
            key: "qqqh",
        },
    ] as Info[];

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
                            <Flex inline justifyContent="center" style={style.infoIcon}>
                                {item.icon}
                            </Flex>
                            <Text style={style.infoLabel}>{item.label}</Text>
                        </Flex>
                        <Flex justifyContent="flex-end">
                            <Pressable
                                android_ripple={data.style.ripple}
                                onPress={() => copy(props.course[item.key] ?? "", `复制${item.label}成功`)}>
                                <Text style={style.infoData}>{props.course[item.key] ?? ""}</Text>
                            </Pressable>
                        </Flex>
                    </Flex>
                </ListItem>
            ))}
        </View>
    );
}
