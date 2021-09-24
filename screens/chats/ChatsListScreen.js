import React, { useState, useEffect, useLayoutEffect } from 'react'
import { View, Text, TouchableOpacity, RefreshControl, StatusBar, ScrollView, SafeAreaView, StyleSheet, Image } from 'react-native'
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
    const [userData, setUserData] = useState([]);

    const user = auth().currentUser.uid;
    const userChatRef = firestore().collection("personalChat").where("users", "array-contains", user).orderBy("listWaktu","desc");
    const [chatsSnapshot] = useCollection(userChatRef);

    const onStateChange = ({ open }) => setState({ open });
    const { open } = state;

    useEffect(()=> {
        firestore().collection("Users").doc(user).onSnapshot(documentSnapshot=> {
            setUserData(documentSnapshot.data());
        })
    },[]);

    // console.log(userData);
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
                <TouchableOpacity 
                    activeOpacity={0.7}
                    onPress={()=> navigation.navigate("ProfileStack")}
                    style={{alignSelf: "flex-start", flexDirection: "row", alignItems: "center", marginTop: 5}}
                >
                    <Image source={{uri: userData.fotoProfil}} style={{width: 38, height: 38, borderRadius: 10, marginLeft: 20}} />
                    <Text style={{marginLeft: 5, color: "#FFF", fontSize: 18, fontWeight: "bold"}}>{userData.Nama}</Text>
                </TouchableOpacity>
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
        flex: 0.2, 
        backgroundColor: "#A1C6B9", 
        flexDirection: "column", 
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