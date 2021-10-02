import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import ProfileScreen from './ProfileScreen';
import ViewFotoProfil from './ViewFotoProfil';

const ProfilStack = createStackNavigator();

const ProfileStack = () => {
    return (
        <ProfilStack.Navigator>
            <ProfilStack.Screen name="ProfilScreen" options={{headerShown: false}} component={ProfileScreen} />
            <ProfilStack.Screen name="ViewFoto" options={{headerShown: false}} component={ViewFotoProfil} />
        </ProfilStack.Navigator>
    )
}

export default ProfileStack
