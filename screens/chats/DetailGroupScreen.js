import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image, ImageBackground, ScrollView } from 'react-native';
import { Button, Input } from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import Icon from "react-native-vector-icons/FontAwesome";
import Ionicons from 'react-native-vector-icons/Ionicons'
import AntDesign from 'react-native-vector-icons/AntDesign';
import moment from 'moment';


import auth, { firebase } from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import CustomAnggotaGrup from '../../components/CustomAnggotaGrup';

const DetailGroupScreen = ({navigation, route}) => {
    const [detailGroup, setDetailGroup] = useState([]);
    const [jumlahAnggota, setJumlahAnggota] = useState("");
    const [anggotaGrup, setAnggotaGrup] = useState([]);
    const [waktu, setWaktu] = useState([]);
    const [userData, setUserData] = useState([]);
    // const [admin, setAdmin] = useState([]);

    useEffect(()=>{
        const unsubscribe = firestore().collection("groupChat")
                                        .doc(route.params.idGrup)
                                        .onSnapshot(documentSnapshot => {
                                            // console.log(documentSnapshot.data());
                                            setDetailGroup(
                                                documentSnapshot.data()
                                            )
                                            // Set Timestamp to Date
                                            const timestamp = documentSnapshot.get("waktuBuatGrup");
                                            if(timestamp == null){
                                                return "";
                                            }else {
                                                setWaktu(documentSnapshot.get("waktuBuatGrup").toDate().toString())
                                            }
                                            // setParticipants({
                                            //         anggotaGrup: documentSnapshot.get("anggotaGrup")
                                            //     })
                                        })
        return unsubscribe;
    },[])
    
    // Get Total Users
    useEffect(()=> {
        const unsubscribe = firestore().collection("Users")
                                        .where('Group', 'array-contains', route.params.idGrup)
                                        .onSnapshot(querySnapshot => {
                                            console.log('Total users: ', querySnapshot.size);
                                            setJumlahAnggota(querySnapshot.size);
                                        })
                            
        return unsubscribe;
    },[])

    // Get Data User
    const getDataUser= ()=> {
            const idGrup = route.params.idGrup;

            firestore().collection("Users")
            .where('Group', 'array-contains', idGrup)
            .onSnapshot((snapshot) =>
                setUserData(snapshot.docs.map((doc)=> ({
                    id: doc.id,
                    data: doc.data(),
                    })))
            );
    }
    useEffect(()=> {
        const unsubscribe = getDataUser();

        return unsubscribe;
    },[])

    console.log(userData);
    // console.log(detailGroup);
    // console.log(anggotaGrup);
    const enterUser = (id, Nama, fotoProfil, bio)=> {
        navigation.navigate("DetailUser", {
            id,
            Nama,
            fotoProfil,
            bio
        })
    }

    useLayoutEffect(()=> {
        navigation.setOptions({
            title: route.params.groupName,
            headerBackTitleVisible: false,
            headerStyle: {backgroundColor: "#A1C6B9", elevation: 0},
            headerTintColor: "#FFF",
            headerTitleAlign: "center",
            // headerBackTitle: "Chats",
            headerLeft: ()=> (
                    <TouchableOpacity 
                        style={{marginLeft: 10, flexDirection: "row", alignItems: "center"}}
                        onPress={navigation.goBack}
                        >
                        <AntDesign name="left" size={30} color="white" />
                        <Text style={{color: "#FFF", fontSize: 16}}>Go Back</Text>
                    </TouchableOpacity>
            ),
        })
    }, []);
    // console.log(route.params.idGrup);
    return (
        <View style={{flex: 1, backgroundColor: "#ECECEC"}}>
            <ScrollView>
            <ImageBackground
                source={{
                    uri: detailGroup.fotoGrup
                }}
                style={{width: "100%", height: 300, justifyContent: "flex-end"}}
            >
                <View style={{marginLeft: 5}}>
                    <Text style={{fontSize: 22, color: "#fff"}}>{route.params.groupName}</Text>
                    <Text style={{fontSize: 18, color: "#fff"}}>{moment(waktu).format('LLL')}</Text>
                </View>
            </ImageBackground>
            <View style={{backgroundColor: "#FFF", width: "100%", height: 56}}>
                <View style={{paddingLeft: 5}}>
                    <Text style={{fontSize: 22, color: "#8ed1ba"}}>Description</Text>
                    <Text style={{fontSize: 20}}>{detailGroup.deskripsiGrup}</Text>
                </View>
            </View>
            <View style={{backgroundColor: "#FFF", marginTop: 5, width: "100%", flex: 1}}>
                <View style={{paddingLeft: 5, justifyContent: "space-between"}}>
                    
                        <TouchableOpacity 
                        // key={id}
                        style={{flexDirection: "row", alignItems: "center", marginVertical: 5}}
                        onPress={()=> navigation.navigate("AddParticipant", {idGrup: route.params.idGrup})}
                        activeOpacity={0.5}
                    >
                        <View style={{width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", backgroundColor: "#8ed1ba"}}>
                            <AntDesign name="addusergroup" size={30} color="#FFF" />
                        </View>
                        <Text style={{fontSize: 20, marginLeft: 5}}>Add Participants</Text>
                    </TouchableOpacity>                                            
                    
                    <Text style={{fontSize: 22, color: "#8ed1ba"}}>{jumlahAnggota} Participants</Text>

                {/* <ScrollView style={{flex: 1, backgroundColor: "#000"}}> */}
                    {
                        userData.map(({id,data: {Nama,fotoProfil,bio }})=> (
                            <CustomAnggotaGrup 
                                key={id}
                                id={id}
                                Nama={Nama}
                                fotoProfil={fotoProfil}
                                bio={bio}
                            />
                        ))
                    }
                {/* </ScrollView> */}
                </View>
            </View>
            <TouchableOpacity
                onPress={()=> alert("aw!")} 
                style={{backgroundColor: "#FFF", marginTop: 5, marginLeft: 10, flexDirection: "row", width: "100%", height: 50, alignItems: "center", justifyContent: "flex-start"}}
            >
                    <AntDesign name="logout" size={22} color="red" />
                    <Text style={{fontSize: 18, color: "red", marginLeft: 10}}>EXIT GROUP</Text>
            </TouchableOpacity>
            </ScrollView>

        </View>
    )
}

export default DetailGroupScreen

const styles = StyleSheet.create({})