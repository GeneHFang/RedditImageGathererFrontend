import * as WebBrowser from 'expo-web-browser';
import React, {useState, useEffect, Fragment} from 'react';
import {
  Image,
  Dimensions,
  Platform,
  AsyncStorage,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Keyboard,
  Picker,
  View,
  Alert,
  Switch,
  RefreshControl,
} from 'react-native';
import { Button, ThemeProvider, Header } from 'react-native-elements';
import { incrementTest } from '../redux/actions/TestAction';
import { logoutUser, assignUser, navSubreddit, toggleNSFW } from '../redux/actions/CurrentLoggedInUser';
import {connect} from 'react-redux';
import ImageContainer from '../containers/ImageContainer';
import Autocomplete from 'react-native-autocomplete-input';
import SideMenu from 'react-native-side-menu';


const mapDispatchToProps = {
  incrementTest,
  logoutUser,
  assignUser,
  navSubreddit,
  toggleNSFW
}
const mapStateToProps = (state) => {
  // console.log("State: ",state)
  return ({
    increment: state.first.increment,
    id: state.second.id,
    subreddit: state.second.subreddit,
    nsfw: state.second.nsfw
  })
}

import { MonoText } from '../components/StyledText';
import { SafeAreaView, withNavigation } from 'react-navigation';

// const drawer = createDrawerNavigator();
// console.log(drawer)

