import React, { useState } from 'react';
import { StyleSheet, ImageBackground, Text, View, Button, TextInput, Image, SafeAreaView, TouchableOpacity, StatusBar, Alert } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { storage } from '../config/firebase'
import { auth } from '../config/firebase';
import { database } from '../config/firebase'
const backgroundImage = require('../assets/pattern.jpg');
import ImagePicker from '../components/ImagePicker';


function uniqueID() {
    return Math.floor(Math.random() * Date.now())
}

const Signup = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('')
    const [uid, setUid] = useState('');
    const [image, setImage] = useState(null);

    const handleUpload = async (image) => {
        const response = await fetch(image);
        const blobFile = await response.blob();
        const imageName = uniqueID().toString();
        const reference = ref(storage, imageName);
        const result = await uploadBytes(reference, blobFile);
        const url = await getDownloadURL(result.ref);

        // save user's profile pic's url
        await updateProfile(auth.currentUser, {
            photoURL: url
        });

        try {
            await addDoc(collection(database, 'users'), {
                uid: auth.currentUser.uid,
                name: username,
                profile_pic: url
            })
        } catch(er) {
            console.log(er)
        }



    }

    const handleSignup = () => {
        if (email !== '' && password != '') {
            createUserWithEmailAndPassword(auth, email, password)
                .then((response) => {
                    setUid(response.user.uid);
                })
                .then(() => handleUpload(image))
                .catch((err) => console.log("Login error", err.message));
        }
    }

    return (
        <View style={styles.container}>
            <Image source={backgroundImage} style={styles.image} />
            <View style={styles.inputArea}>
                <TextInput onChangeText={(text) => setUsername(text)}
                            value={username}
                            autoCapitalize="none"
                            placeholder="Enter username..."
                            autoCorrect={false}
                            style={styles.input}
                                />
                <TextInput onChangeText={(text) => setEmail(text)}
                        value={email}
                        autoCapitalize="none"
                        placeholder="Enter email..."
                        autoCorrect={false}
                        style={styles.input}
                            />
                <TextInput onChangeText={(text) => setPassword(text)}
                        value={password}
                        autoCapitalize="none"
                        placeholder="Enter password..."
                        style={styles.input}
                        autoCorrect={false}
                        secureTextEntry={true}
                            />
                <ImagePicker image={image} setImage={setImage} />
                <TouchableOpacity style={styles.button} onPress={handleSignup}>
                    <Text style={styles.text}> Sign Up</Text>
                </TouchableOpacity
                ><TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.text}>Go to Login</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: "100%",
        position: "absolute",
        top: 0,
        resizeMode: 'cover',
    },
    input: {
        borderColor: '#268bd2',
        borderWidth: 2,
        borderRadius: 9,
        paddingHorizontal: 6,
        fontSize: 30,
        width: 260,
        height: 60,
        marginVertical: 10,
        backgroundColor: 'white'
    },
    inputArea: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 18,
        backgroundColor: '#268bd2',
        width: 260,
        height: 60,
    },
    text: {
        color: 'white',
        fontSize: 25
    }
})

export default Signup;