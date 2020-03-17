import React, {useState, useEffect} from 'react';
import {
    View, Button, Alert, ScrollView, RefreshControl
  } from 'react-native';
import ImageComponent from '../components/ImageComponent';
import ImageMenuComponent from '../components/ImageMenuComponent';
import {connect} from 'react-redux';

import {
    saveLastPage
} from '../redux/actions/CurrentLoggedInUser';

const mapDispatchToProps = {
    saveLastPage,
}

const mapStateToProps = (state) => {
    // console.log("State: ",state)
    return ({
      nsfw: state.second.nsfw,
      page: state.second.page,
      lastPage: state.second.fiftiethPage,
    })
  }

const ImageContainer = (props) => {

    //still need logic for after page 2
    const getURL = () => {
        if (props.page === 0){
            props.saveLastPage("");
            setURL(`https://www.reddit.com/r/${props.subreddit}/hot.json?limit=50`)
        }
        else{
            fetch(`https://www.reddit.com/r/${props.subreddit}/hot.json?limit=50`)
                .then(res => res.json())
                .then(json => {
                    props.saveLastPage(json.data.children[json.data.dist-1].data.name);
                })
        }
    }

    useEffect( () => {
        if (props.fiftiethPage !== ""){
            setURL(`https://www.reddit.com/r/${props.subreddit}/hot.json?limit=50&after=${props.fiftiethPage}`)
        }
        
    }, [props.fiftiethPage])

    //2 is placeholder
    const [url, setURL] = useState("");

    
    const [refreshing, setRefresh] = useState(false);
    const [arr, setArr] = useState([]);
    const [full, toggleFull] = useState(false);
    const [img, setImg] = useState({
        url: "",
        type: ""
    });
    const [indPos, setInd] = useState(-1);

    const [menu, setMenu] = useState(false);

    useEffect(()=>{
        getURL();
    },[props.page]);

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
        // console.log("testing all: ",imgURL, );
        let url = 'http://83bc535c.ngrok.io/api/v1/images';
        let options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Access-Control-Allow-Origin':'http://83bc535c.ngrok.io'
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
            // console.log(json);
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
        if (props.top){
            setURL(`https://www.reddit.com/r/${props.subreddit}/top.json?limit=100&t=${props.range}`)
        }
        else{
            setURL(`https://www.reddit.com/r/${props.subreddit}/hot.json?limit=100`)
        }
        // console.log(url);
        

    }, [props]);
    useEffect(()=>{
        setRefresh(false);
    },[arr])

    
    let refetch = ()=>{
        fetch(url)
        .then(res=>res.json())
        .then(json=> {
            setRefresh(true)
            setArr(json.data.children.filter(child=> {
                return child.data['post_hint']==='image'||child.data['post_hint']==='rich:video'
            }))
        })
    }



    useEffect( () => {
        // console.log(arr);
        fetch(url)
        .then(res=>res.json())
        .then(json=> {
            setArr(json.data.children.filter(child=> {
                // console.log(child.data.thumbnail)
                return child.data['post_hint']==='image' || child.data['post_hint']==='rich:video'
            }));
        })
    }, [url]);

    // useEffect( () =>
    //     console.log(img," and ",full),
    //     [img,full]);

    let renderImages = () => {
        return(
        <ScrollView
            style={
                {
                    flex: 1,
                    marginBottom: 60,
                    marginTop:20
                }
            }
            scrollable
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={refetch}/>
            } >
        <View style={{flex:1, flexDirection: 'row', flexWrap:'wrap', padding: '5%'}}>
            {arr.map((child,ind) => {
                let thumbURL = ""
                {/* console.log(child.data['post_hint']) */}
                if(child.data['post_hint'] === 'image' || child.data['post_hint'] === 'rich:video') {
                    {/* console.log(child.data.thumbnail) */}
                    let urlFull = ""
                    if (child.data.preview.images[0].variants.gif){
                        urlFull = child.data.preview.images[0].variants.gif.source.url;
                    }
                    else {
                        urlFull = child.data.preview.images[0].source.url;
                    }
                    if (props.nsfw) {
                        if (child.data.thumbnail === 'nsfw')
                        {
                            let url = child.data.preview.images[0].resolutions[0].url;
                            let type = url.split('?')[0].split('.');
                            type = type[type.length-1];
                            let parsedURL = url.replace(/amp;/g,'');
                            {/* console.log(parsedURL) */}
                            thumbURL = parsedURL;
                        }
                        else {
                            thumbURL = child.data.thumbnail
                        }
                    }
                    else {
                        thumbURL = child.data.thumbnail
                    }
                    return(<ImageComponent 
                    key={child.data.id}
                    index={ind} 
                    nsfw={props.nsfw ? false : child.data.thumbnail === 'nsfw'}
                    url={thumbURL} 
                    fullImg={urlFull}
                    dimensions={100}
                    toggle={toggleChange}
                    />)
                }
            })}
         </View>
         </ScrollView>)
    };

    let renderImage = (menu) => {
        // console.log('gothereeeee')
        // console.log(arr)
        let child = arr[indPos];
        let url =''
        if (child.data.preview.images[0].variants.gif){
            url = child.data.preview.images[0].variants.gif.source.url
        }
        else{
           url = child.data.preview.images[0].source.url;
        }
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
        <View style={props.dark ? {backgroundColor:'#353C51'} : {backgroundColor:'white'}}>
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

export default connect(mapStateToProps, mapDispatchToProps)(ImageContainer); 