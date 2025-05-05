import AntDesign from "react-native-vector-icons/AntDesign.js";
import FontAwesome from "react-native-vector-icons/FontAwesome.js";
import {IconProps, useTheme} from "@rneui/themed";

interface Props extends IconProps{
    name: string;
    size?: number;
    color?: string;
    type?: "antdesign" | "fontawesome";
}

export function Icon({type = "antdesign", name, size = 12, color, ...props}: Props) {
    const {theme} = useTheme();
    const iconColor = color || theme.colors.black;

    switch (type) {
        case "antdesign":
            return <AntDesign name={name} size={size} color={iconColor} {...props} />;
        case "fontawesome":
            return <FontAwesome name={name} size={size} color={iconColor} {...props} />;
        default:
            return <AntDesign name={name} size={size} color={iconColor} {...props} />;
    }
}
