import React, {useState, useEffect, Fragment} from 'react';
import { 
    View, 
    Text,
    ScrollView, 
} from 'react-native';
import ImageComponent from '../components/ImageComponent';
import { navSubreddit } from '../redux/actions/CurrentLoggedInUser';
import FavoriteMenuComponent from '../components/FavoriteMenuComponent';
import { TouchableHighlight } from 'react-native-gesture-handler';

const FavoritesContainer = (props) => {

    const [currentIndex, setIndex] = useState(-1);
    const [full, toggleFull] = useState(false);
    const [menu, setMenu] = useState(false);
    const [imgArr, setArr] = useState([]);

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
        showMenu(false);
        if (props.images[currentIndex]){toggleView()};
        console.log("test",props.images)
    }, [imgArr])

    // useEffect(() => {
    //     setArr(props.images)
    // }, [])

    let deleteImage = (id) => {
        // console.log("testingProps: ",props.userID);
        let url = `http://d8b23e11.ngrok.io/api/v1/images/${id}`;
        let options = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                'Access-Control-Allow-Origin':'http://d8b23e11.ngrok.io'
            }
            }

        fetch(url, options)
        .then(res=>res.json())
        .then(json=>{
            // console.log(json)
            let newArr;
            if (imgArr[0]) {
                newArr = [...imgArr];
            }
            else {
                newArr = [...props.images];
            }
            newArr.splice(currentIndex,1);
            setArr(newArr)
        })
        .catch(error=>console.log(error))
    };



    let renderImages = () => {
        return (
            imgArr[0] ? 
            imgArr.map((imageData, ind)=>{
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
            :
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
        if (menu){
            return(<FavoriteMenuComponent
                deleteImage={deleteImage}
                showMenu={showMenu}
                webURL={""}
                imageID={props.images[currentIndex].id}
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
    let navigateLeftRight = (direction) => {
        // console.log("index: ",indPos, " arr: ", arr.length)
        if (currentIndex + direction < 0) { direction = 0; }
        else if (currentIndex + direction > props.images.length-1) { direction = 0;}
        setIndex(currentIndex + direction);
    }
   
    return (
        <View >
            {full ? 
                renderImage(false)
            :
            <ScrollView >
                <View style={{flex:1, flexDirection: 'row', flexWrap:'wrap', padding: '5%'}}>
                    {renderImages()}
                </View>
            </ScrollView>
            }
            {menu ? 
                renderImage(true)
            :
                null
            }
        </View>
    );
}

export default FavoritesContainer;