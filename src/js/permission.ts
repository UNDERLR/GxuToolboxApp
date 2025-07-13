import {Alert, Linking, PermissionsAndroid, Platform} from "react-native";

export async function requestStoragePermission() {
    try {
        if (Platform.OS !== "android") {
            return true; // iOS 不需要显式请求存储权限
        }

        if (Platform.Version >= 33) {
            // Android 13 及以上
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES, {
                title: "需要照片权限",
                message: "需要访问您的照片以选择背景图片",
                buttonNeutral: "稍后询问",
                buttonNegative: "取消",
                buttonPositive: "确定",
            });
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            // Android 12 及以下
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE, {
                title: "需要存储权限",
                message: "需要访问您的设备存储以选择文件",
                buttonNeutral: "稍后询问",
                buttonNegative: "取消",
                buttonPositive: "确定",
            });
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        }
    } catch (error) {
        console.warn("权限请求失败:", error);
        return false;
    }
}

// 请求文件管理权限 (Android 11+)
export async function requestFileManagePermission() {
    try {
        if (Platform.OS !== "android") {
            return true; // iOS 不需要此权限
        }

        if (Platform.Version >= 30) {
            // Android 11 及以上需要 MANAGE_EXTERNAL_STORAGE 权限
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE, {
                title: "需要文件管理权限",
                message: "需要访问和管理设备上的所有文件",
                buttonNeutral: "稍后询问",
                buttonNegative: "取消",
                buttonPositive: "确定",
            });
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } else {
            // Android 10 及以下使用普通存储权限
            return await requestStoragePermission();
        }
    } catch (error) {
        console.warn("文件管理权限请求失败:", error);
        return false;
    }
}

// 请求完整的文件访问权限（包括系统设置跳转）
export async function requestFullFileAccess() {
    try {
        if (Platform.OS !== "android") {
            return true;
        }

        if (Platform.Version >= 30) {
            // 检查是否已有 MANAGE_EXTERNAL_STORAGE 权限
            const hasManagePermission = await PermissionsAndroid.check(
                PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
            );

            if (hasManagePermission) {
                return true;
            }

            // 显示说明对话框
            Alert.alert(
                "需要文件管理权限",
                "为了更好地管理文件，需要授予完整的文件访问权限。点击确定将跳转到设置页面。",
                [
                    {
                        text: "取消",
                        style: "cancel",
                        onPress: () => false,
                    },
                    {
                        text: "确定",
                        onPress: async () => {
                            try {
                                // 跳转到应用的权限设置页面
                                await Linking.openSettings();
                            } catch (err) {
                                console.warn("无法打开设置页面:", err);
                            }
                        },
                    },
                ],
            );
            return false;
        } else {
            // Android 10 及以下
            return await requestStoragePermission();
        }
    } catch (error) {
        console.warn("请求完整文件访问权限失败:", error);
        return false;
    }
}

// 检查存储权限状态
export async function checkStoragePermission() {
    try {
        if (Platform.OS !== "android") {
            return true;
        }

        const permission =
            Platform.Version >= 33
                ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

        const result = await PermissionsAndroid.check(permission);
        return result;
    } catch (error) {
        console.warn("检查权限状态失败:", error);
        return false;
    }
}

// 检查文件管理权限状态
export async function checkFileManagePermission() {
    try {
        if (Platform.OS !== "android") {
            return true;
        }

        if (Platform.Version >= 30) {
            const result = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE);
            return result;
        } else {
            return await checkStoragePermission();
        }
    } catch (error) {
        console.warn("检查文件管理权限状态失败:", error);
        return false;
    }
}

// 请求写入存储权限
export async function requestWriteStoragePermission() {
    try {
        if (Platform.OS !== "android") {
            return true;
        }

        const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
            title: "需要写入存储权限",
            message: "需要写入文件到设备存储",
            buttonNeutral: "稍后询问",
            buttonNegative: "取消",
            buttonPositive: "确定",
        });
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
        console.warn("写入存储权限请求失败:", error);
        return false;
    }
}

// 一次性请求所有相关权限
export async function requestAllFilePermissions() {
    try {
        if (Platform.OS !== "android") {
            return {read: true, write: true, manage: true};
        }

        const results = {
            read: false,
            write: false,
            manage: false,
        };

        // 请求读取权限
        results.read = await requestStoragePermission();

        // 请求写入权限
        results.write = await requestWriteStoragePermission();

        // 请求文件管理权限（Android 11+）
        if (Platform.Version >= 30) {
            results.manage = await requestFileManagePermission();
        } else {
            results.manage = results.read && results.write;
        }

        return results;
    } catch (error) {
        console.warn("请求所有文件权限失败:", error);
        return {read: false, write: false, manage: false};
    }
}
