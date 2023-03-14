import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";

export default function Message({ message, otherUser, user }) {
    const [time, setTime] = useState();
    const [float, setFloat] = useState('flex-start');
    const [color, setColor] = useState('white');

    useEffect(() => {
        if (message.from === otherUser.uid) {
            setFloat('left');
            setColor('white');
            setTime('gray')
        } else {
            setFloat('flex-end');
            setColor('#268bd2');
            setTime('white')
        }
    }, [])
    return (
        <View style={[styles.message, {alignSelf: float, backgroundColor: color}]}>
            <Text style={[styles.span, {color: time}]}>{message.date}</Text>
            <Text style={{fontSize: 20}}>{message.text}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    message: {
        maxWidth: 300,
        minWidth: 120,
        borderWidth: 1,
        borderColor: '#268bd2',
        borderRadius: 5,
        padding: 5,
        margin: 6
    },
    span: {
        fontSize: 10,
        marginBottom: 4
    }
})