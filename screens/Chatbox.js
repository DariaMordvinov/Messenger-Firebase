import React, {     
    useState,
    useEffect,
    useLayoutEffect,
    useCallback } from 'react';
import { StyleSheet, FlatList, ScrollView, ImageBackground, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import {
    collection,
    addDoc,
    orderBy,
    query,
    onSnapshot,
    where
  } from 'firebase/firestore';
import { auth, database } from '../config/firebase';
import Message  from '../components/Message';

export default function Chatbox({route}) {
    const { otherUser, data } = route.params;
    const [messages, setMessages] = useState(data);
    const [messagesTo, setMessagesTo] = useState([]);
    const [messagesFrom, setMessagesFrom] = useState([]);
    const [text, setText] = useState('')
    const user = auth.currentUser.uid;

    const handleSend = async() => {
        if (text === '') return;
        const now = new Date();
        let time = now.getHours() + ':' + now.getMinutes();
        const day = now.getDate();
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        const month = months[now.getMonth()];
        time += `, ${day} ${month}`;
        setMessages([...messages, {date: time,
            from: user,
            to: otherUser.uid,
            text: text}])
        setText('')
        try {
            await addDoc(collection(database, 'messages'), {
                date: time,
                from: user,
                to: otherUser.uid,
                text: text
              });
        } catch(er) {
            console.log(er)
        }
    }

    function getMessagesTo() {
        const collectionRef = collection(database, 'messages');
        const q = query(collectionRef, orderBy('createdAt', 'desc'), where("to", "==", user));
        onSnapshot(q, querySnapshot => {
            const filtered = querySnapshot.docs.filter(doc => {doc.to === otherUser.uid})
            setMessagesTo(filtered);
        });
    }
    function getMessagesFrom() {
        const collectionRef = collection(database, 'messages');
        const q = query(collectionRef, orderBy('createdAt', 'desc'), where("from", "==", user));
        onSnapshot(q, querySnapshot => {
            const filtered = querySnapshot.docs.filter(doc => {doc.to === otherUser.uid})
            setMessagesFrom(filtered);
        });
    }

    useEffect(() => {
        getMessagesTo();
        getMessagesFrom()
        const allMessages = [...messagesTo, ...messagesFrom].sort((a, b) => a.timestamp - b.timestamp);
        if (allMessages.length > 0) setMessages(allMessages);
    }, [])

    return (
        <>
        <View style={{flex: 1}}>
            <View style={[styles.topBar]}>
                <View style={styles.imageContainer}>
                    <Image style={styles.image} source={{uri: `${otherUser.profile_pic}`}} />
                </View>
                <Text style={styles.title}>Chat with {otherUser.name}</Text>
            </View>
            <ScrollView style={styles.messages}>
                <SafeAreaView>
                    <FlatList data={messages}
                            keyExtractor={item => Math.floor(Math.random() * 100)}
                            renderItem={(({ item }) => <Message message={item}
                                                                otherUser={otherUser}
                                                                user={auth.currentUser}
                                                            />)} />
                </SafeAreaView>
            </ScrollView>
        </View>
        <TextInput editable
                        multiline
                        numberOfLines={4}
                        maxLength={40}
                        onChangeText={text => setText(text)}
                        value={text}
                        style={styles.block} />
        <TouchableOpacity onPress={() => handleSend()}>
            <Text style={styles.send}>Send</Text>
        </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#268bd2',
        padding: 10
    },
    title: {
        fontSize: 30,
        color: 'white'
    },
    imageContainer: {
        height: 80,
        width: 80,
        margin: 10
    },
    image: {
        width: "100%",
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 50
    },
    messages: {
        width: '100%',
        marginVertical: 7
    },
    block: {
        marginBottom: 0,
        width: '100%',
        backgroundColor: 'white',
        height: 150,
        bottom: 0,
        padding: 10,
        fontSize: 17
    },
    send: {
        backgroundColor: 'white',
        padding: 20,
        fontSize: 25,
        color: '#268bd2'
    }
})