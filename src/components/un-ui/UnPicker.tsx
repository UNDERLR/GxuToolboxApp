import React from "react";
import {Picker, PickerProps} from "@react-native-picker/picker";
import {useTheme} from "@rneui/themed";

export function UnPicker<T>(props: PickerProps<T>) {
    const {theme} = useTheme();
    return (
        <Picker
            {...props}
            style={{
                color: theme.colors.black,
            }}
        />
    );
}
