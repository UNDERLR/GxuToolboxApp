import ReactNativeBlobUtil from "react-native-blob-util";
import {PermissionsAndroid, Platform, ToastAndroid} from "react-native";

interface DownloadProgress {
    total: number;
    received: number;
    percent: number;
}

/**
 * 下载并安装APK
 * @param url 下载地址
 * @param onProgress 下载进度回调
 * @returns Promise<void>
 */
export async function downloadAndInstallApk(
    url: string,
    onProgress?: (progress: DownloadProgress) => void,
): Promise<void> {
    try {
        // 检查Android权限
        if (Platform.OS === "android") {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: "存储权限",
                message: "下载更新需要使用存储权限",
                buttonNeutral: "稍后询问",
                buttonNegative: "取消",
                buttonPositive: "确定",
            });

            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
                ToastAndroid.show("需要存储权限才能下载更新", ToastAndroid.SHORT);
                return;
            }
        }

        // 获取下载路径
        const downloadPath = `${
            Platform.OS === "ios" ? ReactNativeBlobUtil.fs.dirs.DocumentDir : ReactNativeBlobUtil.fs.dirs.DownloadDir
        }/gxu_tool_${Date.now()}.apk`;

        // 开始下载
        const res = await ReactNativeBlobUtil.config({
            fileCache: true,
            appendExt: "apk",
            path: downloadPath,
            // 在通知栏显示下载进度
            addAndroidDownloads: {
                useDownloadManager: true,
                notification: true,
                mime: "application/vnd.android.package-archive",
                title: "GXU工具箱更新",
                description: "正在下载更新...",
                path: downloadPath,
            },
        }).fetch("GET", url);

        // 下载进度回调
        if (onProgress) {
            res.progress((received, total) => {
                onProgress({
                    received,
                    total,
                    percent: (received / total) * 100,
                });
            });
        }

        // 下载完成，开始安装
        if (Platform.OS === "android") {
            // Android 系统调用安装器
            await ReactNativeBlobUtil.android.actionViewIntent(res.path(), "application/vnd.android.package-archive");
            ToastAndroid.show("请完成安装", ToastAndroid.SHORT);
        } else {
            // iOS 提示不支持
            console.warn("iOS暂不支持应用内更新");
        }
    } catch (error) {
        console.error("下载或安装失败:", error);
        ToastAndroid.show("更新失败，请稍后重试", ToastAndroid.SHORT);
        throw error;
    }
}
