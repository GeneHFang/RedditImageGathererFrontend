import React, {useState, useEffect} from 'react';
import {
    View,
  } from 'react-native';
import ImageComponent from '../components/ImageComponent';



const ImageContainer = (props) => {
    //2 is placeholder
    let url = `https://www.reddit.com/r/${props.subreddit}/hot.json?limit=10`;

    const [arr, setArr] = useState([]);

    useEffect( () => {
        fetch(url)
        .then(res=>res.json())
        .then(json=> {
            setArr(json.data.children);
        })

    }, [])


    useEffect( () => {
        console.log(arr);
    }, [arr])





    let renderImage = () => {
        return(
        <View style={{flex:1, flexDirection: 'row', flexWrap:'wrap', padding: '5%'}}>
            {arr.map(child => {
                return <ImageComponent key={child.data.id} url={child.data.thumbnail}/>
            })}
         </View>)
    }

    return (
        <View>
        {renderImage()}
        </View>
    )
}

export default ImageContainer; 