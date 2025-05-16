import {PermissionsAndroid, Platform} from "react-native";

export async function requestStoragePermission() {
    if (Platform.Version >= 33) {
        // Android 13 及以上
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES, {
                title: "需要照片权限",
                message: "需要访问您的照片以选择背景图片",
                buttonNeutral: "稍后询问",
                buttonNegative: "取消",
                buttonPositive: "确定",
            });
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    } else {
        // Android 12 及以下
        return requestStoragePermission();
    }
}
