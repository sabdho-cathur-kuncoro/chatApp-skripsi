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

const GrupChatScreen = ({navigation, route}) => {
    const [input, setInput] = useState("");
    const [userData, setUserData] = useState('');
    const [messages, setMessages] = useState([]);
    const [ chatsList, setChatsList ] = useState([]);
    const scrollViewRef = useRef();

    useEffect(()=> {
        const user = auth().currentUser.uid;

        const unsubscribe = firestore().collection('Users')
                                        .doc(user)
                                        .onSnapshot(documentSnapshot => {
                                            const userId = documentSnapshot.get('uid')
                                            const namaUser = documentSnapshot.get('Nama')
                                            const fotoUser = documentSnapshot.get('fotoProfil')

                                            setUserData({
                                                idUser: userId,
                                                nama: namaUser,
                                                foto: fotoUser
                                            })
                                        })
        return unsubscribe;
    },[])
    // console.log(userData);

    const createChats = ()=> {

        firestore().collection("groupChat")
            .doc(route.params.id)
            .collection("pesanGrup")
            .add({
                idPengirim: userData.idUser,
                namaPengirim: userData.nama,
                fotoPengirim: userData.foto,
                isiPesan: input,
                waktuPesan: firebase.firestore.FieldValue.serverTimestamp()
            });
            setInput("");

        firestore().collection("groupChat")
            .doc(route.params.id)
            .update({
                listWaktu: firebase.firestore.FieldValue.serverTimestamp(),
            });
    }
    useLayoutEffect(() => {
        const unsubscribe = firestore()
                            .collection("groupChat")
                            .doc(route.params.id)
                            .collection("pesanGrup")
                            .orderBy("waktuPesan", "asc")
                            .onSnapshot((snapshot)=> {
                                  const estimateTimestamps = {
                                    serverTimestamps: 'estimate'
                                  }
                                    setMessages(
                                        snapshot.docs.map((doc)=> ({
                                            id: doc.id,
                                            data: doc.data(),
                                            waktu: doc.get("waktuPesan") == null ? estimateTimestamps : doc.get("waktuPesan").toDate().toString()
                                        }))
                                    );
                            }
                            )
        
        return unsubscribe;
    }, [route]);
    console.log(messages);
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#FFF"}}
        >
            <StatusBar style="light-content" backgroundColor="#A1C6B9" />
            <View style={styles.header}>
                <TouchableOpacity 
                    activeOpacity={0.5}
                    style={{marginLeft: 10, flexDirection: "row"}}
                    onPress={()=> navigation.goBack()}
                    >
                    <AntDesign name="left" size={30} color="white" />
                    <Image 
                        source={{ 
                            uri: route.params.fotoGrup
                        }}
                        style={{marginLeft: 5, width: 32, height: 32, borderRadius: 10}}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    // activeOpacity={0.5}
                    onPress={()=> navigation.navigate("DetailGroup",{idGrup: route.params.id, groupName: route.params.namaGrup})}
                >
                    <View style={{marginLeft: 15, justifyContent: "center", height: "100%", width: 150}}>
                        <Text style={{fontSize: 22, color: "#fff"}}>{route.params.namaGrup}</Text>
                    </View>
                </TouchableOpacity>
            </View>

            <KeyboardAvoidingView 
                style={styles.screen} 
                keyboardVerticalOffset={90}
            >
                <>
                <ScrollView 
                ref={scrollViewRef}
                onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
                contentContainerStyle={{backgroundColor: "#FFF", paddingTop: 15}}>
                            {messages.map(({id, data, waktu})=> (
                                data.idPengirim === auth().currentUser.uid ? (
                                    <View key={id} style={styles.bubbles}>
                                        <View  style={styles.sender}>
                                            <Text style={styles.senderText}>{data.isiPesan}</Text>
                                            <Text style={styles.timeSender}>{moment(waktu).format('LT')}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.bubblesReceiver}>
                                        <Image source={{uri: data.fotoPengirim}} style={{width: 30, height: 30, borderRadius: 15, marginLeft: 5}} />
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

export default GrupChatScreen

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
        marginLeft: 5,
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
