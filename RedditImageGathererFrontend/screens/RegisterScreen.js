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
            
            let url = 'http://7f24f26f.ngrok.io/api/v1/users';
            let options = postOptions(values.username, values.password, values['password_confirm']);

            fetch(url, options)
            .then(resp=>resp.json())
            .then(json=>props.navigation.navigate('SignIn'))
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
                <View>
                    <Text>Username</Text>  
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
                    <Text>Confirm Password</Text>
                    <TextInput
                        secureTextEntry
                        onChangeText={handleChange("password_confirm")}
                        onBlur={handleBlur("password_confirm")}
                        value={values.email}
                    />
                    <Button onPress={handleSubmit} title="Submit" />
                </View>
            )}
        </Formik>
      )
  }

  export default RegisterScreen;
