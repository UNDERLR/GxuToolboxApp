import {SliderProps} from "@rneui/base";
import {Slider, Text} from "@rneui/themed";
import {Pressable, StyleProp, StyleSheet} from "react-native";
import Flex from "./Flex.tsx";
import {useUserTheme} from "@/js/theme.ts";
import {Color} from "@/js/color.ts";
import {useState} from "react";
import {NumberInput} from "@/components/un-ui/NumberInput.tsx";

interface Props {
    containerStyle?: StyleProp<any>;
    sliderContainerStyle?: StyleProp<any>;
    inputMode?: boolean;
}

export function UnSlider(props: Props & SliderProps) {
    const {theme} = useUserTheme();
    const [inputMode, setInputMode] = useState(props.inputMode);

    const style = StyleSheet.create({
        valuePreviewText: {
            backgroundColor: Color(theme.colors.background).setAlpha(0.7).rgbaString,
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 4,
        },
        valueInput: {
            width: 40,
            color: theme.colors.black,
            backgroundColor: Color(theme.colors.background).setAlpha(0.7).rgbaString,
            paddingHorizontal: 10,
            paddingVertical: 2,
            borderRadius: 4,
        },
    });

    const onValueChange = (vo: string) => {
        const v = +vo ?? 0;
        let res = v;
        if (props.maximumValue && v > props.maximumValue) {
            res = props.maximumValue;
        } else if (props.minimumValue && v < props.minimumValue) {
            res = props.minimumValue;
        }
        props.onValueChange?.(res);
    };

    return (
        <Flex gap={10} inline justifyContent="flex-end" style={props.containerStyle}>
            {inputMode ? (
                <NumberInput
                    value={props.value ?? 0}
                    onChange={props.onValueChange}
                    max={props.maximumValue}
                    min={props.minimumValue}
                    step={props.step}
                    onBlur={()=>setInputMode(false)}
                    autoFocus
                />
            ) : (
                <Text style={style.valuePreviewText} onPress={() => setInputMode(true)}>
                    {props.value}
                </Text>
            )}
            <Flex style={{marginBottom: -5}}>
                <Slider
                    {...props}
                    containerStyle={props.sliderContainerStyle}
                    trackStyle={{marginTop: -5}}
                    thumbStyle={{marginTop: -5}}
                />
            </Flex>
        </Flex>
    );
}
