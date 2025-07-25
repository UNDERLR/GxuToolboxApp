import React, {useEffect, useMemo, useRef} from "react";
import {ThemeProvider} from "@rneui/themed";
import {theme} from "@/js/theme.ts";
import {Root} from "./src/screens/Root.tsx";
import {useColorScheme, View} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {
    checkFileManagePermission,
    checkStoragePermission,
    requestAllFilePermissions,
    requestFullFileAccess,
    requestStoragePermission,
} from "@/js/permission.ts";
import {jwxt} from "@/js/jw/jwxt.ts";
import {AppProvider} from "@/components/AppProvider.tsx";

function App(): React.JSX.Element {
    const colorScheme = useColorScheme();
    const currentTheme = useMemo(
        () => ({
            ...theme,
            mode: colorScheme ?? "light",
        }),
        [colorScheme],
    );

    const appRef = useRef<View>(null);

    const handleRequestPermission = async () => {
        // 首先检查权限状态
        const hasPermission = await checkStoragePermission();

        if (!hasPermission) {
            // 如果没有权限，则请求权限
            const granted = await requestStoragePermission();
            if (granted) {
                console.log("权限已授予");
                // 执行需要权限的操作
            } else {
                console.log("权限被拒绝");
            }
        } else {
            console.log("已有权限");
            // 直接执行需要权限的操作
        }
    };

    const handleFileOperations = async () => {
        // 方法1: 请求所有文件权限
        const permissions = await requestAllFilePermissions();
        console.log("权限状态:", permissions);

        // 方法2: 请求完整文件访问权限（推荐用于文件管理应用）
        const hasFullAccess = await requestFullFileAccess();
        if (hasFullAccess) {
            console.log("有完整文件访问权限");
        }

        // 方法3: 检查当前文件管理权限状态
        const canManageFiles = await checkFileManagePermission();
        console.log("可以管理文件:", canManageFiles);
    };

    async function init() {
        await handleRequestPermission();
        await handleFileOperations();
        await jwxt.testToken();
    }

    // 应用初始化
    useEffect(() => {
        init();
    }, []);

    return (
        <AppProvider>
            <ThemeProvider theme={currentTheme}>
                <SafeAreaProvider>
                    <Root ref={appRef} />
                </SafeAreaProvider>
            </ThemeProvider>
        </AppProvider>
    );
}

export default App;
