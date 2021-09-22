import React, { useEffect, useState, useLayoutEffect } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { View, Image, StyleSheet, RefreshControl, ImageBackground } from 'react-native'
import moment from 'moment'
import CustomListGrupChats from './CustomListGrupChats';

import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import getRecipientUid from '../utils/getRecipientUid';


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const CustomListChats = ({id,users,enterChat}) => {

    // const navigation = useNavigation();

    const [ chatMessages, setChatMessages ] = useState([]);
    const [ userData, setUserData ] = useState([]);
    const [ chatslist, setChatslist ] = useState([]);
    const [ waktu, setWaktu ] = useState([]);

    // const user = auth().currentUser.uid;
    const [user] = useAuthState(auth());

    const [recipientSnapshot] = useCollection(
        firestore().collection("Users").where("uid", "==", getRecipientUid(users, user))
    );
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientUid = getRecipientUid(users, user);
    // console.log(recipientUid);

    const getData = ()=> {
        firestore()
            .collection("personalChat")
            .doc(id)
            .collection("pesanPersonal")
            .orderBy("waktuPesan", "asc")
            .onSnapshot(querySnapshot => {
                // console.log('Total data: ', querySnapshot.size);
                querySnapshot.forEach(documentSnapshot => {
                    // console.log('Data: ', documentSnapshot.id, documentSnapshot.data());
                    setChatMessages(documentSnapshot.data());

                    // Set Timestamp to Date
                    const timestamp = documentSnapshot.get("waktuPesan");
                    if(timestamp == null){
                        return "";
                    }else {
                        setWaktu(documentSnapshot.get("waktuPesan").toDate().toString())
                    }
                });
            });
    }
    
    // console.log(userData);
    useEffect(() => {
        const unsubscribe = getData();

        return unsubscribe;
    }, []);
    // console.log(chatslist);

    // const enterChat = (id,users)=> {
    //     navigation.navigate("ChatScreen", {
    //         id: id,
    //         users: users
    //     })
    // }

    return (
        // <View></View>
            <ListItem
                containerStyle={{height: 80}}
                key={id} 
                activeOpacity={0.8} 
                onPress={()=> enterChat(id,users)}
                bottomDivider
                >
                {recipient ? (
                    <Image
                    style={{width: 42, height: 42, borderRadius: 10}}
                    source={{uri: recipient?.fotoProfil}}
                    />
                ):(<Image style={{width: 42, height: 42, borderRadius: 10}} source={{uri: recipientUid[0]}} />
                )}
                
                <ListItem.Content>
                    <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                        {recipient ? recipient?.Nama : recipientUid[0]}
                    </ListItem.Title>
                    <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                       {chatMessages.isiPesan}
                    </ListItem.Subtitle>
                </ListItem.Content>
                    <ListItem.Subtitle>
                        {moment(waktu).format('LT')}
                    </ListItem.Subtitle>
                    <ListItem.Chevron size={32} />
            </ListItem>
    )
}

export default CustomListChats

const styles = StyleSheet.create({})