import React, {useState, useEffect, Fragment} from 'react';
import { 
    View, 
    Text,
    ScrollView, 
    Button
} from 'react-native';
import ImageComponent from '../components/ImageComponent';
import { navSubreddit } from '../redux/actions/CurrentLoggedInUser';
import FavoriteMenuComponent from '../components/FavoriteMenuComponent';
import { TouchableHighlight } from 'react-native-gesture-handler';

const FavoritesContainer = (props) => {

    const [currentIndex, setIndex] = useState(-1);
    const [full, toggleFull] = useState(false);
    const [menu, setMenu] = useState(false);
    // const [imgArr, setArr] = useState([]);
    const [removeFaveAfterDownload, setRemoveFaveAfterDownload] = useState(false);

    let toggleView = (unused ,toggle, index) => {
        toggleFull(!full);
        if (toggle){
            setIndex(index)
        }
    }
    let showMenu = (boolVal) => {
        // console.log("happening?");
        setMenu(boolVal);
    };

    useEffect(()=>{
        // console.log("is this happening?", props.images)
        showMenu(false);
        toggleFull(false);
        // if (props.images[currentIndex]){toggleView()};
        //console.log("test means this also happened: ")
    }, [props.images])

    useEffect(() => {
        // setArr(props.images);
        //console.log("this happened!",props.images);
    }, [])

    let deleteImage = (id) => {
        // console.log("testingProps: ",props.userID);
        let url = `http://83bc535c.ngrok.io/api/v1/images/${id}`;
        let options = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Access-Control-Allow-Origin':'http://83bc535c.ngrok.io'
            }
            }

        fetch(url, options)
        .then(res=>res.json())
        .then(json=>{
            // console.log(json)
            let newArr = [...props.images];
            // newArr;
            // if (imgArr[0]) {
            //     newArr = [...imgArr];
            // }
            // else { 
            // }
            // console.log(currentIndex)
            newArr.splice(currentIndex,1);
            props.updateImages(newArr);
        })
        .catch(error=>console.log(error))
        showMenu(false);
        toggleFull(false);
        setIndex(0)
    };



    let renderImages = () => {
        // console.log(full,"thisis the arrrrrrrrrrrrrrrrr")
        return (
            // imgArr[0] ? 
            // imgArr.map((imageData, ind)=>{
            //     return (
            //         <ImageComponent                
            //             key={imageData.id+imageData["file_type"]}
            //             index={ind} 
            //             url={imageData.url} 
            //             fullImg={imageData.url}
            //             dimensions={100}
            //             toggle={toggleView}
            //         />
            //     )
            // })
            // :
            props.images.map((imageData, ind)=>{
                return (
                    <ImageComponent                
                        key={imageData.id+imageData["file_type"]}
                        index={ind} 
                        url={imageData.url} 
                        fullImg={imageData.url}
                        dimensions={100}
                        toggle={toggleView}
                    />
                )
            })
        )
    }

    let renderImage = (menu) => {
        if (props.images[0]){
        if (menu){
            return(<FavoriteMenuComponent
                deleteImage={deleteImage}
                showMenu={showMenu}
                webURL={props.images[currentIndex]["web_url"]}
                imageID={props.images[currentIndex].id}
                deleteAfter={removeFaveAfterDownload}
                deleteAfterChange={setRemoveFaveAfterDownload}
                url={props.images[currentIndex].url}
                fileType={props.images[currentIndex]['file_type']}
                />
            )
        }
        else{
        return (
            <Fragment>
            <ImageComponent 
                url={props.images[currentIndex].url}
                dimensions={400}
                toggle={toggleView}
                nextOrPrev={navigateLeftRight}
                fileType={true}
                showMenu={showMenu}
            />
            </Fragment>
        )
        }
     }
    }
    let navigateLeftRight = (direction) => {
        // console.log("index: ",indPos, " arr: ", arr.length)
        if (currentIndex + direction < 0) { direction = 0; }
        else if (currentIndex + direction > props.images.length-1) { direction = 0;}
        setIndex(currentIndex + direction);
    }
   
    return (
        <View >
            {/* <Button title="What are my props" onPress={()=>console.log(props, currentIndex, full)}/> */}
            {props.images[0] ? 
            (full ? 
                renderImage(false)
                
            :
            <ScrollView >
                <View style={{flex:1, flexDirection: 'row', flexWrap:'wrap', padding: '5%'}}>
                    {renderImages()}
                </View>
            </ScrollView>
            )
            :
            <Text style={{alignSelf:'center', color:(props.dark ? 'white':'black')}}>{"Uh oh, you don't have any favorites!\n Go browse and add some Favorites!"}</Text>}
            {menu ? 
                renderImage(true)
                :
                null}
        </View>
    );
}

export default FavoritesContainer;