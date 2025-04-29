import React from "react";
import {Text, View} from "react-native";
import {useNavigation} from "@react-navigation/native";
import {Button} from "@rneui/base";

export function HomeScreen() {
    const navigation = useNavigation();

    return (
        <View>
            <Text>awa</Text>
            <Button touchSoundDisabled onPress={() => navigation.navigate("login")}>go to login page</Button>
        </View>
    );
}
