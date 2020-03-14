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


const RegisterScreen = (props) => {
      let submitHandler = (values) => {
        if (values.password !== values['password_confirm']){
            Alert.alert('Password Error', 'Your passwords must match', 
                [{text: 'OK'}]
            )
        }
        else {
            
            let url = 'http://83bc535c.ngrok.io/api/v1/users';
            let options = postOptions(values.username, values.password, values['password_confirm']);

            fetch(url, options)
            .then(resp=>resp.json())
            .then(json=>{
                Alert.alert('Success!','Please sign in')
                props.navigation.navigate('SignIn')
            })
            // ;
            


        }
      }
      let postOptions = (name, password, confirmation) =>{ return {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        },
        body: JSON.stringify({"user":{
            username: name,
            password: password,
            password_confirmation: confirmation
        }})
        }
    }
      return(
            <Formik
            initialValues={{ 
                username: '',
                password: '',
                password_confirm: '' }}
            onSubmit={values => submitHandler(values)}
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
                    <Text style={{alignSelf:'center'}}>Confirm Password</Text>
                    <TextInput
                        autoCapitalize="none"
                        style={{borderColor:'gray', padding:20, fontSize:20, alignSelf:'center'}}
                        secureTextEntry
                        onChangeText={handleChange("password_confirm")}
                        onBlur={handleBlur("password_confirm")}
                        value={values.email}
                    />
                    <View style={{paddingHorizontal:30}} >
                    <Button onPress={handleSubmit} title="Submit" />
                    </View>
                </View>
            )}
        </Formik>
      )
  }

  export default RegisterScreen;
