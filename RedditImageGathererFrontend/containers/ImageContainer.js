import React, {useState, useEffect} from 'react';
import {
    View,
  } from 'react-native';
import ImageComponent from '../components/ImageComponent';



const ImageContainer = (props) => {
    //2 is placeholder
    let url = `https://www.reddit.com/r/${props.subreddit}/hot.json?limit=50`;

    const [arr, setArr] = useState([]);
    const [full, toggleFull] = useState(false);
    const [img, setImg] = useState({
        url: "",
        type: ""
    });
    const [indPos, setInd] = useState(-1);

    let toggleChange = (url, toggleTrue, index) => {
        // console.log(e)
        toggleFull(!full);
        

        if (toggleTrue){
            props.toggleScroll('false');
            setInd(index);
            let arr = url.split('?')[0].split('.');
            let parsedURL = url.replace('amp;','');
            setImg({
                url: parsedURL,
                type: arr[arr.length-1]
            });
        }
        else{
            props.toggleScroll('true');
        }
    }
    let navigateLeftRight = (direction) => {
        // console.log("index: ",indPos, " arr: ", arr.length)
        if (indPos + direction < 0) { direction = 0; }
        else if (indPos + direction > arr.length-1) { direction = 0;}
        setInd(indPos + direction);
    }
    let saveImageURL = (imgURL, fileType) => {
        console.log("testingProps: ",props.userID);
        let url = 'http://localhost:3000/api/v1/images';
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Access-Control-Allow-Origin':'http://localhost:3000'
            },
            body: JSON.stringify({"image":{
                url: imgURL,
                'file_type': fileType,
                'user_id': props.userID
            }})}
        

        fetch(url, options)
        .then(res=>res.json())
        .then(json=>{
            console.log(json)
        })
        .catch(error=>console.log(error))

    }

    useEffect( () => {
        setArr([]);
        fetch(url)
        .then(res=>res.json())
        .then(json=> {
            
            setArr(json.data.children.filter(child=> child.data['post_hint']==='image'));
        })

    }, []);


    useEffect( () => {
        // console.log(arr);
    }, [arr]);

    useEffect( () =>
        console.log(img," and ",full),
        [img,full]);





    let renderImages = () => {
        return(
        <View style={{flex:1, flexDirection: 'row', flexWrap:'wrap', padding: '5%'}}>
            {arr.map((child,ind) => {
                if(child.data['post_hint'] === 'image') {
                    return(<ImageComponent 
                    key={child.data.id}
                    index={ind} 
                    url={child.data.thumbnail} 
                    fullImg={child.data.preview.images[0].source.url}
                    dimensions={100}
                    toggle={toggleChange}
                    />)
                }
            })}
         </View>)
    }

    let renderImage = () => {
        
        let child = arr[indPos];
        let url = child.data.preview.images[0].source.url;
        let type = url.split('?')[0].split('.');
        type = type[type.length-1];
        let parsedURL = url.replace('amp;','');
        return(
            <ImageComponent 
                url={parsedURL} 
                fileType={type}
                dimensions={400}
                toggle={toggleChange}
                nextOrPrev={navigateLeftRight}
                saveImageURL={saveImageURL}
            />
        )
    }

    return (
        <View>
        {full 
            ?renderImage()   
            :renderImages()}
        </View>
    )
}

export default ImageContainer; 