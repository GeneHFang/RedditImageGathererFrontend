import React from 'react';
import {
    Image,
    Platform,
    AsyncStorage,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Alert,
  } from 'react-native';

import { Button } from 'react-native-elements';

const ImageComponent = (props) => {
    console.log(props.url)
    return(
        <View style={{width: '25%'}}>
        <TouchableOpacity >
            <Image style={{width: 100, height: 100 }} source={{uri:props.url}} /> 
        </TouchableOpacity>
        </View>
    )


}

export default ImageComponent;