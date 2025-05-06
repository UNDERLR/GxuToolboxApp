import {StyleSheet, ToastAndroid, View} from "react-native";
import {Button, Input, Text} from "@rneui/themed";
import {useEffect, useState} from "react";
import {jwxt} from "../../../js/jw/jwxt.ts";
import {userMgr} from "../../../js/mgr/user.ts";
import {Icon} from "../../../components/un-ui/Icon.tsx";

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

export function JWAccountScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPwd, setShowPwd] = useState(false);

    //从存储中读取数据
    useEffect(() => {
        userMgr.getAccount().then(data => {
            setUsername(data.username);
            setPassword(data.password);
        });
    }, []);
    return (
        <View style={style.container}>
            <Text h2 style={style.title}>
                设置教务帐密
            </Text>
            <Text style={style.note}>仅用于工具从教务系统获取信息，凌晨请连接校园网</Text>
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
                secureTextEntry={!showPwd}
                rightIcon={
                    <Icon
                        type="fontawesome"
                        name={showPwd ? "eye-slash" : "eye"}
                        size={20}
                        style={style.showPwdIcon}
                        onPress={() => setShowPwd(!showPwd)}
                    />
                }
            />
            <Button onPress={() => getToken(username, password)}>获取Token</Button>
            <Text style={style.note}>提示获取成功后，回到课表页进行测试，若无法正常获取课表，可能为密码错误</Text>
        </View>
    );
}

const style = StyleSheet.create({
    container: {
        padding: "5%",
    },
    title: {
        textAlign: "center",
    },
    note: {
        marginVertical: 20,
        textAlign: "center",
        color: "gray",
        fontSize: 14,
    },
    showPwdIcon: {
        paddingHorizontal: 5,
        cursor: "pointer",
    },
});
