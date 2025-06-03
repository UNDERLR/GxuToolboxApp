import {SliderProps} from "@rneui/base";
import {Slider, Text} from "@rneui/themed";
import {StyleProp, StyleSheet, View} from "react-native";
import Flex from "./Flex.tsx";
import {useUserTheme} from "@/js/theme.ts";

interface Props {
    containerStyle?: StyleProp<any>;
    SliderContainerStyle?: StyleProp<any>;
}

export function UnSlider(props: Props & SliderProps) {
    const {theme} = useUserTheme();

    const style = StyleSheet.create({
        valuePreviewText: {
            backgroundColor: theme.colors.background,
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 4,
        }
    })

    return (
        <Flex gap={10} inline justifyContent="space-between" style={props.containerStyle}>
            <Text style={style.valuePreviewText}>{props.value}</Text>
            <Flex style={{marginBottom: -5}}>
                <Slider
                    {...props}
                    containerStyle={props.SliderContainerStyle}
                    trackStyle={{marginTop: -5}}
                    thumbStyle={{marginTop: -5}}
                />
            </Flex>
        </Flex>
    );
}
