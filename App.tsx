import React from "react";
import {StatusBar, useColorScheme, View} from "react-native";

import {Colors} from "react-native/Libraries/NewAppScreen";
import {NavigationContainer} from "@react-navigation/native";
import {RootStack} from "./src/route/RootStack.tsx";
import {ThemeProvider} from "@rneui/themed";
import {theme} from "./src/js/theme.ts";

function App(): React.JSX.Element {
    const isDarkMode = useColorScheme() === "dark";
    const backgroundStyle = {
        flex: 1,
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };
    return (
        <ThemeProvider theme={theme}>
            <View style={backgroundStyle}>
                <StatusBar
                    barStyle={isDarkMode ? "light-content" : "dark-content"}
                    backgroundColor={backgroundStyle.backgroundColor}
                />
                <NavigationContainer>
                    <RootStack />
                </NavigationContainer>
            </View>
        </ThemeProvider>
    );
}

export default App;
