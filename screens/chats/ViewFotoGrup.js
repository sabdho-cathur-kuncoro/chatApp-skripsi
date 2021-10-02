import React, { useEffect, useState } from 'react'
import { View, Text, SafeAreaView, StatusBar, TouchableOpacity, Image } from 'react-native'
import AntDesign from "react-native-vector-icons/AntDesign"
import firestore from "@react-native-firebase/firestore"
import storage from '@react-native-firebase/storage';
import ImagePicker from 'react-native-image-crop-picker';

const ViewFotoGrup = ({navigation, route}) => {
    const [dataGrup, setDataGrup] = useState([]);
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [transferred, setTransferred] = useState(0);

    useEffect(()=> {
        firestore().collection("groupChat")
        .doc(route.params.idGrup).onSnapshot(documentSnapshot=> {
            setDataGrup(documentSnapshot.data())
        })
    },[])

    const choosePhotoFromLibrary = ()=> {
        ImagePicker.openPicker({
            width: 800,
            height: 800,
            cropping: true,
            compressImageQuality: 0.7,
          }).then((image) => {
            console.log(image);
            const imageUri = Platform.OS === 'ios' ? image.sourceURL : image.path;
            setImage(imageUri);
            updateFotoGrup();
          });
    }

    // Upload Image
    const uploadImage = async () => {
        if( image == null ) {
          return null;
        }
        const uploadUri = image;
        let filename = uploadUri.substring(uploadUri.lastIndexOf('/') + 1);
    
        // Menambahkan timestamp ke nama file
        const extension = filename.split('.').pop(); 
        const name = filename.split('.').slice(0, -1).join('.');
        filename = name + Date.now() + '.' + extension;
    
        setUploading(true);
        setTransferred(0);
    
        const storageRef = storage().ref(`photos/${filename}`);
        const task = storageRef.putFile(uploadUri);
    
        // Set transferred state
        task.on('state_changed', (taskSnapshot) => {
          console.log(
            `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
          );
    
          setTransferred(
            Math.round(taskSnapshot.bytesTransferred / taskSnapshot.totalBytes) *
              100,
          );
        });
    
        try {
          await task;
    
          const url = await storageRef.getDownloadURL();
    
          setUploading(false);
          setImage(null);
    
          return url;
        } catch (e) {
          console.log(e);
          return null;
        }
    };

    const updateFotoGrup = async() => {
        let imgUrl = await uploadImage();

        if(imgUrl == null) {
        imgUrl = dataGrup.fotoGrup;
        }

        firestore().collection('groupChat').doc(route.params.idGrup)
            .update({
                fotoGrup: imgUrl
            })
    }

    return (
        <SafeAreaView style={{flex: 1, backgroundColor: "#000"}}>
            <StatusBar backgroundColor="#000" />

            <View style={{flex: 0.1, flexDirection: "row", alignItems: "center", justifyContent: "space-between"}}>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={{marginLeft: 10}}
                    onPress={navigation.goBack}
                >
                    <AntDesign name="arrowleft" size={28} color="white" />
                </TouchableOpacity>
                <View>
                    <Text style={{color: "white", fontSize: 22}}>{dataGrup.namaGrup}</Text>
                </View>
                <TouchableOpacity
                    activeOpacity={0.5}
                    style={{marginRight: 10}}
                    onPress={choosePhotoFromLibrary}
                >
                    <AntDesign name="edit" size={28} color="white" />
                </TouchableOpacity>
            </View>

            <View style={{flex: 1, marginTop: 20}}>
                <Image style={{width: "100%", height: 400}} source={{uri: dataGrup.fotoGrup}} />
            </View>
        </SafeAreaView>
    )
}

export default ViewFotoGrup
