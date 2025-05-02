import React from "react";
import {ThemeProvider} from "@rneui/themed";
import {theme} from "./src/js/theme.ts";
import {Root} from "./src/screens/Root.tsx";
import {useColorScheme} from "react-native";

function App(): React.JSX.Element {
    // 正确的初始化主题方式
    theme.mode = useColorScheme() ?? "light";
    return (
        <ThemeProvider theme={theme}>
            <Root />
        </ThemeProvider>
    );
}

export default App;
