import {View} from "react-native";
import {useNavigation} from "@react-navigation/native";

export function HomeHeaderRight() {
    const navigation = useNavigation();
    return <View>{/*<UnIcon name="setting" size={24} onPress={() => navigation.navigate("setting")} />*/}</View>;
}
