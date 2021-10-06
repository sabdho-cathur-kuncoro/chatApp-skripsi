import React, { useEffect, useState } from 'react'
import { Image, Text, View, SafeAreaView, StatusBar, TouchableOpacity } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

const ViewImageChat = ({navigation, route}) => {
    const [user, setUser] = useState([]);
    const userLogin = auth().currentUser.uid;
    const routeUser = route.params.users;
    const timestamp = route.params.waktu;

    useEffect(()=> {
        firestore().collection("Users").doc(routeUser)
        .onSnapshot(documentSnapshot => {
            setUser(documentSnapshot.data())
        });
    },[])
    console.log(timestamp);
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#000"}}>
            
            <StatusBar backgroundColor="#000" />
            {/* Header */}
            <View style={{flexDirection: "row", flex: 0.1, alignItems: "center"}}>
                <TouchableOpacity style={{marginLeft: 5}} onPress={navigation.goBack}>
                    <AntDesign name="arrowleft" size={28} color="white" />
                </TouchableOpacity>
                <View style={{width: "100%", marginLeft: 10, padding: 5, marginBottom: 5}}>
                    <Text style={{color: "#FFF", fontSize: 22, marginTop: 10}}>{userLogin === routeUser ? "You" : user.Nama}</Text>
                    <Text style={{color: "#FFF"}}>{moment(timestamp).fromNow()}</Text>
                </View>
            </View>
            {/* End Header */}
        
            <View style={{flex: 1, alignItems: "center"}}>
                <Image source={{uri : route.params.img}} style={{width: "100%", height: 400}} />
                <Text style={{color: "#FFF", fontSize: 22, padding: 15}}>{route.params.caption}</Text>
            </View>
        </SafeAreaView>
    )
}

export default ViewImageChat