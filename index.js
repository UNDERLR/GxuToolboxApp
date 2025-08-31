/**
 * @format
 */

import {AppRegistry, Alert} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {setJSExceptionHandler, setNativeExceptionHandler} from 'react-native-exception-handler';

// 全局JS异常处理
setJSExceptionHandler((error, isFatal) => {
    console.log('Caught JS Exception: ', error, isFatal);
    Alert.alert(
        '发生意外错误',
        `
        错误: ${isFatal ? '致命错误' : '普通错误'}\n\n${error.name}: ${error.message}
        `,
        [{text: '好的'}]
    );
});

// 全局原生代码(Native)异常处理
setNativeExceptionHandler(exceptionString => {
    console.log('Caught Native Exception: ', exceptionString);
    Alert.alert(
        '发生严重错误',
        `应用遇到无法恢复的错误，即将退出。\n\n错误信息: \n${exceptionString}`,
        [{text: '好的'}]
    );
});

AppRegistry.registerComponent(appName, () => App);
