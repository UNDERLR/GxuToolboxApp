import React, {useMemo} from "react";
import {ThemeProvider} from "@rneui/themed";
import {theme} from "./src/js/theme.ts";
import {Root} from "./src/screens/Root.tsx";
import {useColorScheme} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";

function App(): React.JSX.Element {
    const colorScheme = useColorScheme();

    const currentTheme = useMemo(
        () => ({
            ...theme,
            mode: colorScheme ?? "light",
        }),
        [colorScheme],
    );

    return (
        <ThemeProvider theme={currentTheme}>
            <SafeAreaProvider>
                <Root />
            </SafeAreaProvider>
        </ThemeProvider>
    );
}

export default App;
