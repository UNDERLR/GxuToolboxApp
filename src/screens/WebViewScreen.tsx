import WebView from "react-native-webview";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {WebViewSource} from "react-native-webview/lib/WebViewTypes";
import {useEffect} from "react";

export function WebViewScreen() {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<{webViewScreen: {source: WebViewSource; title: string}}, "webViewScreen">>();
    const {source, title} = route.params;
    useEffect(() => {
        navigation.setOptions({
            title: title ?? "内部浏览器",
        });
    }, [title]);
    return (
        <WebView
            source={source}
            onLoadEnd={e => {
                if (!title) {
                    navigation.setOptions({
                        title: e.nativeEvent.title,
                    });
                }
            }}
        />
    );
}
