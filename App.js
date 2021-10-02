/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  LogBox
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import AppStack from './screens/AppStack';

import auth from '@react-native-firebase/auth';

LogBox.ignoreLogs(['all']);
const Stack = createStackNavigator();

export default function App(){
    const [initializing, setInitializing] = useState(true);
    const [user, setUser] = useState();

    // Handle user state changes
    function onAuthStateChanged(user) {
        setUser(user);
        if (initializing) setInitializing(false);
    }

    useEffect(() => {
        const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
        return subscriber;
    }, []);

    if (initializing) return null;

  return(
    <NavigationContainer>
      {user ? <AppStack /> : <LoginScreen />}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({})