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
    Alert
  } from 'react-native';
  import { Linking } from 'expo';
  import { Button, ThemeProvider } from 'react-native-elements';

const FavoriteMenuComponent = (props) => {
    let stylesheet= {
        padding:3
    }

    return (
        <View style={{position:'absolute', alignSelf:'center', zIndex:6, top:140, backgroundColor:'rgba(52, 52, 52, 0.6)'}}>
            <View style={{padding:10}} >
            <Button style={stylesheet} onPress={() => props.deleteImage(props.imageID)} title='Remove from Favorites'/>
            <Button style={stylesheet} disabled onPress={()=> Linking.openURL(props.webURL)} title='Go To Thread'/>
            <ThemeProvider theme={{colors:{primary:'#FF4040'}}}>
            <Button style={stylesheet} title='Close Menu' onPress={() => props.showMenu(false)}/>
            </ThemeProvider>
            </View>
        </View>
    )

};
export default FavoriteMenuComponent;