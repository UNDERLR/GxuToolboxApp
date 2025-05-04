import React from "react";
import {ThemeProvider} from "@rneui/themed";
import {theme} from "./src/js/theme.ts";
import {Root} from "./src/screens/Root.tsx";
import {useColorScheme} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";

function App(): React.JSX.Element {
    // 正确的初始化主题方式
    theme.mode = useColorScheme() ?? "light";
    return (
        <ThemeProvider theme={theme}>
            <SafeAreaProvider>
                <Root />
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

export default App;
