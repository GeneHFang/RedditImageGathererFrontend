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
  import * as FileSystem from 'expo-file-system';
  import * as MediaLibrary from 'expo-media-library';
  import AlertAsync from 'react-native-alert-async';  

const FavoriteMenuComponent = (props) => {
    let stylesheet= {
        padding:3
    }
    let hasDownloadFolder = (albumsArray) => {
        // console.log(albumsArray[0]["title"])
        let albumID = "";
        for (let i = 0 ; i < albumsArray.length; i++){
            if (albumsArray[i].title){
                if (albumsArray[i].title.toLowerCase() === "download"){
                    return albumsArray[i];
                    break;
                }
            }
        }
        return null;
    }
    
    const alertasync = async () => {
        
    }

    let save  = async () => {
        let al = ()=> {return new Promise((resolve,reject)=>{ AlertAsync('Remove from Favorites after Download?', `Selecting 'Yes' will remove this image from your Favorites`, 
        [{text:'Yes', onPress:()=>{ props.deleteAfter ? null : props.deleteAfterChange(true);
                                    resolve(true)}}, 
        {text: 'No', onPress: ()=>{ props.deleteAfter ? props.deleteAfterChange(false) : null;
                                    resolve(false)}}],
        { cancelable: false });
        });}
        // console.log(props.url)
        let resp = await al();
        MediaLibrary.requestPermissionsAsync();
        // console.log(FileSystem.documentDirectory)
        // let str = 
        // str = str.slice(0,str.length-1);
        const downloadResumable = FileSystem.createDownloadResumable(
            `${props.url}`,
            FileSystem.documentDirectory + 'image.'+ props.fileType, {})

        try {
            const { uri } = await downloadResumable.downloadAsync();
            const asset = await MediaLibrary.createAssetAsync(uri);
            //console.log(asset)
            const album = await MediaLibrary.getAlbumsAsync();
            let albumObj = await hasDownloadFolder(album);
            let finish;
            //console.log(uri)
            if (albumObj){
                let albumID = albumObj.id+"";
                MediaLibrary.addAssetsToAlbumAsync([asset],albumID,false).then(
                    Alert.alert('Download Success', `Image saved to ${albumObj.title} folder`, 
                [{text:'OK', onPress:() => {
                props.showMenu(false);}}])
                );
            }
            else {
                MediaLibrary.saveToLibraryAsync(asset.uri)
            }
            if (resp) {props.deleteImage(props.imageID)}
        }
        catch( e) {
            console.log(e)
        }

    }

    return (
        <View style={{position:'absolute', alignSelf:'center', zIndex:6, top:140, backgroundColor:'rgba(52, 52, 52, 0.6)'}}>
            <View style={{padding:10}} >
            <Button style={stylesheet} onPress={() => props.deleteImage(props.imageID)} title='Remove from Favorites'/>
            <Button style={stylesheet} onPress={save} title="Save Image to Downloads"/>
            {/* <Button style={stylesheet} onPress={() => console.log(props)} title="what's props"/> */}
            <Button style={stylesheet} onPress={()=> Linking.openURL(props.webURL)} title='Go To Thread'/>
            <ThemeProvider theme={{colors:{primary:'#FF4040'}}}>
            <Button style={stylesheet} title='Close Menu' onPress={() => props.showMenu(false)}/>
            </ThemeProvider>
            </View>
        </View>
    )

};
export default FavoriteMenuComponent;