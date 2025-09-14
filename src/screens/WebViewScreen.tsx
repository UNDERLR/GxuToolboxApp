import WebView from "react-native-webview";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {WebViewSource} from "react-native-webview/lib/WebViewTypes";
import {useEffect} from "react";
import {Alert} from "react-native";

type RootStackParamList = {
    webViewScreen: {source: WebViewSource; title: string};
};

export function WebViewScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<{webViewScreen: {source: WebViewSource; title: string}}, "webViewScreen">>();
    const {source: originalSource, title} = route.params;

    useEffect(() => {
        navigation.setOptions({
            title: title || "内部浏览器",
        });
    }, [title]);

    return (
        <WebView
            source={originalSource}
            onLoadEnd={e => {
                if (!title) {
                    navigation.setOptions({
                        title: e.nativeEvent.title,
                    });
                }
            }}
            onOpenWindow={e => {
                // 使用 navigation.push 创建新的 WebView 页面，支持返回功能
                navigation.push("webViewScreen", {
                    title: "",
                    source: {
                        uri: e.nativeEvent.targetUrl,
                    } as WebViewSource,
                });
            }}
            startInLoadingState={true}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsBackForwardNavigationGestures={true}
            allowsLinkPreview={false}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            scalesPageToFit={true}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />
    );
}
