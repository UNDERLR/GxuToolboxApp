import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {HomeScreen} from "../screens/HomeScreen.tsx";
import React from "react";
import {LoginScreen} from "../screens/LoginScreen.tsx";

const Stack = createNativeStackNavigator();

export function RootStack() {
    return (
        <Stack.Navigator initialRouteName="home">
            <Stack.Screen name="课表" navigationKey="home" component={HomeScreen} />
            <Stack.Screen name="登录教务系统" navigationKey="login" component={LoginScreen} />
        </Stack.Navigator>
    );
}
