
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');
const isTablet = width > 460;
const getCardPadding = () => {
    if(isTablet) return 30;

    return 30
};

export {getCardPadding};