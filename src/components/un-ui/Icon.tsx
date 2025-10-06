import {IconProps, useTheme} from "@rneui/themed";
import AntDesign, {AntDesignIconName} from "@react-native-vector-icons/ant-design";
import Ionicons, {IoniconsIconName} from "@react-native-vector-icons/ionicons";
import FontAwesome6, {FontAwesome6RegularIconName} from "@react-native-vector-icons/fontawesome6";
import {MaterialDesignIcons, MaterialDesignIconsIconName} from "@react-native-vector-icons/material-design-icons";

interface Props extends IconProps {
    name: AntDesignIconName | FontAwesome6RegularIconName | IoniconsIconName | MaterialDesignIconsIconName;
    size?: number;
    color?: string;
    type?: "antdesign" | "fontawesome" | "Ionicon" | "material";
}

export function Icon({type = "material", name, size = 12, color, ...props}: Props) {
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
