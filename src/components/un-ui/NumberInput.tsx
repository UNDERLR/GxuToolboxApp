import {Pressable, StyleSheet, View} from "react-native";
import Flex from "./Flex.tsx";
import {Text} from "@rneui/themed";
import {UnIcon} from "./UnIcon.tsx";
import {useUserTheme} from "../../js/theme.ts";
import {Color} from "../../js/color.ts";

interface Props {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    size?: number;
}

export function NumberInput(props: Props) {
    const {userTheme, theme} = useUserTheme();
    const style = StyleSheet.create({
        container: {
            borderColor: theme.colors.grey4,
            borderWidth: 1,
            borderRadius: 5,
            height: props.size ?? 30,
        },
        leftIcon: {
            width: props.size ?? 30,
            height: "100%",
            borderRightWidth: 1,
            borderRightColor: theme.colors.grey4,
            backgroundColor:
                            props.value <= (props.min ?? Number.MIN_SAFE_INTEGER)
                                ? new Color(theme.colors.grey5).setAlpha(0.5).rgbaString
                                : undefined,
        },
        input: {
            paddingHorizontal: 10,
        },
        rightIcon: {
            width: props.size ?? 30,
            height: "100%",
            borderLeftWidth: 1,
            borderLeftColor: theme.colors.grey4,
            backgroundColor:
                            props.value >= (props.max ?? Number.MAX_SAFE_INTEGER)
                                ? new Color(theme.colors.grey5).setAlpha(0.5).rgbaString
                                : undefined,
        },
    });

    function plus() {
        if (props.max && props.value >= props.max) return;
        props.onChange(props.value + (props.step ?? 1));
    }

    function minus() {
        if (props.min && props.value <= props.min) return;
        props.onChange(props.value - (props.step ?? 1));
    }

    return (
        <Flex style={style.container} inline>
            <Pressable
                android_ripple={userTheme.ripple}
                onPress={minus}
                disabled={props.value <= (props.min ?? Number.MIN_SAFE_INTEGER)}>
                <Flex style={style.leftIcon} inline justifyContent="center">
                    <UnIcon
                        name="minus"
                        size={props.size / 2 ?? 15}
                        color={
                            props.value <= (props.min ?? Number.MIN_SAFE_INTEGER)
                                ? new Color(theme.colors.black).setAlpha(0.5).rgbaString
                                : undefined
                        }
                    />
                </Flex>
            </Pressable>
            <View>
                <Text style={style.input}>{props.value}</Text>
            </View>
            <Pressable
                android_ripple={userTheme.ripple}
                onPress={plus}
                disabled={props.value >= (props.max ?? Number.MAX_SAFE_INTEGER)}>
                <Flex style={style.rightIcon} inline justifyContent="center">
                    <UnIcon
                        name="plus"
                        size={props.size / 2 ?? 15}
                        color={
                            props.value >= (props.max ?? Number.MAX_SAFE_INTEGER)
                                ? new Color(theme.colors.black).setAlpha(0.5).rgbaString
                                : undefined
                        }
                    />
                </Flex>
            </Pressable>
        </Flex>
    );
}
