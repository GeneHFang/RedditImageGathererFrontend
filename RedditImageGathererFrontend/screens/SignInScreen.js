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
        console.log(this.props.id);

    }
    static navigationOptions = {
      title: 'Please sign in',
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
            'Access-Control-Allow-Origin':'http://localhost:3000'
        },
        body: JSON.stringify({"user":{
            name: name,
            password: password
        }})}
    }

    submitHandler = (values) => { 
        let url = 'http://localhost:3000/sessions';
        let options = this.postOptions(values.username, values.password);

        fetch(url, options)
        .then(resp=>resp.json())
        .then(json=>{
            this.props.assignUser(json.user.id)
            this._signInAsync();
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
                <View>
                    <Text>Username ({`${this.props.increment}`})</Text>  
                    <TextInput
                        onChangeText={handleChange("username")}
                        onBlur={handleBlur("username")}
                        value={values.username}
                    />
                    <Text>Password</Text>  
                    <TextInput
                        secureTextEntry
                        onChangeText={handleChange("password")}
                        onBlur={handleBlur("password")}
                        value={values.password}
                    />
                    <Button onPress={handleSubmit} title="Submit" />
                    <Button onPress={this.goToRegistration} title="Sign up?"/>
                    <Button onPress={this.props.incrementTest} title="Inc"/> 
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