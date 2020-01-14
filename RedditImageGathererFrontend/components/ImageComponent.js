import React, {useState} from 'react';
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
import GestureRecognizer from 'react-native-swipe-gestures';

const ImageComponent = (props) => {

    if (props.fileType){
        return (
        <View style={{width:'25%', flex:1, alignSelf:'stretch'}}>
            <TouchableOpacity onPress={() => props.toggle(null, false)}>
                <Image resizeMode='contain' style={{width: props.dimensions, height: props.dimensions }} source={{uri:props.url}} /> 
            </TouchableOpacity>
        </View>
        )
    }
    else{// console.log(props.url)
    return(
        <View style={{width: '25%'}}>
            <TouchableOpacity onPress={() => props.toggle(props.fullImg, true)}>
                <Image style={{width: props.dimensions, height: props.dimensions }} source={{uri:props.url}} /> 
            </TouchableOpacity>
        </View>
    )
    }


}

export default ImageComponent;