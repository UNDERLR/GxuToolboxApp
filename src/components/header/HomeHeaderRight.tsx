import {View} from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign.js";
import {useNavigation} from "@react-navigation/native";

export function HomeHeaderRight() {
    const navigation = useNavigation();
    return (
        <View>
            <AntDesign name="setting" size={18} onPress={() => navigation.navigate("setting")} />
        </View>
    );
}
