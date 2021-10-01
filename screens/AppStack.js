import React, { useState, useEffect} from 'react'
import { View, Text } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import CreateAccountScreen from './CreateAccountScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ChatStackScreen from './chats/ChatStackScreen';

const Stack = createStackNavigator();

export default function AppStack() {
    const [isCreateAccount, setCreateAccount] = useState(null);
    let routeName;

    useEffect(() => {
      AsyncStorage.getItem('alreadyCreateAccount').then((value) => {
        if (value == null) {
            AsyncStorage.setItem('alreadyCreateAccount', 'true');
            setCreateAccount(true);
        } else {
            setCreateAccount(false);
        }
      });
    
    }, []);
  
    if (isCreateAccount === null) {
      return null; 
    } else if (isCreateAccount == true) {
      routeName = 'CreateAccount';
    } else {
      routeName = 'HomeScreen';
    }

    return (
        <Stack.Navigator 
            initialRouteName={routeName}
        >
            <Stack.Screen name="CreateAccount" options={{headerShown: false}} component={CreateAccountScreen} />
            <Stack.Screen name="HomeScreen" options={{headerShown: false}} component={ChatStackScreen} />
        </Stack.Navigator>
    )
}
