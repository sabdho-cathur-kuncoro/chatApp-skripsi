import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, RefreshControl, StatusBar, ScrollView, SafeAreaView, StyleSheet } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SpeedDial } from 'react-native-elements';
// import { FAB } from 'react-native-elements';
import { FAB, Portal, Provider } from 'react-native-paper';

import CustomListChats from '../../components/CustomListChats';
import CustomListGrupChats from '../../components/CustomListGrupChats';
import { Icon } from 'react-native-vector-icons/Feather';

import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import { useCollection } from 'react-firebase-hooks/firestore';

const ChatsListScreen = ({navigation}) => {
    const [ state, setState ] = useState({ open: false });
    const [ chatsList, setChatsList ] = useState([]);
    const [tes, setTes] = useState([]);
    const [tes2, setTes2] = useState("");

    const user = auth().currentUser.uid;
    const userChatRef = firestore().collection("personalChat").where("users", "array-contains", user).orderBy("listWaktu","desc");
    const [chatsSnapshot] = useCollection(userChatRef);

    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;


    // useEffect(()=>{
    // const unsubscribe =    firestore().collection("Chatslist").where('key', 'array-contains', user)
    //                             .onSnapshot(querySnapshot => {
    //                                 querySnapshot.forEach(documentSnapshot => {
    //                                 //   console.log(documentSnapshot.id, documentSnapshot.data());
    //                                   setTes(documentSnapshot.get('ChatID'));
    //                                 });
    //                             })

    //                             firestore().collection("Chatslist").doc(tes).collection("ChatsID")
    //                         .onSnapshot((snapshot) =>
    //                                 setTes2(snapshot.docs.map((doc)=> ({
    //                                     id: doc.id,
    //                                     data: doc.data(),
    //                                 })))
    //                             );

    //     return unsubscribe;
    // },[])
    // console.log(tes);
    
    // useEffect(()=> {
    //     const unsubscribe = firestore().collection("personalChat").where("users", "array-contains", user)
    //                         .onSnapshot((snapshot) =>
    //                                 setChatsList(snapshot.docs.map((doc)=> ({
    //                                     id: doc.id,
    //                                     data: doc.data(),
    //                                 })))
    //                             );
    //     return unsubscribe;
    // },[])
    // console.log(chatsList);
    
    // useEffect(()=> {
    //     const unsubscribe = firestore()
    //                         .collection('listPersonalChat')
    //                         .where("member", "array-contains", user)
    //                         .orderBy("waktuPesan", "desc")
    //                         .onSnapshot((snapshot) =>
    //                             setTes(snapshot.docs.map((doc)=> ({
    //                                 id: doc.id,
    //                                 data: doc.data(),
    //                             })))
    //                         );
    //                         // .onSnapshot(querySnapshot => {
    //                         //     querySnapshot.forEach(documentSnapshot => {
    //                         //         setTes(documentSnapshot.data())
    //                         //     })
    //                         // })

                            
    //     return unsubscribe;
    // },[]);
    // console.log(tes);

    // const getPersonalID = ()=> {
    //     firestore()
    //         .collection('personalChat')
    //         .where("member", "array-contains", user)
    //         .orderBy("waktuPesan", "desc")
    //         .onSnapshot(querySnapshot => {
    //             querySnapshot.forEach(documentSnapshot => {
    //                 setTes(documentSnapshot.get('chatID'))
    //             })
    //         })
    // }
    // useEffect(()=> {
    //     const unsubscribe = getPersonalID();
    //     return unsubscribe
    // },[])
    // // console.log(tes);
    // const getListChat = ()=> {
    //     const idPersonal = tes;

    //     console.log(idPersonal);
    //     // firestore()
    //     //     .collection('personalChat')
    //     //     .doc(idPersonal)
    //     //     .collection('Member')
    //     //     .doc(user)
    //     //     .onSnapshot(querySnapshot => {
    //     //         console.log('Total users: ', querySnapshot.size);
            
    //     //         querySnapshot.forEach(documentSnapshot => {
    //     //           console.log('User ID: ', documentSnapshot.id, documentSnapshot.data());
    //     //         });
    //     //     })
    //         // .onSnapshot((snapshot) =>
    //         //     setChatsList(snapshot.docs.map((doc)=> ({
    //         //         id: doc.id,
    //         //         data: doc.data(),
    //         //     })))
    //         // );
    // }

    // useEffect(()=> {
    //     const unsubscribe = getListChat();
    //     return unsubscribe
    // },[])
    // console.log(tes);
    // useEffect(()=> {
    //     // const idPersonal = tes;
    //     // console.log(idPersonal);
    //     const unsubscribe = firestore()
    //                         .collection('listPersonalChat')
    //                         // .doc(idPersonal)
    //                         .where('chatDengan', 'array-contains', user)
    //                         // .orderBy('listWaktu', 'desc')
    //                         // .collection('MemberPersonalChat')
    //                         // .doc(user)
    //                         .onSnapshot((snapshot) =>
    //                             setChatsList(snapshot.docs.map((doc)=> ({
    //                                 id: doc.id,
    //                                 // coba: doc.get("chatID"),
    //                                 data: doc.data(),
    //                             })))
    //                         );
    //                         // .onSnapshot(querySnapshot => {
    //                         //     querySnapshot.forEach(documentSnapshot=> {
    //                         //         console.log(documentSnapshot.data())
    //                         //         setChatsList({
    //                         //             id: documentSnapshot.get('chatsID'),
    //                         //             data: documentSnapshot.data()
    //                         //         })
    //                         //     })
    //                         // })

    //                         // firestore()
    //                         // .collection("Users")
    //                         // .where("keyPersonalChat", "array-contains", user)
    //                         // .onSnapshot((snapshot)=> 
    //                         //     setTes(snapshot.docs.map((doc)=> ({
    //                         //         idUser: doc.id,
    //                         //         data: doc.data()
    //                         //     })))
    //                         // )
    //     return unsubscribe
    // },[])
    // console.log("ISI: ", tes);
    // console.log(chatsList);

    const enterChat = (id, users)=> {
        navigation.navigate("ChatScreen", {
            id,
            users
            // displayName,
            // displayFoto
        })
    }

    const signOutUser = ()=> {
        auth().signOut().then(()=> {
            // navigation.replace("Login");
            console.log("Berhasil Logout")
        });
    };

    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#A1C6B9"
          }} 
          >
            <StatusBar style="light-content" backgroundColor="#A1C6B9" />

            {/* <TouchableOpacity onPress={signOutUser}>
                <View style={{width: 50, height: 50, backgroundColor: "red"}}>
                    <Text>Log Out</Text>
                </View>
            </TouchableOpacity> */}

            <View style={styles.header}>
                <Text style={{ fontSize: 30, color: "white", fontWeight: "bold"}}>Personal</Text>
            </View>
            
            <View style={styles.body}>
                <ScrollView style={{marginTop: 50}}
                    
                >
                    {/* List of Chats */}
                    {chatsSnapshot?.docs.map((chat)=> (
                        <CustomListChats 
                            key={chat.id} 
                            id={chat.id} 
                            users={chat.data().users}
                            enterChat={enterChat}
                        />
                    ))}
                    {/* {
                        chatsList.map(({id,data: {displayName,displayFoto}})=> (
                            <CustomListChats 
                                key={id}
                                id={id}
                                // idUser1={idUser1}
                                // idUser2={idUser2}
                                // namaUser1={namaUser1}
                                // namaUser2={namaUser2}
                                // fotoUser1={fotoUser1}
                                // fotoUser2={fotoUser2}
                                // displayName={displayName}
                                // displayFoto={displayFoto}
                                enterChat={enterChat}
                            />
                        ))
                    } */}
                </ScrollView>
                
                <Provider>
                <Portal>
                    <FAB.Group
                    open={open}
                    color= "#FFF"
                    icon={open ? 'close' : 'plus'}
                    fabStyle={{backgroundColor: "#42C294"}}
                    actions={[
                        {
                        icon: 'forum',
                        color: '#42C294',
                        label: 'Pesan Grup',
                        small: false,
                        onPress: () => navigation.navigate("AddGrup"),
                        },
                        {
                        icon: 'message',
                        label: 'Pesan Personal',
                        color: '#42C294',
                        small: false,
                        onPress: () => navigation.navigate("SelectContact"),
                        },
                    ]}
                    onStateChange={onStateChange}
                    />
                </Portal>
                </Provider>
            </View>
            
        </SafeAreaView>
    )
}

export default ChatsListScreen

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
        backgroundColor: "#fff"
    }
})