import {useNavigation} from "@react-navigation/native";
import {WebViewSource} from "react-native-webview/lib/WebViewTypes";

export function useWebView() {
    const navigation = useNavigation();
    function openInWeb(title: string, opt: WebViewSource) {
        navigation.navigate("webViewScreen", {
            title,
            source: opt,
        });
    }
    return {
        openInWeb,
    };
}
