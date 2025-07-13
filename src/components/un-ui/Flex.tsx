import {FlexAlignType, StyleSheet, View, ViewProps} from "react-native";

interface Props {
    gap: number;
    inline: boolean;
    direction: "row" | "column";
    alignItems: FlexAlignType;
    justifyContent: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly";
}

export default function Flex(props: Partial<Props & ViewProps>) {
    const style = StyleSheet.create({
        unUiFlex: {
            flex: !props.inline ? 1 : undefined,
            flexDirection: props.direction ?? "row",
            gap: props.gap ?? 0,
            alignItems: props.alignItems ?? "center",
            justifyContent: props.justifyContent ?? "flex-start",
        },
    });
    const flexStyle = props.style ? StyleSheet.compose(props.style, style.unUiFlex) : style.unUiFlex;
    return (
        <View {...props} style={flexStyle}>
            {props.children}
        </View>
    );
}
