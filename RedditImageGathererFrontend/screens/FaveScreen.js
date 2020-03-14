
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
            setURL(`http://83bc535c.ngrok.io/api/v1/users/${props.id}`);
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
                    'Access-Control-Allow-Origin':'http://83bc535c.ngrok.io'
                }
                }

            let arrindex = arr.map( image => {
                return image.id
            })

            arrindex.forEach( (id,index) => {
            let url = `http://83bc535c.ngrok.io/api/v1/images/${id}`;
    
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
        let resp = await MediaLibrary.requestPermissionsAsync(); 
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
        
        
        // console.log('album id is', albumID);


        // let assets = arr.map((image, index) => {
            try{
            for (let i = 0 ; i < arr.length; i++){
            let download =  FileSystem.createDownloadResumable(
                `${arr[i].url}`,
            FileSystem.documentDirectory + '.'+ arr[i]['file_type'], {})
            
            let { uri } = await download.downloadAsync();
            let asse = await MediaLibrary.createAssetAsync(uri);
            let alb = await MediaLibrary.getAlbumsAsync();   
            let alObj = await hasDownloadFolder(alb);
            if (alObj){
                console.log("here")
                let albumID = alObj.id+"";
                MediaLibrary.addAssetsToAlbumAsync([asse],albumID,false)
                .then((value)=>console.log("success: ",value))
            }
        }
        }
            // asset = await 
            // await 
            // console.log(uri, asset)
            
            //   return asset
            // }
        // });
        // try {
        //     await Promise.all(assets);
        //     console.log("this is assets",assets)
        //     let downloads = assets.map((asset) => {
        //         asset.downloadAsync().then(async (value)=>{
        //         console.log(value.uri)
        //         let x = await MediaLibrary.createAssetAsync(value.uri+"")
        //         //Commented before
        //         // .then((value)=>{
        //         //     // console.log(value)
        //         //     // assetArray.push(value)
        //         //     return value
                    
        //         // });End commented before
        //         console.log(x);
        //         return x
        //     });
        //     });
        //     console.log("this is downloads",downloads)
        //     try {
        //     await Promise.all(downloads);
        //     albumObj = await hasDownloadFolder(album);
        //     albumID = albumObj.id+"";

            
        //     let stati = assetArray.map((asset) => {
        //         MediaLibrary.createAssetAsync([asset],albumObj,false).then(value=>{
        //             return value
        //         })
        //     })
            
        //      await
        //      Promise.all(
        //         stati
        //      ).then(()=>
           
        //         {Alert.alert('Download Success', `Images saved to download folder`, 
        //                     [{text:'OK', onPress:() => {
        //                         assetArray=[];
        //                         }}])}
        //     )
        //     }
        //     catch(error){
        //         console.log(error)
        //     }
        // }
        catch(error){
            console.log(error)
        }
        finally{
            Alert.alert('Download Success', `Images saved to download folder`);
            if (flag) {
                deleteAll()
            }
        }

        // setTimeout(async () => {
        // console.log(assetArray)
    // },4000);
    

       
        
        
        


    }



    return (
        <View style={{backgroundColor:(props.navigation.getParam('dark') ? '#353C51' : 'white'), flex:1, resizeMode:'cover'}}>
            <Button title="Download All Favorites" onPress={()=>{
                downloadAll();
                }}/>
            <Text style={{alignSelf:'center', padding:5, color:(props.navigation.getParam('dark')? 'white':'black')}}>{`Your Favorites:`}</Text>
            <FavoritesContainer 
                dark={props.navigation.getParam('dark')} 
                images={arr}
                updateImages={setArr}
            />
        </View>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(FaveScreen);