import React, { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { database } from '../config/firebase';
import { collection, doc, set, query, where, getDocs } from 'firebase/firestore';
import { StyleSheet, ImageBackground, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";

const ChatSpan = ({ chat, navigation }) => {
    const [messages, setMessages] = useState('');
    const uid = auth.currentUser.uid;

    useEffect(() => {
        const getChatId = async() => {
            const chatMessages = [];
            const q2 = query(collection(database, 'messages'), where("from", "==", uid));
            const querySnapshot2 = await getDocs(q2);
            querySnapshot2.forEach((doc) => {
                if (doc.data()['to'] === chat.uid && !chatMessages.includes(doc.data())) {
                    chatMessages.push(doc.data())
                }
            });
            const q = query(collection(database, 'messages'), where("to", "==", uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach((doc) => {
                if (doc.data()['from'] === chat.uid && !chatMessages.includes(doc.data())) {
                    chatMessages.push(doc.data())
                }
            });

            chatMessages.sort((a, b) => a.createdAt - b.createdAt)
            setMessages(chatMessages)
        }
        getChatId()
    }, [])
    let message;
    if (messages && messages.length > 0) {
        message = messages[messages.length - 1]
    }
    const text = message ? message.text : 'Start chatting...'

    return (
            <TouchableOpacity onPress={() => navigation.navigate('Chat', {otherUser: chat, data: messages})} >
                <View style={styles.container}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Text style={styles.title}>{chat.name}</Text>
                        <View style={styles.imageContainer}>
                            <Image style={styles.image} source={{uri: `${chat.profile_pic}`}} />
                        </View>
                    </View>
                    <Text style={styles.chatBox}>{text}</Text>
                    <Text style={styles.span}>{message?.date}</Text>
                </View>
            </TouchableOpacity>
        )
    
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        marginVertical: 10,
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderColor: '#268bd2',
        borderWidth: 2,
        borderRadius: 5
    },
    imageContainer: {
        height: 80,
        width: 80,
    },
    image: {
        width: "100%",
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 50
    },
    title: {
        fontSize: 20,
        color: '#268bd2',
        marginBottom: 5
    },
    chatBox: {
        paddingLeft: 10,
        fontSize: 20,
        color: 'gray'
    },
    span: {
        fontSize: 10,
        position: 'absolute',
        right: 5,
        top: 5,
        color: 'gray',
    }
})

export default ChatSpan;