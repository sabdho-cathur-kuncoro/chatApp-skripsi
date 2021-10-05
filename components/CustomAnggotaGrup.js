import React from 'react'
import { ListItem } from 'react-native-elements'
import { Image } from 'react-native'

const CustomAnggotaGrup = ({id, Nama, fotoProfil, bio, enterUser}) => {
    return (
        <ListItem 
            onPress={()=> enterUser(id,Nama,fotoProfil,bio)}
            containerStyle={{height: 80, backgroundColor: "#FFF"}}
            key={id} 
            activeOpacity={0.8}
            bottomDivider
        >
            <Image 
                source={{uri: fotoProfil || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}}
                style={{width: 44, height: 44, borderRadius: 12}}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                    {Nama}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                    {bio}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomAnggotaGrup
