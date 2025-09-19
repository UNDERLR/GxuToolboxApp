import {FlexAlignType, StyleProp, StyleSheet, View, ViewProps, ViewStyle} from "react-native";
import React from "react";

interface Props {
    gap: number;
    inline: boolean;
    direction: "row" | "column";
    align: FlexAlignType;
    justify: "center" | "flex-start" | "flex-end" | "space-between" | "space-around" | "space-evenly";
    childrenStyle?: StyleProp<ViewStyle>;
}

export type FlexProps = Partial<Props & ViewProps>;
export default function Flex(props: FlexProps) {
    const style = StyleSheet.create({
        unUiFlex: {
            flex: !props.inline ? 1 : undefined,
            flexDirection: props.direction ?? "row",
            gap: props.gap ?? 0,
            alignItems: props.align ?? "center",
            justifyContent: props.justify ?? "flex-start",
        },
    });
    return (
        <View {...props} style={[props.style, style.unUiFlex]}>
            {React.Children.map(props.children, child => {
                if (React.isValidElement(child)) {
                    return React.cloneElement(child as React.ReactElement<any>, {
                        style: [props.childrenStyle, child.props?.style, {height: "auto"}],
                    });
                }
                return child;
            })}
        </View>
    );
}
