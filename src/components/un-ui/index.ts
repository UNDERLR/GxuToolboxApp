import {Dimensions} from "react-native";
import Flex, {FlexProps} from "./Flex";
import {Icon, UnIconProps} from "./Icon";
import {NumberInput, NumberInputProps} from "./NumberInput";
import {UnRefreshControl} from "./UnRefreshControl.tsx";
import {UnTermSelector, UnTermSelectorProps} from "./UnTermSelector.tsx";

function vw(v: number) {
    return (v / 100) * Dimensions.get("window").width;
}
function vh(v: number) {
    return (v / 100) * Dimensions.get("window").height;
}

export type {FlexProps, UnIconProps, NumberInputProps, UnTermSelectorProps};
export {Flex, Icon, NumberInput, UnRefreshControl, UnTermSelector, vw, vh};
