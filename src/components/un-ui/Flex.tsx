import {FlexAlignType, StyleProp, StyleSheet, View, ViewProps, ViewStyle} from "react-native";
import React from "react";

interface Props {
    gap: number;
    inline: boolean;
    direction: "row" | "column";
    alignItems: FlexAlignType;
    justifyContent: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly";
    childrenStyle?: StyleProp<ViewStyle>;
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
            {React.Children.map(props.children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        style: [{height: "auto"}, props.childrenStyle, child.props?.style],
                    });
                }
                return child;
            })}
        </View>
    );
}
