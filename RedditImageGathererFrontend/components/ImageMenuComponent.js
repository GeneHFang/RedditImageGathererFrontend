import React, {useState} from 'react';
import {
    Image,
    Platform,
    CameraRoll,
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
  import {Asset} from 'expo-asset';
//   import RNFetchBlob from 'rn-fetch-blob';
  

const ImageMenuComponent = (props) => {
    let stylesheet= {
        padding:3
    }
    let hasDownloadFolder = (albumsArray) => {
        // console.log(albumsArray[0]["title"])
        for (let i = 0 ; i < albumsArray.length; i++){
            if (albumsArray[i].title){
                if (albumsArray[i].title.toLowerCase() === "download"){
                    return albumsArray[i];
                }
            }
        }
        return null;
    }

    let save  = async () => {
        console.log(props.url)
        MediaLibrary.requestPermissionsAsync();
        const downloadResumable = FileSystem.createDownloadResumable(
            `${props.url}`,
            FileSystem.documentDirectory + '.'+ props.fileType, {})

        try {
            const { uri } = await downloadResumable.downloadAsync();
            const asset = await MediaLibrary.createAssetAsync(uri);
            const album = await MediaLibrary.getAlbumsAsync();
            let albumObj = await hasDownloadFolder(album);
            let finish;
            // console.log(uri)
            if (albumObj){
                let albumID = albumObj.id+"";
                finish = await MediaLibrary.addAssetsToAlbumAsync([asset],albumID,false); 
            }
            else {
                MediaLibrary.saveToLibraryAsync(asset.uri)
            }
            Alert.alert('Download Success', `Image saved to ${albumObj.title} folder`, [{text:'OK', onPress:() => props.showMenu(false)}])
        }
        catch( e) {
            console.log(e)
        }

    }

   
    
    let fileName = props.url.split(`.${props.fileType}`)[0].split('it/')[1];
    // <Button style={stylesheet} onPress={onDownload} title='Download Image'/>
    
    return (
        <View style={{position:'absolute', alignSelf:'center', zIndex:6, top:140, backgroundColor:'rgba(52, 52, 52, 0.6)'}}>
            <View style={{padding:10}} >
            <Button style={stylesheet} 
                    onPress={() => props.saveImageURL(
                        props.url,
                        props.fileType,
                        props.subredditName,
                        props.nsfw,
                        props.upvotes,
                        props.webURL
                        )} 
                    title='Favorite This Image'/>
            <Button style={stylesheet} onPress={save} title="Save Image to Downloads"/> 
            <Button style={stylesheet} onPress={()=> Linking.openURL(props.webURL)} title='Go To Thread'/>
            <ThemeProvider theme={{colors:{primary:'#FF4040'}}}>
            <Button style={stylesheet} title='Close Menu' onPress={() => props.showMenu(false)}/>
            </ThemeProvider>
            </View>
        </View>
    )

};

export default ImageMenuComponent;