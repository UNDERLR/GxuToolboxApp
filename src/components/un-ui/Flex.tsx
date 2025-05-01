import {FlexAlignType, StyleProp, StyleSheet, View, ViewProps, ViewStyle} from "react-native";

interface Props extends ViewProps {
    gap: number;
    alignItems: FlexAlignType;
    justifyContent: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly";
}

export default function Flex(props: Partial<Props>) {
    const style = StyleSheet.create({
        unUiFlex: {
            flex: 1,
            flexDirection: "row",
            gap: props.gap ?? 0,
            alignItems: "center",
            justifyContent: "flex-start",
        },
    });
    const flexStyle = props.style
        ? StyleSheet.compose(props.style, style.unUiFlex)
        : style.unUiFlex;
    return (
        <View {...props} style={flexStyle}>
            {props.children}
        </View>
    );
}
