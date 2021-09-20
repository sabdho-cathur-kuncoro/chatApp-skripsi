import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import ProfileScreen from './ProfileScreen';
import EditProfileScreen from './EditProfileScreen';

const ProfileStack = createStackNavigator();

const ChatStackScreen = ({navigation, route}) => {
    React.useLayoutEffect(() => {
        const routeName = getFocusedRouteNameFromRoute(route);
        if (routeName === "EditScreen"){
            navigation.setOptions({tabBarVisible: false});
        }else {
            navigation.setOptions({tabBarVisible: true});
        }
    }, [navigation, route]);
    
    return (
        <ProfileStack.Navigator>
            <ProfileStack.Screen name="ProfileScreen" options={{headerShown: false}} component={ProfileScreen} />
            <ProfileStack.Screen
                options={{headerShown: false,}}
                name="EditScreen" component={EditProfileScreen} />
        </ProfileStack.Navigator>
    )
}

export default ChatStackScreen
