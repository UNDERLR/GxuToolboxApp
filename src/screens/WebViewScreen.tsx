import WebView from "react-native-webview";
import {RouteProp, useNavigation, useRoute} from "@react-navigation/native";
import {NativeStackNavigationProp} from "@react-navigation/native-stack";
import {WebViewSource} from "react-native-webview/lib/WebViewTypes";
import {useEffect} from "react";

type RootStackParamList = {
    webViewScreen: {source: WebViewSource; title: string};
};

export function WebViewScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<{webViewScreen: {source: WebViewSource; title: string}}, "webViewScreen">>();
    const {source: originalSource, title} = route.params;

    // URL 处理函数
    const processUrl = (url: string): string => {
        // 直接替换 .. 为教务系统基础路径
        return url.replace(/\.\./g, "jwxt2018.gxu.edu.cn/jwglxt");
    };

    // 处理初始 source
    const processedSource: WebViewSource =
        typeof originalSource === "object" && "uri" in originalSource
            ? {...originalSource, uri: processUrl(originalSource.uri)}
            : originalSource;

    useEffect(() => {
        navigation.setOptions({
            title: title || "内部浏览器",
        });
    }, [title]);

    // JavaScript 注入：拦截 window.open 并通过 postMessage 发送给 RN
    const injectedJavaScript = `
        (function() {
            // 重写 window.open 函数
            window.open = function(url, name, features) {
                // 通过 postMessage 发送导航请求给 React Native
                window.ReactNativeWebView.postMessage(JSON.stringify({
                    type: 'NAVIGATE',
                    url: url
                }));
                return null;
            };

            // 重写 $.openWin 函数（如果存在）
            if (typeof $ !== 'undefined') {
                $.openWin = function(url) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'NAVIGATE',
                        url: url
                    }));
                    return false;
                };
            }
        })();
        true; // 必须返回 true
    `;

    // 处理来自 WebView 的消息
    const handleMessage = (event: any) => {
        try {
            const data = JSON.parse(event.nativeEvent.data);

            if (data.type === "NAVIGATE") {
                // 使用统一的 URL 处理函数
                const processedUrl = processUrl(data.url);

                // 使用 navigation.push 创建新的 WebView 页面，支持返回功能
                navigation.push("webViewScreen", {
                    title: "",
                    source: {
                        uri: processedUrl,
                    } as WebViewSource,
                });
            }
        } catch (e) {
            console.log("WebView message parse error:", e);
        }
    };

    return (
        <WebView
            source={processedSource}
            onLoadEnd={e => {
                if (!title) {
                    navigation.setOptions({
                        title: e.nativeEvent.title,
                    });
                }
            }}
            onMessage={handleMessage}
            injectedJavaScript={injectedJavaScript}
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
