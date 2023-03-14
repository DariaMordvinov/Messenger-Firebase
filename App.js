import { StyleSheet, Text, View,  ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import ChatList from './screens/Home';
import Signup from './screens/Signup';
import Login from './screens/Login'
import Chatbox from './screens/Chatbox';
import { createContext, useContext, useState, useEffect } from 'react';

const Stack = createStackNavigator();
const AuthenticatedUserContext = createContext({});


const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Login' component={Login} />
      <Stack.Screen name='Signup' component={Signup} />
    </Stack.Navigator>
  );
}

const ChatStack = () => {
  return (
      <Stack.Navigator>
        <Stack.Screen name='Home' component={ChatList} />
        <Stack.Screen name='Chat' component={Chatbox} />
      </Stack.Navigator>
  )
}

const HomePage = () => {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      const unsubscribeAuth = onAuthStateChanged(
        auth,
        async authenticatedUser => {
          authenticatedUser ? setUser(authenticatedUser) : setUser(null);
          setIsLoading(false);
      }
    );
    return unsubscribeAuth;
  }, [user]);

  if (isLoading) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size='large' />
        </View>
      );
  }

  return (
    <NavigationContainer>
      {user ? <ChatStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <HomePage />
    </AuthenticatedUserProvider>
  );
}
