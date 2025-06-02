import React, {useEffect, useMemo} from "react";
import {ThemeProvider} from "@rneui/themed";
import {theme} from "./src/js/theme.ts";
import {Root} from "./src/screens/Root.tsx";
import {useColorScheme} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {requestStoragePermission} from "./src/js/permission.ts";

function App(): React.JSX.Element {
    const colorScheme = useColorScheme();
    const currentTheme = useMemo(
        () => ({
            ...theme,
            mode: colorScheme ?? "light",
        }),
        [colorScheme],
    );

    // 应用初始化
    useEffect(() => {
        requestStoragePermission();
    }, []);

    return (
        <ThemeProvider theme={currentTheme}>
            <SafeAreaProvider>
                <Root />
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

export default App;
