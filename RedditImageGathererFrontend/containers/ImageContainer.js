import React, {useState, useEffect} from 'react';
import {
    View,
  } from 'react-native';
import ImageComponent from '../components/ImageComponent';



const ImageContainer = (props) => {
    //2 is placeholder
    let url = `https://www.reddit.com/r/${props.subreddit}/hot.json?limit=10`;

    const [arr, setArr] = useState([]);
    const [full, toggleFull] = useState(false);
    const [img, setImg] = useState({
        url: "",
        type: ""
    })

    let toggleChange = (url, toggleTrue) => {
        // console.log(e)
        toggleFull(!full);

        if (toggleTrue){
            let arr = url.split('?')[0].split('.');
            let parsedURL = url.replace('amp;','');
            setImg({
                url: parsedURL,
                type: arr[arr.length-1]
            })
        }
    }

    useEffect( () => {
        fetch(url)
        .then(res=>res.json())
        .then(json=> {
            setArr(json.data.children);
        })

    }, []);


    useEffect( () => {
        // console.log(arr);
    }, [arr]);

    useEffect( () =>
        console.log(img," and ",full),
        [img,full]);





    let renderImage = () => {
        return(
        <View style={{flex:1, flexDirection: 'row', flexWrap:'wrap', padding: '5%'}}>
            {arr.map(child => {
                return <ImageComponent 
                    key={child.data.id} 
                    url={child.data.thumbnail} 
                    fullImg={child.data.preview.images[0].source.url}
                    dimensions={100}
                    toggle={toggleChange}
                    />
            })}
         </View>)
    }

    return (
        <View>
        {full 
            ? <ImageComponent url={img.url} fileType={img.type} dimensions={400} toggle={toggleChange}/>
            :renderImage()}
        </View>
    )
}

export default ImageContainer; 