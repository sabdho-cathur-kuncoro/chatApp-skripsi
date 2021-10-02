import React, { useEffect, useState } from 'react'
import { ListItem } from 'react-native-elements'
import { Image } from 'react-native'
import moment from 'moment'
import firestore from '@react-native-firebase/firestore';

const CustomListPersonalChat = ({id, displayName, displayFoto, enterChat}) => {
    const [ chatMessages, setChatMessages ] = useState([]);
    const [ waktu, setWaktu ] = useState([]);

    const getData = ()=> {
        firestore()
            .collection("Chats")
            .doc(id)
            .collection("Messages")
            .orderBy("waktuPesan", "asc")
            .onSnapshot(querySnapshot => {
                querySnapshot.forEach(documentSnapshot => {
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
    
    useEffect(() => {
        const unsubscribe = getData();
        return unsubscribe;
    }, []);
    return (
        <ListItem
                containerStyle={{height: 80}}
                key={id} 
                activeOpacity={0.8} 
                onPress={()=> enterChat(id, displayName, displayFoto)} 
                bottomDivider
                >
                <Image
                    style={{width: 42, height: 42, borderRadius: 10}}
                    source={{uri: displayFoto}}
                />
                <ListItem.Content>
                    <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                        {displayName}
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

export default CustomListPersonalChat