const HomeScreen = ( props )=> {

  const [scrollable, toggleScroll] = useState(true);
  const [id, setID] = useState(-1);
  const [query, setQuery] = useState("");
  const [subredditList, setredditList] = useState("");
  const [refreshing, setRefresh] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    console.log('thisID',props.id)
    if (props.id === -1) { 
      getAsynchStuff();
    }
    else{
      setID(props.id)
    }
    


  }, [])

  useEffect(()=> {
    props.assignUser(id);
    let userData;
    let data =['all', 'animemes', 'azurelane', 'cats', 'memes', 'funny'];
    let url;
    if (props.id===-1){url= `http://7f24f26f.ngrok.io/api/v1/users/${id}`}
    else{
        url=`http://7f24f26f.ngrok.io/api/v1/users/${props.id}`
    }
      fetch(url)
                  .then(res => res.json())
                  .then(json=> {
                    // console.log(json)
                    userData = json.data.attributes.subreddits.map(subreddit=> {
                      return (subreddit.name.toLowerCase())
                    })
                    let allData = [...userData, ...data].filter((val,index,self)=> {
                        return self.indexOf(val) === index;
                    })
                    setredditList(allData)

                  }).catch((e)=>{})
                
  }, [id])

  

  

  useEffect(()=>{
    // console.log(query)
  }, [query])

  let signout = () => {
      let url = 'http://7f24f26f.ngrok.io/logout';
      let options = {
        method: "DELETE",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin':'http://7f24f26f.ngrok.io'
        }
      };

      fetch(url, options)
      .then(res=>res.json())
      .then(json=>{
        props.logoutUser();
        _signOutAsync();
      })
      .catch(error=>Alert.alert("Some error",error, [{title:'ok'}]))
  }
  let getAsynchStuff = async () => {
    await AsyncStorage.getItem('userToken', (error, result)=>{
      // console.log("The result is:",result);
      setID(parseInt(result));
    });
  }
  let _signOutAsync = async () => {
    await AsyncStorage.clear();
    props.navigation.navigate('Auth');
  };

  let showFavImages = () => {
    props.navigation.navigate('Favorites',{dark:dark})
  }
  
  let compare = (a,b) => {return a.toLowerCase().trim() === b.toLowerCase().trim()};
  
  

  let getData = () => {
    let queryLength = query.length;
    let arr = [];
    if (queryLength < 1) {return arr}
    else{
      for (let i = 0; i < subredditList.length-1 ; i++)
      {
        if (compare(query, subredditList[i].substring(0,queryLength)))
          {
            arr.push(subredditList[i])  
          }
      }
    }
    if (arr.length < 1) { arr.push(query)}
    return arr
  }
  const getStartedContainer = {
    alignItems: 'center',
    marginTop: 0,
    marginHorizontal: 0,
    paddingTop:40,
    backgroundColor:(dark ? '#353C51' : 'white'),
    flex:1,
    resizeMode:'cover'
  }
  const container= {
    flex: 1,
    paddingBottom: 40,
    backgroundColor: (dark ? '#353C51' : 'white'),
    resizeMode:'cover'
    
  }
  let MenuComponent = (
    
    <View style={getStartedContainer}>
      <Text style={dark ? {color:'white'} : {color:'black'}}>NSFW Toggle</Text>
          {/* <DevelopmentModeNotice /> */}
            {/* <Button title={`Increment it! it: ${props.increment}`} onPress={props.incrementTest}/> 
            <Button title={`getAsyncTest`} onPress={getAsynchStuff}/>  */}
            <Switch value={props.nsfw} onChange={props.toggleNSFW}/>
            
      <Text style={dark ? {color:'white'} : {color:'black'}}>Dark Mode</Text>
            <Switch value={dark} onChange={()=>setDark(!dark)}/>  
          <Button style={{padding:5}} title="My Favorites" onPress={showFavImages} />
          <ThemeProvider theme={{colors:{primary:'#FF4040'}}}>
          <Button style={{padding:5}} title="Sign Out" onPress={signout} />
          </ThemeProvider>
        </View>
  )
  
  
  return (
    // <drawer.Navigator>
    // <drawer.Screen name="main"
    // component={(<Button title="hello"/>)}
    // />
    // </drawer.Navigator>
    
    <SideMenu
      
      isOpen={isOpen}
      menu={MenuComponent}
      disableGestures={true}
      onChange={()=>setOpen(!isOpen)}
      bouncBackOnOverDraw={false}
      openMenuOffset={0.4*Math.round(Dimensions.get('window').width)}
      >
    <View style={container}>

    <Header
        leftComponent={{icon:'menu', onPress:()=>{if (!isOpen) {setOpen(true)}}}}
        centerComponent={
          {text:`Currently browsing: r/${props.subreddit}`, style:{color:'#fff'}}}
    />
      <View style={{ flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top:90,
    zIndex: 1}}>
      <Autocomplete 
      style={{alignSelf:'center', color:(dark? 'white':'black')}}
      data={
        getData()
      }
      autoCapitalize="none"
      placeholder="Enter Subreddit Name"
      defaultValue={query}
      renderItem={({item,index})=>(
        <TouchableOpacity 
          style={{flex:1, resizeMode:'cover', backgroundColor:(dark ? '#353C51': 'white')}}
          onPress={()=>{
            props.navSubreddit(item);
            setQuery("");
            Keyboard.dismiss();
          }}>
          <Text style={{ alignSelf:'center', color:(dark? 'white':'black')}}>{item}</Text>
        </TouchableOpacity>
      )}
      keyExtractor={(item,index)=>item+""+index}
      onChangeText={(text)=>setQuery(text)}
      // hideResults
      /></View>

      {/* <View style={{padding:5, marginTop:40}}>
      <Picker
            selectedValue={props.subreddit}
            onValueChange={ itemValue =>{
            props.navSubreddit(itemValue)
            // console.log(props.subreddit)
            }
          }
            style={{paddingTop:40}}
          >
          <Picker.Item label="All" value="all" />
          <Picker.Item label="Animemes" value="animemes" />
          <Picker.Item label="Memes" value="memes" />
          <Picker.Item label="Cats" value="cats" />
      </Picker></View> */}
      
      
      

      {/* <ScrollView */}
      {/* <View
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        // scrollEnabled={scrollable}
         > */}
        {/* <View style={styles.welcomeContainer}>
          <Image
            source={
              __DEV__
                ? require('../assets/images/robot-dev.png')
                : require('../assets/images/robot-prod.png')
            }
            style={styles.welcomeImage}
          />
        </View> */}
        

        <View style={styles.helpContainer}>
          <ImageContainer 
            subreddit={props.subreddit}
            toggleScroll={toggleScroll}
            userID={props.id}
            dark={dark}  
            />
        </View>
        {/* </View> */}
      {/* </ScrollView> */}

      
    </View>
    
    </SideMenu>
  );
}

HomeScreen.navigationOptions = {
  header: null,
};

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }

  

}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 40,
  },
  welcomeContainer: {
    alignItems: 'center'
  },
  welcomeImage: {
    width: 100,
    height: 80,
    resizeMode: 'contain',
    marginTop: 3,
    marginLeft: -10,
  },
  homeScreenFilename: {
    marginVertical: 7,
  },
  codeHighlightText: {
    color: 'rgba(96,100,109, 0.8)',
  },
  codeHighlightContainer: {
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
    paddingHorizontal: 4,
  },
  getStartedText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    lineHeight: 24,
    textAlign: 'center',
  },
  tabBarInfoContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    ...Platform.select({
      ios: {
        shadowColor: 'black',
        shadowOffset: { width: 0, height: -3 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 20,
      },
    }),
    alignItems: 'center',
    backgroundColor: '#fbfbfb',
    paddingVertical: 20,
  },
  tabBarInfoText: {
    fontSize: 17,
    color: 'rgba(96,100,109, 1)',
    textAlign: 'center',
  },
  navigationFilename: {
    marginTop: 5,
  },
  helpContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 0
  },
  helpLink: {
    paddingVertical: 15,
  },
  helpLinkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
// export default connect(mapStateToProps, mapDispatchToProps)(App);
export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);