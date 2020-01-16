
import React, {useState, useEffect} from 'react';
import { View, Text, AsyncStorage, Button } from 'react-native';
import {connect} from 'react-redux';
import { assignUser } from '../redux/actions/CurrentLoggedInUser';
import FavoritesContainer from '../containers/FavoritesContainer';

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
            setURL(`http://d8b23e11.ngrok.io/api/v1/users/${props.id}`);
        },
        [props]
    )


    return (
        <View>
            {/* <Button title="getUser ID" onPress={console.log(props)}/> */}
            <Text style={{alignSelf:'center', padding:5}}>{`Your Favorites:`}</Text>
            <FavoritesContainer 
                images={arr}
            />
        </View>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(FaveScreen);