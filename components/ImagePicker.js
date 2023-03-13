import React, { useState, useEffect } from 'react';
import { Button, Image, View, Platform, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ImagePickerExample({ setImage, image }) {

  const pickImage = async () => {
    console.log(image)
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.button}>
      <Button style={styles.text} title="Choose profile pic" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 120, height: 120, borderRadius: 6 }} />}
    </View>
  );
}

const styles = StyleSheet.create({
    button: {
        borderColor: '#268bd2',
        backgroundColor: 'white',
        alignItems: 'center', 
        justifyContent: 'center',
        borderRadius: 9,
        marginTop: 9,
        borderColor: 'gray',
        borderWidth: 1,
        paddingBottom: 5
    },
    text: {
        color: 'black'
    }
})