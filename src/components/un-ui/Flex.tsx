import {FlexAlignType, StyleSheet, View, ViewProps} from "react-native";

interface Props {
    gap: number;
    inline: boolean;
    direction: "row" | "column";
    alignItems: FlexAlignType;
    justifyContent: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly";
}

export type FlexProps = Partial<Props & ViewProps>;
export default function Flex(props: FlexProps) {
    const style = StyleSheet.create({
        unUiFlex: {
            flex: !props.inline ? 1 : undefined,
            flexDirection: props.direction ?? "row",
            gap: props.gap ?? 0,
            alignItems: props.alignItems ?? "center",
            justifyContent: props.justifyContent ?? "flex-start",
        },
    });
    return (
        <View {...props} style={[props.style, style.unUiFlex]}>
            {props.children}
        </View>
    );
}
