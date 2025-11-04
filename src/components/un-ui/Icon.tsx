import {IconProps, useTheme} from "@rneui/themed";
import AntDesign, {AntDesignIconName} from "@react-native-vector-icons/ant-design";
import Ionicons, {IoniconsIconName} from "@react-native-vector-icons/ionicons";
import FontAwesome6, {FontAwesome6RegularIconName} from "@react-native-vector-icons/fontawesome6";
import {MaterialDesignIcons, MaterialDesignIconsIconName} from "@react-native-vector-icons/material-design-icons";
import {FontAwesome6IconProps} from "react-native-vector-icons/FontAwesome6";

export type UnIconProps = Omit<IconProps, "type"> & {
    size?: number;
    color?: string;
} & (
    | {
    name: AntDesignIconName | string;
    type?: "antdesign" | string;
}
    | {
    name: FontAwesome6RegularIconName | string;
    type?: "fontawesome" | string;
} & FontAwesome6IconProps
    | {
    name: IoniconsIconName | string;
    type?: "Ionicons" | string;
}
    | {
    name: MaterialDesignIconsIconName | string;
    type?: "material" | string;
}
    );


export function Icon({type = "material", name, size = 12, color, ...props}: UnIconProps) {
    const {theme} = useTheme();
    const iconColor = color || theme.colors.black;

    switch (type) {
        case "antdesign":
            return <AntDesign name={name as AntDesignIconName} size={size} color={iconColor} {...props} />;
        case "fontawesome":
            return (
                <FontAwesome6
                    name={name as FontAwesome6RegularIconName}
                    iconStyle="regular"
                    size={size}
                    color={iconColor}
                    {...props}
                />
            );
        case "Ionicon":
            return <Ionicons name={name as IoniconsIconName} size={size} color={iconColor} {...props} />;
        case "material":
            return (
                <MaterialDesignIcons
                    name={name as MaterialDesignIconsIconName}
                    size={size}
                    color={iconColor}
                    {...props}
                />
            );
        default:
            return <AntDesign name={name as AntDesignIconName} size={size} color={iconColor} {...props} />;
    }
}
