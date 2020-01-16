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
    if (props.fileType){

        return (
            <GestureRecognizer 
                onSwipeUp={() => props.toggle(null, false)}
                onSwipeDown={() => props.toggle(null, false)}
                onSwipeRight={() => props.nextOrPrev(-1)}
                onSwipeLeft={() => props.nextOrPrev(1)}
                
            >
            <ThemeProvider theme={{colors:{primary:'#FFF'}}}>
                <TouchableHighlight >
                <View style={{width:'25%', flex:1, alignSelf:'stretch'}}>
                {/* <Text>Hello!</Text> */}
                    <Image resizeMode='contain' style={{width: props.dimensions, height: props.dimensions }} source={{uri:props.url}} /> 
                
                </View>
                {/* <Button title="Pressable?"/> */}
                </TouchableHighlight>
          <Button  onLongPress={() => props.showMenu(true)} style={{height:500}}/>
          </ThemeProvider>
            </GestureRecognizer>
        )
    }
    else{// console.log(props.url)
    return(
        <View style={{width: '25%', zIndex:1}}>
            <TouchableOpacity onPress={() => props.toggle(props.fullImg, true, props.index)}>
                <Image style={{width: props.dimensions, height: props.dimensions }} source={{uri:props.url}} /> 
            </TouchableOpacity>
        </View>
    )
    }


}

export default ImageComponent;