import React, { useEffect, useState } from 'react';
import { StyleSheet, Image } from 'react-native';
import { ListItem } from 'react-native-elements';

const CustomListItem = ({ id, displayName, displayFoto, createChat }) => {

    return (
        <ListItem
            containerStyle={{height: 80}}
            key={id} 
            activeOpacity={0.8}
            bottomDivider
            onPress={() => createChat(id,displayName,displayFoto)}
        >
            <Image
                style={{width: 42, height: 42, borderRadius: 10}}
                source={{uri: displayFoto}}
            />
            <ListItem.Content>
                <ListItem.Title style={{fontWeight: "bold", fontSize: 16}}>
                    {displayName}
                </ListItem.Title>
            </ListItem.Content>
            <ListItem.Chevron size={32} />
        </ListItem>
    )
}

export default CustomListItem;

const styles = StyleSheet.create({});
