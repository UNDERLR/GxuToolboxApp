import {RefreshControl, RefreshControlProps} from "react-native";
import {useTheme} from "@rneui/themed";

export function UnRefreshControl(props: RefreshControlProps) {
    const {theme} = useTheme();
    return <RefreshControl colors={[theme.colors.primary]} progressBackgroundColor={theme.colors.grey5} {...props} />;
}
