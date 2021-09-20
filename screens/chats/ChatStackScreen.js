import React, { useLayoutEffect } from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import ChatsListScreen from './ChatsListScreen'
import ChatScreen from './ChatScreen'
import SelectContactScreen from './SelectContactScreen'
import AddChatGrupScreen from './AddChatGrupScreen'
import CreateChatPersonal from './CreateChatPersonal'
import SwiperChats from './SwiperChats';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import GrupChatScreen from './GrupChatScreen';
import DetailGroupScreen from './DetailGroupScreen';
import AddGroupParticipant from './AddGroupParticipant';

const ChatStack = createStackNavigator();

const ChatStackScreen = ({navigation, route}) => {
    useLayoutEffect(() => {
        const tabHiddenRoutes = ["ChatScreen","SelectContact", "AddGrup","CreateChatPersonal","AddParticipant","GrupChatScreen","DetailGroup"];

        if(tabHiddenRoutes.includes(getFocusedRouteNameFromRoute(route))){
        navigation.setOptions({tabBarVisible: false});
        }else{
        navigation.setOptions({tabBarVisible: true});
        }
        // const routeName = getFocusedRouteNameFromRoute(route);
        // if (routeName === "ChatScreen"){
        //     navigation.setOptions({tabBarVisible: false});
        // }else {
        //     navigation.setOptions({tabBarVisible: true});
        // }
    }, [navigation, route]);
    
    return (
        <ChatStack.Navigator>
            <ChatStack.Screen name="Swiper" options={{headerShown: false}} component={SwiperChats} />
            {/* <ChatStack.Screen name="ChatList" options={{headerShown: false}} component={ChatsListScreen} /> */}
            <ChatStack.Screen
                options={{headerShown: false,}}
                name="ChatScreen" component={ChatScreen} />
            <ChatStack.Screen name="SelectContact" options={{headerShown: false}} component={SelectContactScreen} />
            <ChatStack.Screen options={{headerShown: false}} name="CreateChatPersonal" component={CreateChatPersonal} />
            <ChatStack.Screen name="AddGrup" component={AddChatGrupScreen} />
            <ChatStack.Screen name="GrupChatScreen" options={{headerShown: false}} component={GrupChatScreen} />
            <ChatStack.Screen name="DetailGroup" component={DetailGroupScreen} />
            <ChatStack.Screen name="AddParticipant" options={{headerShown: false}} component={AddGroupParticipant} />
        </ChatStack.Navigator>
    )
}

export default ChatStackScreen
