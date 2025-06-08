import React, {useEffect, useMemo, useRef} from "react";
import {ThemeProvider} from "@rneui/themed";
import {theme} from "./src/js/theme.ts";
import {Root} from "./src/screens/Root.tsx";
import {useColorScheme, View, ViewProps} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {requestStoragePermission} from "./src/js/permission.ts";
import {jwxt} from "@/js/jw/jwxt.ts";

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

    // 应用初始化
    useEffect(() => {
        requestStoragePermission();
        jwxt.refreshToken().then(() => appRef.current?.forceUpdate());
    }, []);

    return (
        <ThemeProvider theme={currentTheme}>
            <SafeAreaProvider>
                <Root ref={appRef}/>
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

export default App;
