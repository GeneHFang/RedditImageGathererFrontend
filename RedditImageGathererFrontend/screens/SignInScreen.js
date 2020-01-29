import React from 'react';
import {
    Image,
    AsyncStorage,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
  } from 'react-native';
  
import { Button, FormLabel, FormInput, FormValidationMessage  } from 'react-native-elements';
import { Formik } from 'formik';
import { assignUser } from '../redux/actions/CurrentLoggedInUser';
import {connect} from 'react-redux';

const mdp = {
    assignUser
  }
const msp = (state) => {
    console.log("State: ",state)
    return ({
      increment: state.first.increment,
      id: state.second.id
    })
  }

 class SignInScreen extends React.Component {

    componentDidMount = ()=>{
        console.log("This is the ID:",this.props.id);

    }
    static navigationOptions = {
      title: 'Welcome to Grabbit! Please Sign In',
      headerTitleStyle:{
          fontWeight:'bold'
      }
    };

    goToRegistration = async () => {
        console.log('pressed')
       this.props.navigation.navigate('Register');
    }

    _signInAsync = async () => {
        //setItem can only take strings
        let x = this.props.id + "";
        await AsyncStorage.setItem('userToken', x);
        this.props.navigation.navigate('App');
      };

    postOptions = (name, password) =>{ return {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'Access-Control-Allow-Origin':'http://7f24f26f.ngrok.io'
        },
        body: JSON.stringify({"user":{
            name: name,
            password: password
        }})}
    }

    submitHandler = (values) => { 
        let url = 'http://7f24f26f.ngrok.io/sessions';

        console.log('test');
        let options = this.postOptions(values.username, values.password);

        console.log('testafter', values);
        fetch(url, options)
        .then(resp=>resp.json())
        .then(json=>{
            console.log(json)
            if (json.status===401) {
                Alert.alert("Wrong Password or Username", "Please doublecheck your login info")
            }else{
            this.props.assignUser(json.user.id)
            this._signInAsync();
            }
        })
        .catch(error => Alert.alert("Error logging in", error, [{title:'ok'}]))


    }
  
    render() {

        return (
            <Formik
                initialValues={{ 
                    username: '',
                    password: ''}}
                onSubmit={values => this.submitHandler(values)}
    
                >
            {({ handleChange, handleBlur, handleSubmit, values }) => (
                <View style={{paddingTop:40}}>
                    <Text style={{alignSelf:'center'}}>Username</Text>  
                    <TextInput
                        autoCapitalize="none"
                        style={{borderColor:'gray', padding:20, fontSize:20, alignSelf:'center'}}
                        onChangeText={handleChange("username")}
                        onBlur={handleBlur("username")}
                        value={values.username}
                    />
                    <Text style={{alignSelf:'center'}}>Password</Text>  
                    <TextInput
                        autoCapitalize="none"
                        style={{borderColor:'gray', padding:20, fontSize:20, alignSelf:'center'}}
                        secureTextEntry
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                    />
                    <View style={{paddingHorizontal:30}} >
                    <Button onPress={handleSubmit} title="Submit" />
                    <Button onPress={this.goToRegistration} title="Sign up?"/>
                    </View>
                </View>
            )}
    {/* <View>
        
        <Button title="Sign in!" onPress={this._signInAsync} />
    </View> */}
  </Formik>
      );
    }
  
  }

  export default connect(msp, mdp)(SignInScreen);