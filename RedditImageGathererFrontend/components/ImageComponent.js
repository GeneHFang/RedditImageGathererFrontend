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
            <GestureRecognizer 
                onSwipeUp={() => props.toggle(null, false)}
                onSwipeRight={() => props.nextOrPrev(-1)}
                onSwipeLeft={() => props.nextOrPrev(1)}
                onSwipeDown={() => props.saveImageURL(props.url,props.fileType)}
            >
                <View style={{width:'25%', flex:1, alignSelf:'stretch'}}>
                    <Image resizeMode='contain' style={{width: props.dimensions, height: props.dimensions }} source={{uri:props.url}} /> 
                
                </View>
            </GestureRecognizer>
        )
    }
    else{// console.log(props.url)
    return(
        <View style={{width: '25%'}}>
            <TouchableOpacity onPress={() => props.toggle(props.fullImg, true, props.index)}>
                <Image style={{width: props.dimensions, height: props.dimensions }} source={{uri:props.url}} /> 
            </TouchableOpacity>
        </View>
    )
    }


}

export default ImageComponent;