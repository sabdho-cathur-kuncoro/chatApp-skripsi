import React from 'react'
import { ListItem } from 'react-native-elements'
import { Image, TouchableOpacity } from 'react-native'
import AntDesign from 'react-native-vector-icons/AntDesign';

const CustomTambahAnggota = ({id,displayName,displayFoto,bio, tambahAnggota}) => {
    return (
        <ListItem 
            containerStyle={{height: 80}}
            key={id} 
            activeOpacity={0.8}
            bottomDivider
        >
            <Image 
                source={{uri: displayFoto || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'}}
                style={{width: 44, height: 44, borderRadius: 12}}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                    {displayName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {bio}
                </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Content></ListItem.Content>
            <ListItem.Content style={{alignItems: "flex-end", marginRight: 10}}>
                <TouchableOpacity onPress={()=> tambahAnggota(id,displayName, displayFoto, bio)}>
                    <AntDesign name="addusergroup" size={36} color="#8ed1ba" />
                </TouchableOpacity>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomTambahAnggota
