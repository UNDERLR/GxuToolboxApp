import {GestureResponderEvent, Pressable, StyleSheet, TextInput, View} from "react-native";
import Flex from "./Flex.tsx";
import {Icon} from "./Icon.tsx";
import {useUserTheme} from "@/js/theme.ts";
import {Color} from "@/js/color.ts";
import {useRef} from "react";

interface Props {
    value: number;
    onChange?: (value: number) => void;
    onBlur?: () => void;
    min?: number;
    max?: number;
    step?: number;
    size?: number;
    autoFocus?: boolean;
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
                    ? Color(theme.colors.grey5).setAlpha(0.5).rgbaString
                    : undefined,
        },
        input: {
            paddingHorizontal: 10,
            color: theme.colors.black,
            marginVertical: -10,
        },
        rightIcon: {
            width: props.size ?? 30,
            height: "100%",
            borderLeftWidth: 1,
            borderLeftColor: theme.colors.grey4,
            backgroundColor:
                props.value >= (props.max ?? Number.MAX_SAFE_INTEGER)
                    ? Color(theme.colors.grey5).setAlpha(0.5).rgbaString
                    : undefined,
        },
    });

    const inputRef = useRef<TextInput>(null);

    function plus() {
        if (props.max && props.value >= props.max) return;
        props.onChange?.(props.value + (props.step ?? 1));
    }

    function minus() {
        if (props.min && props.value <= props.min) return;
        props.onChange?.(props.value - (props.step ?? 1));
    }

    return (
        <Flex style={style.container} inline>
            <Pressable
                android_ripple={userTheme.ripple}
                onPressIn={e => e.stopPropagation()}
                onPress={minus}
                disabled={props.value <= (props.min ?? Number.MIN_SAFE_INTEGER)}>
                <Flex style={style.leftIcon} inline justifyContent="center">
                    <Icon
                        name="minus"
                        size={(props.size ?? 30) / 2}
                        color={
                            props.value <= (props.min ?? Number.MIN_SAFE_INTEGER)
                                ? Color(theme.colors.black).setAlpha(0.5).rgbaString
                                : undefined
                        }
                    />
                </Flex>
            </Pressable>
            <View>
                <TextInput
                    value={props.value.toString()}
                    ref={inputRef}
                    inputMode="numeric"
                    autoFocus={props.autoFocus}
                    onBlur={props.onBlur}
                    onChangeText={v => {
                        const num = parseFloat(v);
                        if (!isNaN(num)) {
                            props.onChange?.(num);
                        }
                    }}
                    style={style.input}
                />
            </View>
            <Pressable
                android_ripple={userTheme.ripple}
                onPress={plus}
                disabled={props.value >= (props.max ?? Number.MAX_SAFE_INTEGER)}>
                <Flex style={style.rightIcon} inline justifyContent="center">
                    <Icon
                        name="plus"
                        size={(props.size ?? 30) / 2}
                        color={
                            props.value >= (props.max ?? Number.MAX_SAFE_INTEGER)
                                ? Color(theme.colors.black).setAlpha(0.5).rgbaString
                                : undefined
                        }
                    />
                </Flex>
            </Pressable>
        </Flex>
    );
}
