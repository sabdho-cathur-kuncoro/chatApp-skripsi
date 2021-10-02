import React, { useEffect, useState } from 'react'
import { Image, Text, View, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const ViewImageChat = ({navigation, route}) => {
    const [user, setUser] = useState([]);
    const userLogin = auth().currentUser.uid;
    const routeUser = route.params.users;

    useEffect(()=> {
        firestore().collection("Users").doc(routeUser)
        .onSnapshot(documentSnapshot => {
            setUser(documentSnapshot.data())
        });
    },[])

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#000"}}>
            
            <StatusBar backgroundColor="#000" />
            <View style={{flexDirection: "row", width: "100%", height: 60, alignItems: "center"}}>
                <TouchableOpacity style={{marginLeft: 5}} onPress={navigation.goBack}>
                    <AntDesign name="arrowleft" size={28} color="white" />
                </TouchableOpacity>
                <Text style={{color: "#FFF", fontSize: 22, marginLeft: 10}}>{userLogin === routeUser ? "You" : user.Nama}</Text>
            </View>
        
            <View style={{height: 500}}>
                <Image source={{uri : route.params.img}} style={{width: "100%", height: 500}} />
            </View>
            <View style={{height: 50, alignItems: "center", justifyContent: "center"}}>
                <Text style={{color: "#FFF", fontSize: 22}}>{route.params.caption}</Text>
            </View>
            
        </SafeAreaView>
    )
}

export default ViewImageChat