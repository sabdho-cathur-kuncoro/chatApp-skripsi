import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import ChatScreen from './ChatScreen'
import SelectContactScreen from './SelectContactScreen'
import AddChatGrupScreen from './AddChatGrupScreen'
import CreateChatPersonal from './CreateChatPersonal'
import SwiperChats from './SwiperChats';
import GrupChatScreen from './GrupChatScreen';
import DetailGroupScreen from './DetailGroupScreen';
import AddGroupParticipant from './AddGroupParticipant';
import DetailUserScreen from './DetailUserScreen';
import DetailMemberGrup from './DetailMemberGrup';
import PreviewChatImage from './PreviewChatImage';
import ViewImageChat from './ViewImageChat';
import PreviewGroupImage from './PreviewGroupImage';
import ViewImageGroup from './ViewImageGroup';
import ProfileStack from '../profile/ProfileStack';
import ViewFotoGrup from './ViewFotoGrup';

const ChatStack = createStackNavigator();

const ChatStackScreen = () => {
    return (
        <ChatStack.Navigator>
            <ChatStack.Screen name="Swiper" options={{headerShown: false}} component={SwiperChats} />
            <ChatStack.Screen options={{headerShown: false,}} name="ChatScreen" component={ChatScreen} />
            <ChatStack.Screen name="SelectContact" options={{headerShown: false}} component={SelectContactScreen} />
            <ChatStack.Screen options={{headerShown: false}} name="CreateChatPersonal" component={CreateChatPersonal} />
            <ChatStack.Screen name="AddGrup" component={AddChatGrupScreen} />
            <ChatStack.Screen name="GrupChatScreen" options={{headerShown: false}} component={GrupChatScreen} />
            <ChatStack.Screen name="DetailGroup" component={DetailGroupScreen} />
            <ChatStack.Screen name="AddParticipant" options={{headerShown: false}} component={AddGroupParticipant} />
            <ChatStack.Screen name="DetailUser" component={DetailUserScreen} />
            <ChatStack.Screen name="MemberGrup" component={DetailMemberGrup} />
            <ChatStack.Screen name="PreviewImage" options={{headerShown: false}} component={PreviewChatImage} />
            <ChatStack.Screen name="ViewImage" options={{headerShown: false}} component={ViewImageChat} />
            <ChatStack.Screen name="PreviewImageGroup" options={{headerShown: false}} component={PreviewGroupImage} />
            <ChatStack.Screen name="ViewImageGroup" options={{headerShown: false}} component={ViewImageGroup} />
            <ChatStack.Screen name="ProfileStack" options={{headerShown: false}} component={ProfileStack} />
            <ChatStack.Screen name="ViewFotoGrup" options={{headerShown: false}} component={ViewFotoGrup} />
        </ChatStack.Navigator>
    )
}

export default ChatStackScreen
