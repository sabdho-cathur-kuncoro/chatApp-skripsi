import React, { useEffect, useState, useLayoutEffect, useRef } from 'react'
import { 
    View, Text, ScrollView, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, TextInput 
} from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import moment from 'moment'
import auth, { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImagePicker from 'react-native-image-crop-picker';

const CreateChatPersonal = ({navigation, route}) => {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [waktu, setWaktu] = useState([]);
    const scrollViewRef = useRef();

    const user = auth().currentUser.uid;
    const user2 = route.params.id; // UID user 2
    const users = [user , user2];
    
    const idPersonal = user +'_'+ user2; // ID Personal Chat

    useEffect(()=> {
        const unsubscribe = 
                            firestore()
                            .collection("personalChat")
                            .doc(idPersonal)
                            .collection("pesanPersonal")
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

    // Pilih Gambar dari Galeri
    const choosePhotoFromLibrary = ()=> {
        ImagePicker.openPicker({
            width: 800,
            height: 800,
            cropping: true,
            compressImageQuality: 0.7,
          }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            navigation.navigate("PreviewImage", {
                image: imageUri,
                chatID: idPersonal
            })
          });
    }

    // Kirim Pesan
    const sendMessage = ()=> {
        firestore()
            .collection("personalChat")
            .doc(idPersonal)
            .collection("pesanPersonal")
            .add({
                waktuPesan: firebase.firestore.FieldValue.serverTimestamp(),
                chatsID: idPersonal,
                isiPesan: input,
                idPengirim: user,
                tipePesan: "teks"
            });
        
            setInput("");
    };
    const createChatlist = ()=> {
            firestore().collection("personalChat").doc(idPersonal).set({
                users: [user, user2],
                listWaktu: firebase.firestore.FieldValue.serverTimestamp()
            },{ merge: true })
    }
    const createChats =  ()=> {
        sendMessage();
        createChatlist();
    }

    // Menampilkan isi bubble chat
    useLayoutEffect(() => {
        const unsubscribe = firestore()
                            .collection("personalChat")
                            .doc(idPersonal)
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

    return(
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#FFF"}}
        >
            <StatusBar style="light-content" backgroundColor="#A1C6B9" />
            
            {/* Header */}
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
                        }}
                        style={{marginLeft: 5, width: 32, height: 32, borderRadius: 10}}
                    />
                </TouchableOpacity>
                <TouchableOpacity 
                    activeOpacity={0.5}
                    style={{marginLeft: 15}}
                    onPress={()=> navigation.navigate("DetailUser", {idUser: users})}
                >
                    <Text style={{fontSize: 22, color: "#fff"}}>{route.params.displayName}</Text>
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
                    contentContainerStyle={{backgroundColor: "#FFF", paddingTop: 15}}
                >
                            {/* Bubble Chat */}
                            {messages.map(({id, data})=> (
                                data.idPengirim === auth().currentUser.uid ? (
                                    <View key={id} style={styles.bubbles}>
                                        <View  style={styles.sender}>
                                        {data.tipePesan === "teks" ? (
                                                <Text style={styles.senderText}>{data.isiPesan}</Text>
                                            ) : (
                                                <>
                                                <TouchableOpacity activeOpacity={0.7} onPress={()=> navigation.navigate("ViewImage",{img: data.urlGambar, caption: data.isiPesan})}>
                                                    <Image source={{uri: data.urlGambar}} style={{width: 200, height: 200, borderRadius: 10}} />
                                                </TouchableOpacity>
                                                <Text>{data.isiPesan}</Text>
                                                </>
                                                )
                                            }
                                            <Text style={styles.timeSender}>{moment(waktu).format('LT')}</Text>
                                        </View>
                                    </View>
                                ) : (
                                    <View key={id} style={styles.bubblesReceiver}>
                                        <View style={styles.receiver}>
                                            {data.tipePesan === "teks" ? (
                                                <Text style={styles.receiverText}>{data.isiPesan}</Text>
                                            ) : (
                                                <>
                                                <TouchableOpacity activeOpacity={0.7} onPress={()=> navigation.navigate("ViewImage", {img: data.urlGambar, caption: data.isiPesan})}>
                                                    <Image source={{uri: data.urlGambar}} style={{width: 200, height: 200, borderRadius: 10}} />
                                                </TouchableOpacity>
                                                <Text>{data.isiPesan}</Text>
                                                </>
                                            )}
                                            <Text style={styles.timeReceiver}>{moment(waktu).format('LT')}</Text>
                                        </View>
                                    </View>
                                )
                            ))}
                            {/* End Bubble Chat */}
                </ScrollView>

                <View style={styles.footer}>
                    <View style={styles.textInput}>
                        <TextInput 
                            value={input}
                            onChangeText={(text)=> setInput(text)}
                            onSubmitEditing={createChats}
                            placeholder="Ketik pesan.."
                            placeholderTextColor="#757474"
                        />
                        <TouchableOpacity onPress={choosePhotoFromLibrary} activeOpacity={0.8} style={{justifyContent: "center"}}>
                            <AntDesign name="paperclip" size={28} color="#7a7878" />
                        </TouchableOpacity>
                    </View>
                    
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
        flexDirection: "row", 
        justifyContent: "flex-end"
    },
    bubblesReceiver: {
        width: "100%", 
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginLeft: 5
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
        marginLeft: 10,
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
        height: 48,
        flex: 1,
        backgroundColor: "#ECECEC",
        borderRadius: 30,
        paddingHorizontal: 15,
        borderColor: "transparent",
        color: "#000",
        flexDirection: "row",
        justifyContent: "space-between"
    }
})