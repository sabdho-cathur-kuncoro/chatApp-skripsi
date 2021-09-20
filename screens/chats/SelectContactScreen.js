import React, { useEffect, useState } from 'react'
import { View, Image, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native'

import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomListContacts from '../../components/CustomListContacts';
import AntDesign from 'react-native-vector-icons/AntDesign';

const ContactScreen = ({navigation}) => {
    const [contacts, setContacts] = useState([]);
    const [userData, setUserData] = useState('');
    const [data, setData] = useState([]);

    
    const user = auth().currentUser.uid;

    const getContact = ()=> {
        firestore()
            .collection('Contacts')
            .where('contactIn', 'array-contains', user)
            // .doc(user.uid)
            // .collection('UserID')
            .onSnapshot((snapshot)=>
                setContacts(snapshot.docs.map((doc)=> ({
                    id: doc.id,
                    data: doc.data()
                    }))
                )
            );
    }
    // const getUser = ()=> {
    //     firestore()
    //         .collection('Users')
    //         .doc(user.uid)
    //         .onSnapshot(documentSnapshot => {
    //             // console.log('User data: ', documentSnapshot.data());

    //             const id = documentSnapshot.get("uid");
    //             const nama = documentSnapshot.get("Nama");
    //             const foto = documentSnapshot.get("fotoProfil")
    //             setUserData({
    //                 idPengirim: id,
    //                 namaPengirim: nama,
    //                 fotoPengirim: foto,
    //             });
    //         })
    // }

    useEffect(()=> {
        const unsubscribe = getContact();
                            // getUser();
                            // gabunganData();
                            // setData(contacts.join(userData));

        return unsubscribe;
    }, []);

    // console.log(id);
    // console.log('User ',userData);
    // console.log('Data Contact ', contacts);

    // const enterChats = (id, displayName, displayFoto)=> {
    //         navigation.replace("CreateChatPersonal", {
    //             id,
    //             displayName,
    //             displayFoto,
    //         })
    // }


    // console.log(user1+', '+user2+' => '+ roomName);

    const chatAlreadyExists = (recipientUid) => 
        !!chatsSnapshot?.docs.find(
            (chat) =>
                chat.data().users.find((user)=> user === recipientUid)?.length > 0
        );
    const createChat = (id,displayName,displayFoto)=> {
        // var user1 = user; // UID of user 1
        // var user2 = id; // UID of user 2
    
        // var roomName = 'chat_'+ user2;
        const randomNumber = Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 100);
        const idPersonal = "Personal_" + randomNumber;
        console.log(idPersonal);

            firestore().collection("personalChat").doc(idPersonal).set({
                users: [user, id],
                listOrder: firebase.firestore.FieldValue.serverTimestamp()
            },{ merge: true })
            .then(
                navigation.navigate("CreateChatPersonal",{
                    idPersonal: idPersonal,
                    users: id,
                    displayName,
                    displayFoto
                })
            )
    };

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#A1C6B9"
        }}>
            <View style={styles.header}>
                <TouchableOpacity 
                    onPress={()=> navigation.goBack()}
                    activeOpacity={0.5} style={{position: "absolute", marginLeft: 5, flexDirection: "row", alignItems: "center", left: 0
                }}
                >
                    <AntDesign name="left" size={30} color="white" />
                    <Text style={{color: "#FFF", fontSize: 16}}>Go Back</Text>
                </TouchableOpacity>
                <View style={{}}>
                    <Text style={{ fontSize: 28, color: "white", fontWeight: "bold"}}>Select Contact</Text>
                </View>
            </View>

            <View style={styles.body}>
                <ScrollView style={{marginTop: 50}}>
                {
                    contacts.map(({id, data: {displayName, displayFoto}}) => (
                        <CustomListContacts 
                            key={id} 
                            id={id} 
                            displayName={displayName}
                            displayFoto={displayFoto}
                            createChat={createChat}
                        />
                    ))
                }
                </ScrollView>
            </View>
        </SafeAreaView>
    )
}

export default ContactScreen

const styles = StyleSheet.create({
    header: {
        flex: 0.1, 
        backgroundColor: "#A1C6B9", 
        flexDirection: "row", 
        alignItems: "center", 
        justifyContent: "center"
    },
    body: {
        flex: 1, 
        elevation: 5, 
        borderTopLeftRadius: 40, 
        borderTopRightRadius: 40, 
        backgroundColor: "#FFF"
    }
})
