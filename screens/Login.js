import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
import { useState } from 'react';
const backgroundImage = require('../assets/pattern.jpg');

const Login = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (email !== "" && password !== "") {
            signInWithEmailAndPassword(auth, email, password)
              .then(() => console.log('Success'))
              .catch((err) => console.log("Login error", err.message));
        }
    }
    return (
        <View style={styles.container}>
            <Image source={backgroundImage} style={styles.image} />
            <View style={styles.inputArea}>
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
                <TouchableOpacity style={styles.button} onPress={handleLogin}>
                    <Text style={styles.text}> Log In</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.text}>Go to Sign Up</Text>
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

export default Login;