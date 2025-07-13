import React from "react";
import {Picker, PickerProps} from "@react-native-picker/picker";
import {useUserTheme} from "@/js/theme.ts";

export function UnPicker<T>(props: PickerProps<T>) {
    const {theme} = useUserTheme();
    return <Picker {...props} style={{
        color: theme.colors.black,
    }}/>;
}
