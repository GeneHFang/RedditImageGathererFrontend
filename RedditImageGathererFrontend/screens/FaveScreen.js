
import React, {useState, useEffect} from 'react';
import { View, Text, AsyncStorage, Button, Alert } from 'react-native';
import {connect} from 'react-redux';
import { assignUser } from '../redux/actions/CurrentLoggedInUser';
import FavoritesContainer from '../containers/FavoritesContainer';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import AlertAsync from 'react-native-alert-async';

const mapDispatchToProps = {
    assignUser
  }
  const mapStateToProps = (state) => {
    // console.log("State: ",state)
    return ({
      increment: state.first.increment,
      id: state.second.id,
      subreddit: state.second.subreddit
    })
  }

const FaveScreen = (props) => { 

    
    const [arr, setArr] = useState([])
    const [url, setURL] = useState('')
    useEffect(
        () => {
            fetch(url)
            .then(res=>res.json())
            .then(jsonData=>{
                setArr(jsonData.data.attributes.images);
            })
            .catch(error=>{})
        }
        ,
        [url]
    )

    useEffect(
        ()=> {
            setURL(`http://7f24f26f.ngrok.io/api/v1/users/${props.id}`);
        },
        [props]
    )

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

    let deleteAll = async () => {
            // console.log("testingProps: ",props.userID);
            
            let options = {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    'Access-Control-Allow-Origin':'http://7f24f26f.ngrok.io'
                }
                }

            let arrindex = arr.map( image => {
                return image.id
            })

            arrindex.forEach( (id,index) => {
            let url = `http://7f24f26f.ngrok.io/api/v1/images/${id}`;
    
            fetch(url, options)
            .then(res=>res.json())
            .then(json=>{
                // console.log(json)
            })
            .catch(error=>{
                console.log(error);
                return("");
            })
        });
        setArr([])
        
    } 

   
    // let download = async () => {return (new Promise(async (resolve)=>{
            
            

    //         // console.log(album, "\n", albumObj, '\n')
    //         try {
            
        

    

    let downloadAll = async () => {
        if (arr.length < 1) {
            AlertAsync("You don't have any favorited images!");
            return("")
        }
        let flag = false;
        MediaLibrary.requestPermissionsAsync(); 
        await AlertAsync('Remove images from Favorites after Download?', `Selecting 'Yes' will remove all images from your Favorites after successful download`, 
            [{text:'Yes', onPress:()=>{ flag = true;
                                        Promise.resolve('YES')}}, 
            {text: 'No', onPress: ()=>{ Promise.resolve('YES')}}],
            { cancelable: false });

        let albumObj = null;
        let assetArray = [];
        let albumID = null;
        let asset = null;
        const album = await MediaLibrary.getAlbumsAsync();
        albumObj = await hasDownloadFolder(album);
        albumID = albumObj.id+"";


        arr.forEach((image, index) => {
            const downloadResumable = FileSystem.createDownloadResumable(
            `${image.url}`,
            FileSystem.documentDirectory + '.'+ image['file_type'], {})
            downloadResumable.downloadAsync().then(value=>{
                console.log(value.uri)
                MediaLibrary.createAssetAsync(value.uri).then((value)=>{
                    console.log(value)
                    assetArray.push(value)
                });
            });
            
            // asset = await 
            // await 
            // console.log(uri, asset)
            
            //   return asset
            
        });

        setTimeout(async () => {
        console.log(assetArray)
        MediaLibrary.addAssetsToAlbumAsync(assetArray,albumID,false).then(() => {
        
            assetArray = [];
            let pr = new Promise( (resolve, reject) => {
                Alert.alert('Download Success', `Images saved to download folder`, 
                    [{text:'OK', onPress:() => {
                        resolve(true);
                        }}])
            })
    
           
    
                pr.then((value=>{
                    if (flag && value) {
                        deleteAll();
                    }
                }))
        })},4000);
    

       
        
        
        


    }



    return (
        <View>
            <Button title="Download All Favorites" onPress={downloadAll}/>
            <Text style={{alignSelf:'center', padding:5}}>{`Your Favorites:`}</Text>
            <FavoritesContainer 
                images={arr}
                updateImages={setArr}
            />
        </View>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(FaveScreen);