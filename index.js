/**
 * @format
 */

import {AppRegistry} from "react-native";
import App from "./App";
import {name as appName} from "./app.json";
import {setJSExceptionHandler, setNativeExceptionHandler} from "react-native-exception-handler";
import {widgetTaskHandler} from "./src/widget/widget-task-handler";
import {registerWidgetTaskHandler} from "react-native-android-widget";
// 全局JS异常处理
setJSExceptionHandler((error, isFatal) => {
    console.error("Caught JS Exception: ", error, isFatal);
});

// 全局原生代码(Native)异常处理
setNativeExceptionHandler(exceptionString => {
    console.error("Caught Native Exception: ", exceptionString);
});

AppRegistry.registerComponent(appName, () => App);
registerWidgetTaskHandler(widgetTaskHandler);
