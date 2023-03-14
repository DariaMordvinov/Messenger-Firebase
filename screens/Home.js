import React from 'react';
import { FlatList, StyleSheet, ImageBackground, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, doc, set, query, where, getDocs } from 'firebase/firestore';
import { database } from '../config/firebase';
import { useState, useEffect } from 'react';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import ChatSpan from '../components/ChatSpan';

export default function ChatList(props) {
    const [users, setUsers] = useState([]);

    const handleLogout = () => {
        signOut(auth).catch(error => console.log('Error logging out: ', error));
    };

    const uid = auth.currentUser.uid;

    useEffect(() => {
        const fetchUsers = async() => {
            const q = query(collection(database, 'users'));
            const querySnapshot = await getDocs(q);
            const fetchedUsers = [];
            querySnapshot.forEach((doc) => {
                const currentUser = doc.data();
                if (currentUser.name !== '' && currentUser.uid !== uid) {
                    fetchedUsers.push(currentUser);
                }
            });
            const unique = new Set(fetchedUsers);
            setUsers(Array.from(unique))
        }
        fetchUsers();
    }, [])

    return(
        <View style={styles.container}>
            <TouchableOpacity onPress={() => handleLogout()}>
                <View style={styles.logout}>
                    <Text style={styles.title}>Log Out</Text>
                </View>
            </TouchableOpacity>
            <View>
                <FlatList
                        data={users}
                        keyExtractor={item => Math.floor(Math.random() * 100)}
                        renderItem={(({ item }) => <ChatSpan 
                                                    navigation={props.navigation} 
                                                    chat={item} 
                                                    />)}
                        />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1
    },
    logout: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#268bd2'
    },
    title: {
        fontSize: 30,
        color: 'white',
    }
})