import {View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {UnIcon} from "../un-ui/UnIcon.tsx";

export function HomeHeaderRight() {
    const navigation = useNavigation();
    return (
        <View>
            <UnIcon name="setting" size={24} onPress={() => navigation.navigate("setting")} />
        </View>
    );
}
