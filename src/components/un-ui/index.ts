import {Dimensions} from "react-native";
import Flex, {FlexProps} from "./Flex";
import {Icon, UnIconProps} from "./Icon";

function vw(v: number) {
    return (v / 100) * Dimensions.get("window").width;
}
function vh(v: number) {
    return (v / 100) * Dimensions.get("window").height;
}

export type {FlexProps, UnIconProps};
export {Flex, Icon, vw, vh};
