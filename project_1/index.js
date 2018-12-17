/** @format */

import {AppRegistry, Dimensions} from 'react-native';
import App from './src';
import {name as appName} from './app.json';
import EStyleSheet from 'react-native-extended-stylesheet';
getRem = () => {
    if(Dimensions.get('window').width > 500) {
        return 14
    }

    return 10
}
EStyleSheet.build({
    $rem: getRem()
});
AppRegistry.registerComponent(appName, () => App);
