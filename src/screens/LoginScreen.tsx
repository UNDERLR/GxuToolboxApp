import {StyleSheet, ToastAndroid, View} from "react-native";
import {Button, Input, Text} from "@rneui/base";
import {useState} from "react";
import {jwxt} from "../js/jwxt";

function getToken(username: string, password: string) {
    jwxt.getPublicKey().then(data => {
        if (data.exponent) {
            jwxt.getToken(username, password, data.modulus, data.exponent).then(res => {
                console.log(res);
                ToastAndroid.show(res, ToastAndroid.SHORT);
            });
        }
    });
}

export function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    return (
        <View style={style.loginBg}>
            <Text h1 style={style.loginTitle}>
                login
            </Text>
            <Text style={style.loginNote}>仅用于工具从教务系统获取信息</Text>
            <Input
                value={username}
                onChangeText={v => setUsername(v)}
                label="账号/学号"
                placeholder="工具绑定的教务系统账号"
            />
            <Input
                value={password}
                onChangeText={v => setPassword(v)}
                label="密码"
                placeholder="对应账号的密码"
                secureTextEntry
            />
            <Button onPress={() => getToken(username, password)}>获取Token</Button>
        </View>
    );
}

const style = StyleSheet.create({
    loginBg: {
        padding: "5%",
    },
    loginTitle: {
        textAlign: "center",
    },
    loginNote: {
        marginVertical: 20,
        textAlign: "center",
        color: "gray",
        fontSize: 14,
    },
});
