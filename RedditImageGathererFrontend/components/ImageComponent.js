import React, {useState} from 'react';
import {
    Image,
    Platform,
    AsyncStorage,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableHighlight,
    View,
    Alert,
  } from 'react-native';

import { Button, ThemeProvider} from 'react-native-elements';
import GestureRecognizer from 'react-native-swipe-gestures';

const ImageComponent = (props) => {
// onSwipeDown={() => props.saveImageURL(props.url,props.fileType)}
    // if (!props.nsfw) {
    //     console.log(props.url)
    // }
    if (props.fileType){

        return (
            <GestureRecognizer 
                onSwipeUp={() => props.toggle(null, false)}
                onSwipeDown={() => props.toggle(null, false)}
                onSwipeRight={() => props.nextOrPrev(-1)}
                onSwipeLeft={() => props.nextOrPrev(1)}
                
            >
            <ThemeProvider theme={{colors:{primary:'#FFF'}}}>
                <TouchableOpacity onLongPress={() => props.showMenu(true)}>
                <View style={{width:'25%', flex:1, alignSelf:'stretch'}}  style={{height:500}}>
                {/* <Text>Hello!</Text> */}
                    <Image resizeMode='contain' style={{width: props.dimensions, height: props.dimensions }} source={{uri:props.url}} /> 
                
                </View>
                {/* <Button title="Pressable?"/> */}
                </TouchableOpacity>
          {/* <Button  /> */}
          </ThemeProvider>
            </GestureRecognizer>
        )
    }
    else{// console.log(props.url)
    return(
        <View style={{width: '25%', zIndex:1}}>
            <TouchableOpacity onPress={() => props.toggle(props.fullImg, true, props.index)}>
                <Image style={{width: props.dimensions, height: props.dimensions }} source={props.nsfw? require('../assets/images/nsfw.png'): {uri:props.url}} /> 
            </TouchableOpacity>
        </View>
    )
    }


}

export default ImageComponent;