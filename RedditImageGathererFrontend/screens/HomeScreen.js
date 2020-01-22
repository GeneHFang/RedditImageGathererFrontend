import * as WebBrowser from 'expo-web-browser';
import React, {useState, useEffect} from 'react';
import {
  Image,
  Platform,
  AsyncStorage,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  Picker,
  View,
  Alert,
} from 'react-native';
import { Button, ThemeProvider } from 'react-native-elements';
import { incrementTest } from '../redux/actions/TestAction';
import { logoutUser, assignUser, navSubreddit } from '../redux/actions/CurrentLoggedInUser';
import {connect} from 'react-redux';
import ImageContainer from '../containers/ImageContainer';


const mapDispatchToProps = {
  incrementTest,
  logoutUser,
  assignUser,
  navSubreddit
}
const mapStateToProps = (state) => {
  // console.log("State: ",state)
  return ({
    increment: state.first.increment,
    id: state.second.id,
    subreddit: state.second.subreddit
  })
}

import { MonoText } from '../components/StyledText';

const HomeScreen = ( props )=> {

  const [scrollable, toggleScroll] = useState(true);
  const [id, setID] = useState(-1);

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
  }, [id])

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
    props.navigation.navigate('Favorites')
  }

  return (
    <View style={styles.container}>
      <Picker
            selectedValue={props.subreddit}
            onValueChange={ itemValue =>{
            props.navSubreddit(itemValue)
            // console.log(props.subreddit)
            }
          }>
          <Picker.Item label="All" value="all" />
          <Picker.Item label="Animemes" value="animemes" />
          <Picker.Item label="Memes" value="memes" />
          <Picker.Item label="Cats" value="cats" />
      </Picker>

      <View style={styles.getStartedContainer}>
          {/* <DevelopmentModeNotice /> */}
            {/* <Button title={`Increment it! it: ${props.increment}`} onPress={props.incrementTest}/> 
            <Button title={`getAsyncTest`} onPress={getAsynchStuff}/>  */}
          <Button style={{padding:5}} title="My Favorites" onPress={showFavImages} />
          <ThemeProvider theme={{colors:{primary:'#FF4040'}}}>
          <Button title="Sign Out" onPress={signout} />
          </ThemeProvider>
        </View>

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        scrollEnabled={scrollable}>
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
            />
        </View>
      </ScrollView>

      <View style={styles.tabBarInfoContainer}>
        <Text style={styles.tabBarInfoText}>
          {`Currently browsing: R/${props.subreddit}`}
        </Text>
      </View>
    </View>
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
  container: {
    flex: 1,
    paddingBottom: 40,
    backgroundColor: 'white'
  },
  developmentModeText: {
    marginBottom: 20,
    color: 'rgba(0,0,0,0.4)',
    fontSize: 14,
    lineHeight: 19,
    textAlign: 'center',
  },
  contentContainer: {
    paddingTop: 30,
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
  getStartedContainer: {
    alignItems: 'center',
    marginTop: -20,
    marginHorizontal: 50,
    marginBottom: 5
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
    marginTop: -30,
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