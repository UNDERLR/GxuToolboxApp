import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {HomeScreen} from "../screens/HomeScreen.tsx";
import React from "react";
import {LoginScreen} from "../screens/LoginScreen.tsx";

const Stack = createNativeStackNavigator();

export function RootStack() {
    return (
        <Stack.Navigator initialRouteName="home">
            <Stack.Screen name="home" component={HomeScreen} options={{title: "课表"}} />
            <Stack.Screen name="login" component={LoginScreen} options={{title: "登录教务系统"}} />
        </Stack.Navigator>
    );
}
