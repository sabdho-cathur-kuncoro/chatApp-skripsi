import React, { useEffect, useState, useLayoutEffect, useRef } from 'react'
import { 
    View, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, TextInput 
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment'

import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';


const CreateChatPersonal = ({navigation, route}) => {
    const [input, setInput] = useState("");
    const [userData, setUserData] = useState('');
    const [messages, setMessages] = useState([]);
    const [waktu, setWaktu] = useState([]);
    const scrollViewRef = useRef();

    const user = auth().currentUser.uid;
    
        // const randomNumber = Math.floor(Math.random() * 1000) + Math.floor(Math.random() * 100);
        // const idPersonal = "Personal_" + randomNumber;

    useEffect(()=> {
        const unsubscribe = firestore()
                            .collection('Users')
                            .doc(user)
                            .onSnapshot(documentSnapshot => {
                                // console.log('User data: ', documentSnapshot.data());

                                const id = documentSnapshot.get("uid");
                                const nama = documentSnapshot.get("Nama");
                                const foto = documentSnapshot.get("fotoProfil")
                                setUserData({
                                    idPengirim: id,
                                    namaPengirim: nama,
                                    fotoPengirim: foto,
                                });
                            })
                            
        return unsubscribe;
    },[])
    useEffect(()=> {
        const unsubscribe = 
                            firestore()
                            .collection("personalChat")
                            .doc(route.params.id)
                            .collection("pesanPersonal")
                            // .collection("Chats")
                            // .doc(route.params.id)
                            // .collection("Messages")
                            .onSnapshot(querySnapshot => {
                                querySnapshot.forEach(documentSnapshot => {
                                    const timestamp = documentSnapshot.get("waktuPesan");
                                    if(timestamp == null){
                                        return "";
                                    }else {
                                        setWaktu(documentSnapshot.get("waktuPesan").toDate().toString())
                                    }
                                })
                            })

        return unsubscribe;
    },[])

        // const roomName = user1 + user2;
    // console.log(roomName);
    console.log(route.params.users);
    console.log("idPersonal ",route.params.idPersonal);
    
    const sendMessage = ()=> {
        firestore()
            .collection("personalChat")
            .doc(route.params.idPersonal)
            .collection("pesanPersonal")
            // .collection("Chats")
            // .doc(route.params.id)
            // .collection("Messages")
            .add({
                waktuPesan: firebase.firestore.FieldValue.serverTimestamp(),
                chatsID: route.params.id,
                isiPesan: input,
                idPengirim: user,
                // idPenerima: route.params.id, // Maybe tidak perlu
            });
        
            setInput("");
    };
    // const createChatlist = ()=> {
    //     firestore()
    //         .collection("listPersonalChat")
    //         .doc(user)
    //         .set({
    //             chatDengan: firestore.FieldValue.arrayUnion(route.params.id),
    //             chatID: route.params.id,
    //             displayName: userData.namaPengirim,
    //             displayFoto: userData.fotoPengirim,
    //             // key: [route.params.id],
    //             listWaktu: firebase.firestore.FieldValue.serverTimestamp()
    //         });
    //         // .collection("Chatslist")
    //         // .doc(user) // JEFF BEZOS
    //         // .collection("ChatsID")
    //         // .doc(route.params.id)
    //         // .set({
    //         //     waktuPesan: firebase.firestore.FieldValue.serverTimestamp(),
    //         //     chatsID: route.params.id,
    //         //     idPengirimPertama: user, // JEFF BEZOS
    //         //     // namaPengirim: userData.namaPengirim, // JEFF BEZOS
    //         //     // namaPenerima: route.params.displayName, // ELON MUSK
    //         //     // fotoPengirim: userData.fotoPengirim,
    //         //     // fotoPenerima: route.params.displayFoto,
    //         //     displayName: route.params.displayName, // MASIH SALAH
    //         //     displayFoto: route.params.displayFoto, // MASIH SALAH
    //         //     tipeChat: "Private"
    //         //     // member: [
    //         //     //     user1,
    //         //     //     user2
    //         //     // ]
    //         // });
    // };
    // const createChatlistCopy = ()=> {
    //     firestore()
    //         .collection("listPersonalChat")
    //         .doc(route.params.id)
    //         .set({
    //             chatDengan: firestore.FieldValue.arrayUnion(user),
    //             chatID: route.params.id,
    //             displayName: route.params.displayName,
    //             displayFoto: route.params.displayFoto,
    //             // key: [user],
    //             listWaktu: firebase.firestore.FieldValue.serverTimestamp()
    //         });
    //         // .collection("Chatslist")
    //         // .doc(route.params.id) // USER 2
    //         // .collection("ChatsID")
    //         // .doc(route.params.id) 
    //         // .set({
    //         //     waktuPesan: firebase.firestore.FieldValue.serverTimestamp(),
    //         //     chatsID: route.params.id,
    //         //     idPengirimPertama: user, // JEFF BEZOS
    //         //     // namaPengirim: userData.namaPengirim, // JEFF BEZOS
    //         //     // namaPenerima: route.params.displayName, // ELON MUSK
    //         //     // fotoPengirim: userData.fotoPengirim,
    //         //     // fotoPenerima: route.params.displayFoto,
    //         //     displayName: userData.namaPengirim,
    //         //     displayFoto: userData.fotoPengirim,
    //         //     tipeChat: "Private"
    //         // })
    // }
    const createChats =  ()=> {
        sendMessage();
        // createChatlist();
        // createChatlistCopy();
    }

    useLayoutEffect(() => {
        const unsubscribe = firestore()
                            .collection("personalChat")
                            .doc(route.params.idPersonal)
                            .collection("pesanPersonal")
                            .orderBy("waktuPesan", "asc")
                            .onSnapshot((snapshot)=> 
                                setMessages(
                                    snapshot.docs.map((doc)=> ({
                                        id: doc.id,
                                        data: doc.data(),
                                    }))
                                ));
        
        return unsubscribe;
    }, [route]);
    // console.log("Data: ",messages);
    return(
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#FFF"}}
        >
            <StatusBar style="light-content" backgroundColor="#A1C6B9" />
            <View style={styles.header}>
                <TouchableOpacity 
                    activeOpacity={0.5}
                    style={{marginLeft: 10, flexDirection: "row"}}
                    onPress={()=> navigation.navigate("Swiper")}
                    >
                    <AntDesign name="left" size={30} color="white" />
                    <Image 
                        source={{ 
                            uri: route.params.displayFoto
                            // "https://cdn.popbela.com/content-images/post/20210108/elon-musk-4bd53f33cfc95bda8ccc9d3386f26408.jpg"
                        }}
                        style={{marginLeft: 5, width: 32, height: 32, borderRadius: 10}}
                    />
                </TouchableOpacity>
                <View style={{marginLeft: 15}}>
                    <Text style={{fontSize: 22, color: "#fff"}}>{route.params.displayName}</Text>
                </View>
            </View>

            {/* <View style={{flex: 1, backgroundColor: "#ECECEC"}}>
                
            </View> */}

            <KeyboardAvoidingView 
                style={styles.screen} 
                keyboardVerticalOffset={90}
            >
                <>
                <ScrollView 
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                contentContainerStyle={{backgroundColor: "#FFF", paddingTop: 15}}>
                            {messages.map(({id, data})=> (
                                data.idPengirim === auth().currentUser.uid ? (
                                    <View key={id} style={styles.bubbles}>
                                        <View  style={styles.sender}>
                                            <Text style={styles.timeSender}>{moment(waktu).format('LT')}</Text>
                                            <Text style={styles.senderText}>{data.isiPesan}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.bubblesReceiver}>
                                        <View style={styles.receiver}>
                                            <Text style={styles.receiverText}>{data.isiPesan}</Text>
                                            <Text style={styles.timeReceiver}>{moment(waktu).format('LT')}</Text>
                                        </View>
                                    </View>
                                )
                            ))}
                </ScrollView>

                <View style={styles.footer}>
                    <TextInput 
                        value={input}
                        onChangeText={(text)=> setInput(text)}
                        onSubmitEditing={createChats}
                        placeholder="Ketik pesan.."
                        style={styles.textInput}
                    />
                    <TouchableOpacity 
                        onPress={createChats}
                        activeOpacity={0.5}>
                        <View style={{backgroundColor: "#8ed1ba", marginLeft: 5, alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: 23}}>
                            <Ionicons name="send" size={28} color="#FFF" style={{marginLeft: 5}} />
                        </View>
                    </TouchableOpacity>
                </View>
                </>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default CreateChatPersonal

const styles = StyleSheet.create({
    header: {
        flex: 0.1, 
        backgroundColor: "#A1C6B9", 
        borderBottomEndRadius: 20, 
        elevation: 2, 
        flexDirection: "row",
        alignItems: "center",
    },
    screen: {
        flex: 1, 
        backgroundColor: "#FFF",
    },
    bubbles: {
        width: "100%", 
        // backgroundColor: "#ECECEC",
        flexDirection: "row", 
        justifyContent: "flex-end"
    },
    bubblesReceiver: {
        width: "100%", 
        // backgroundColor: "#ECECEC",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },
    receiver: {
        padding: 15,
        elevation: 2,
        backgroundColor: "#ECECEC",
        alignSelf: "flex-start",
        margin: 5,
        borderRadius: 20,
        maxWidth: "80%",
        position: "relative",
    },
    receiverText: {
        color: "#000",
        fontSize: 16,
        textAlign: "left",
        // fontWeight: "700",
        marginLeft: 10,
        // paddingLeft: 5,
    },
    sender: {
        position: "relative",
        elevation: 2,
        backgroundColor: "#8ed1ba",
        alignSelf: "flex-end",
        marginRight: 15,
        marginBottom: 5,
        padding: 15,
        maxWidth: "80%",
        borderRadius: 20
    },
    senderText: {
        color: "#000",
        paddingRight: 5,
        fontSize: 16,
        textAlign: "right",
        // fontWeight: "700",
        marginLeft: 10,
    },
    timeReceiver: {
        color: "#001000",
        fontSize: 10,
        marginLeft: 10,
        textAlign: "left",
        left: 0,
        bottom: 0,
        marginTop: 5,
    },
    timeSender: {
        color: "#001000",
        // position: "absolute",
        bottom: 0,
        right: 0,
        textAlign: "right",
        fontSize: 10,
        marginRight: 5,
        marginTop: 5,
    },
    footer: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 15
    },
    textInput: {
        bottom: 0,
        height: 46,
        flex: 1,
        backgroundColor: "#ECECEC",
        borderRadius: 30,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderColor: "transparent",
        color: "grey"
    }
})