import {StyleSheet, ToastAndroid, View} from "react-native";
import {Button, Input, Text} from "@rneui/themed";
import {useState} from "react";
import {jwxt} from "../js/jw/jwxt.ts";
import {userMgr} from "../js/mgr/user.ts";

function getToken(username: string, password: string) {
    userMgr.storeAccount(username, password);
    jwxt.getPublicKey().then(data => {
        if (data.exponent) {
            jwxt.login(username, password, data.modulus, data.exponent).then(res => {
                if (res.status === 200) {
                    ToastAndroid.show("获取成功", ToastAndroid.SHORT);
                } else {
                    ToastAndroid.show(`获取失败，错误码：${res.status}`, ToastAndroid.SHORT);
                }
            });
        }
    });
}

export function LoginScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    //从存储中读取数据
    userMgr.getAccount().then(data => {
        setUsername(data.username);
        setPassword(data.password);
    });
    return (
        <View style={style.loginBg}>
            <Text h1 style={style.loginTitle}>
                登录教务
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
