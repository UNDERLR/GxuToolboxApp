import {PermissionsAndroid, Platform} from "react-native";

// 定义权限类型
type Permission = typeof PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;

export const PermissionApi = {
    // 检查多个权限
    checkMultiple: async (permissions: Permission[]): Promise<boolean> => {
        if (Platform.OS !== "android") return true;

        const results = await Promise.all(permissions.map(permission => PermissionsAndroid.check(permission)));
        console.log(results);
        return results.every(granted => granted);
    },

    // 请求文件读写权限
    requestFilePermission: async (): Promise<boolean> => {
        if (Platform.OS !== "android") return true;

        try {
            // 对于 Android 13+，使用 READ_MEDIA_IMAGES 而不是 READ_EXTERNAL_STORAGE
            const permissions: Permission[] = [
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                Platform.Version >= 33
                    ? PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                    : PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            ] as Permission[];

            // 检查是否已经拥有权限
            const hasPermission = await PermissionApi.checkMultiple(permissions);
            if (hasPermission) return true;

            // 请求权限
            const granted = await PermissionsAndroid.requestMultiple(permissions);

            // 检查所有权限是否都被授予
            return Object.values(granted).every(status => status === PermissionsAndroid.RESULTS.GRANTED);
        } catch (err) {
            console.warn("请求权限时出错:", err);
            return false;
        }
    },

    // 检查并请求文件权限（一步完成）
    checkAndRequestFilePermission: async (): Promise<boolean> => {
        const hasPermission = await PermissionApi.requestFilePermission();
        if (!hasPermission) {
            // 可以在这里添加引导用户去设置页面开启权限的逻辑
            console.warn("文件权限被拒绝，某些功能可能无法正常使用");
        }
        return hasPermission;
    },
};
