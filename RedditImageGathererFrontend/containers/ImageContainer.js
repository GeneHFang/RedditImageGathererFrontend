import React, {useState, useEffect} from 'react';
import {
    View, Button, Alert
  } from 'react-native';
import ImageComponent from '../components/ImageComponent';
import ImageMenuComponent from '../components/ImageMenuComponent';



const ImageContainer = (props) => {
    //2 is placeholder
    const [url, setURL] = useState(`https://www.reddit.com/r/${props.subreddit}/hot.json?limit=50`)
    

    const [arr, setArr] = useState([]);
    const [full, toggleFull] = useState(false);
    const [img, setImg] = useState({
        url: "",
        type: ""
    });
    const [indPos, setInd] = useState(-1);

    const [menu, setMenu] = useState(false);

    let toggleChange = (url, toggleTrue, index) => {
        // console.log(e)
        toggleFull(!full);
        

        if (toggleTrue){
            props.toggleScroll('false');
            setInd(index);
            // let arr = url.split('?')[0].split('.');
            // let parsedURL = url.replace('amp;','');
            // setImg({
            //     url: parsedURL,
            //     type: arr[arr.length-1]
            // });
        }
        else{
            props.toggleScroll('true');
        }
    }
    let navigateLeftRight = (direction) => {
        // console.log("index: ",indPos, " arr: ", arr.length)
        if (indPos + direction < 0) { direction = 0; }
        else if (indPos + direction > arr.length-1) { direction = 0;}
        else{ if (menu){setMenu(false)} }
        setInd(indPos + direction);
    }
    let saveImageURL = (imgURL, fileType, subreddit, nsfw, upvotes, webURL) => {
        // console.log("testingProps: ",props.userID);
        let url = 'http://7f24f26f.ngrok.io/api/v1/images';
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Access-Control-Allow-Origin':'http://7f24f26f.ngrok.io'
            },
            body: JSON.stringify({"image":{
                url: imgURL,
                'file_type': fileType,
                'user_id': props.userID,
                'subreddit_name': subreddit,
                'nsfw': nsfw,
                'upvotes': upvotes,
                'web_url':webURL
            }})}
        

        fetch(url, options)
        .then(res=>res.json())
        .then(json=>{
            console.log(json);
            if (json.data) {
                Alert.alert('Success', `Image added to your Favorites`, [{text:'OK', onPress:() => setMenu(false)}])
            }
            else if (json.url) {
                Alert.alert('Error', 'Image already exists in your favorites!', [{text:'OK'}] )
            }
        })
        .catch(error=>{
            console.log(error);
            Alert.alert('Failure', error, [{text:'OK', onPress:() => {}}])
        })
    };
    let showMenu = (boolVal) => {
        setMenu(boolVal);
    };

    useEffect( () => {
        // console.log("rerendeing",props)
        // setArr([]);
        setURL(`https://www.reddit.com/r/${props.subreddit}/hot.json?limit=50`)
        // console.log(url);
        

    }, [props]);




    useEffect( () => {
        // console.log(arr);
        fetch(url)
        .then(res=>res.json())
        .then(json=> {
            setArr(json.data.children.filter(child=> child.data['post_hint']==='image'));
        })
    }, [url]);

    // useEffect( () =>
    //     console.log(img," and ",full),
    //     [img,full]);

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
    };

    let renderImage = (menu) => {
        // console.log('gothereeeee')
        // console.log(arr)
        let child = arr[indPos];
        let url = child.data.preview.images[0].source.url;
        let fullURL = `https://m.reddit.com${child.data.permalink}`
        let type = url.split('?')[0].split('.');
        type = type[type.length-1];
        let parsedURL = url.replace('amp;','');
        if(menu){
            return(<ImageMenuComponent 
                    showMenu={showMenu}        
                    saveImageURL={saveImageURL}
                    webURL={fullURL}
                    subredditName={child.data.subreddit}
                    nsfw={child.data["over_18"]}
                    upvotes={child.data.ups}
                    url={parsedURL} 
                    fileType={type}    
                    />
            )
        }
        else{
            return(
            <ImageComponent 
                url={parsedURL} 
                fileType={type}
                dimensions={400}
                toggle={toggleChange}
                nextOrPrev={navigateLeftRight}
                showMenu={showMenu}
            />
        )}
    };

    return (
        <View>
        {full 
            ? arr[0] ? renderImage(false)   : null  
            :
            arr[0] ? renderImages() : null
            }
            {menu ? 
                renderImage(true)
                : null}
        </View>
    );
}

export default ImageContainer; 