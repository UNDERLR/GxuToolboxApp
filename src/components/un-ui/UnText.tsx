import {TextProps} from "@rneui/base";
import {Text} from "@rneui/themed";
import {TextStyle} from "react-native";

interface Props {
    size?: TextStyle["fontSize"];
    color?: TextStyle["color"];
}

export type UnTextProps = Props & TextProps;

export function UnText(props: UnTextProps) {
    return (
        <Text
            {...props}
            style={[
                {
                    fontSize: props.size,
                    color: props.color,
                },
                props.style,
            ]}
        />
    );
}
