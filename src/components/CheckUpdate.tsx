import {useEffect, useState} from "react";
import {Button, Dialog, Text} from "@rneui/themed";
import axios, {AxiosResponse} from "axios";
import {PermissionsAndroid, StyleSheet, ToastAndroid} from "react-native";
import Flex from "./un-ui/Flex";
import packageJSON from "../../package.json";
import {downloadAndInstallApk} from "@/js/DownloadAndInstallApk.ts";

enum ChannelList {
    release = "release",
    beta = "beta",
}

interface VersionRes {
    lastest: Record<ChannelList, Channel>;
    logs: Record<ChannelList, Record<string, Log>>;
}

interface Channel {
    code: number;
    name: string;
}

interface Log {
    msg: string[];
    source: Scource[];
}

interface Scource {
    name: string;
    url: string;
}

export function CheckUpdate() {
    const [lastestName, setLastestName] = useState("");
    const [apkUrl, setApkUrl] = useState("");
    const [msgList, setMsgList] = useState<string[]>([]);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [channel, setChannel] = useState(ChannelList.beta);
    useEffect(() => {
        init();
    }, []);

    function init() {
        PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]).then(granted => {
            if (
                granted["android.permission.READ_EXTERNAL_STORAGE"] === "granted" &&
                granted["android.permission.WRITE_EXTERNAL_STORAGE"] === "granted"
            ) {
                axios
                    .get("https://api.unde.site/gxu_tool_app/version.json")
                    .then((res: AxiosResponse<VersionRes, any>) => {
                        const isLatest = res.data.lastest[channel].code <= packageJSON.versionCode;
                        if (!isLatest) {
                            setLastestName(res.data.lastest[channel].name);
                            setMsgList(res.data.logs[channel][res.data.lastest[channel].name].msg);
                            setApkUrl(res.data.logs[channel][res.data.lastest[channel].name].source[0].url);
                            setDialogVisible(true);
                        }
                    });
            }else {
                // ToastAndroid.show("需要权限进行更新", ToastAndroid.SHORT);
            }
        });
    }

    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState<number>(0);
    const handleUpdate = async (url: string) => {
        try {
            setDownloading(true);
            await downloadAndInstallApk(url, progress => {
                setProgress(progress.percent);
            });
        } catch (error) {
            console.error("更新失败:", error);
        } finally {
            setDownloading(false);
            setProgress(0);
        }
    };

    const style = StyleSheet.create({});

    return (
        <Dialog isVisible={dialogVisible} onBackdropPress={() => setDialogVisible(false)}>
            <Flex direction="column" gap={5} alignItems="flex-start" inline>
                <Text h4>更新提示</Text>
                {/*<Text>可以在设置关闭更新提示</Text>*/}
                <Text>版本号：{lastestName}</Text>
                <Text>更新信息：</Text>
                {msgList.map((msg, index) => (
                    <Text key={`updateInfo-${index}`}>{msg}</Text>
                ))}
                <Flex gap={10} inline>
                    <Button loading={downloading} disabled={downloading} onPress={() => handleUpdate(apkUrl)}>
                        {downloading ? `下载中 ${progress.toFixed(1)}%` : "更新"}
                    </Button>
                    <Button type="clear" onPress={() => setDialogVisible(false)} disabled={downloading}>
                        取消
                    </Button>
                </Flex>
            </Flex>
        </Dialog>
    );
}
