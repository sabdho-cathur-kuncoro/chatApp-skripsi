import React, { useEffect, useState, useLayoutEffect } from 'react'
import { ListItem, Avatar } from 'react-native-elements'
import { View, Image, Text, StyleSheet, RefreshControl } from 'react-native'
import moment from 'moment'

import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import AntDesign from "react-native-vector-icons/AntDesign"

const CustomListGrupChats = ({id, namaGrup, fotoGrup, enterGroup}) => {
    // const [ chatslist, setChatslist ] = useState([]);
    const [ chatMessages, setChatMessages ] = useState([]);
    const [ waktu, setWaktu ] = useState([]);

    const user = auth().currentUser.uid;
    useEffect(() => {
        const unsubscribe = firestore()
                            .collection("groupChat")
                            .doc(id)
                            .collection("pesanGrup")
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
        return unsubscribe;
    }, []);
    // console.log(user);

    return (
        <ListItem
                containerStyle={{height: 80}}
                key={id} 
                activeOpacity={0.8} 
                onPress={()=> enterGroup(id, namaGrup, fotoGrup)} 
                bottomDivider
            >
                <Image
                    style={{width: 42, height: 42, borderRadius: 10}}
                    source={{uri: fotoGrup}}
                />
                <ListItem.Content>
                    <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                        {namaGrup}
                    </ListItem.Title>
                    <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                        { chatMessages.idPengirim === user ? (
                            "You: "
                        ):(
                            chatMessages.namaPengirim+ ": "
                        )} {chatMessages.tipePesan === "teks" ? (
                            chatMessages.isiPesan
                        ):(
                            <View style={{flexDirection: "row"}}>
                                <AntDesign name="picture" size={20} color="#8c8f8e" style={{marginRight: 5}} />
                                <Text style={{color: "#8c8f8e"}}>{chatMessages.isiPesan === null ? "Image" : chatMessages.isiPesan}</Text>
                            </View>
                        ) }
                    </ListItem.Subtitle>
                </ListItem.Content>
                    <ListItem.Subtitle>
                        {moment(waktu).format('LT')}
                    </ListItem.Subtitle>
                    <ListItem.Chevron size={32} />
            </ListItem>
    )
}

export default CustomListGrupChats
