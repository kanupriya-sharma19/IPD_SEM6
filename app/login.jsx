import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, StyleSheet, Easing, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BubbleGroup from '../components/BubbleGroup';
export default function LoginScreen() {
  const emailOpacity = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(100)).current;
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
       
        navigation.replace('home');
      }
    };

    checkLoginStatus();

    Animated.stagger(300, [
      Animated.timing(emailOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(buttonSlide, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [navigation]);

  const handleLogin = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await axios.post('https://passport-wl8y.onrender.com/user/login', {
        email,
        password,
      }, {
        withCredentials: true,
      });
  
      const token = res.data.token; 
  console.log(token);
      if (token) {
        await AsyncStorage.setItem('authToken', token);  
        Alert.alert('Success', 'Logged in successfully!');
                if (navigation) {
          navigation.replace('home');  
        } else {
          throw new Error('Navigation object is undefined');
        }
      } else {
        throw new Error('Token is undefined');
      }
    } catch (err) {
      const message = err?.response?.data?.error || 'Login failed';
      setErrorMsg(message);
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
       <BubbleGroup />
      <TouchableOpacity style={styles.backIcon} onPress={() => navigation.replace('index')}>
        <Ionicons name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Log In To Your{'\n'}Magical Account!</Text>

      <Animated.View style={[styles.combinedInputContainer, { opacity: emailOpacity }]}>
        <View style={styles.inputGroupTop}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            placeholder="demo@gmail.com"
            style={styles.input}
            placeholderTextColor="#aaa"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroupBottom}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="••••••••••"
              secureTextEntry={!showPassword}
              style={[styles.input, { flex: 1 }]}
              placeholderTextColor="#aaa"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons name={showPassword ? 'eye' : 'eye-off'} size={20} color="black" />
            </TouchableOpacity>
            
          </View>
        </View>
        
        <View style={styles.forgotWrapper}>
  <TouchableOpacity onPress={() => navigation.navigate('forgotPassword')}>
    <Text style={styles.forgot}>Forgot Password?</Text>
  </TouchableOpacity>
</View>


      </Animated.View>

      {errorMsg ? (
        <Text style={styles.errorText}>{errorMsg}</Text>
      ) : null}

      <Animated.View style={{ transform: [{ translateY: buttonSlide }] }}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Let’s continue!</Text>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#D2AFF0',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'center',
  },
  backIcon: {
    position: 'absolute',
    top: 50,
    left: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    color: '#211C4D',
    marginBottom: 40,
  },
  combinedInputContainer: {
    width: '100%',
    backgroundColor: '#rgba(109,93,232,0.85)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  inputGroupTop: {
    borderBottomWidth: 1,
    borderColor: '#a3dfe0',
    paddingBottom: 20,
    marginBottom: 20,
  },
  inputGroupBottom: {},
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#211C4D',
    textAlign: 'center',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    paddingLeft: 15,
    fontSize: 16,
    color: '#000',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  forgotWrapper: {
    alignSelf: 'flex-end',
    marginTop: 14,
    marginBottom: 15,
    paddingRight: 5,
  },
  
  forgot: {
    color: '#0000FF',
    
    fontSize: 14,
    textDecorationLine: 'underline',
    letterSpacing: 0.5,
  },
  
  loginButton: {
    backgroundColor: '#6D5DE8',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    alignItems: 'center',
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  // errorBox: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   backgroundColor: '#ff4d4f',
  //   padding: 10,
  //   borderRadius: 12,
  //   marginBottom: 20,
  //   shadowColor: '#000',
  //   shadowOffset: { width: 0, height: 2 },
  //   shadowOpacity: 0.2,
  //   shadowRadius: 4,
  //   elevation: 3,
  // },
  
  errorText: {
    color: '#ff0033',
    textAlign: 'center',
    marginBottom: 10,
    fontWeight: 'bold',
    fontSize: 16,
    backgroundColor: '#ffe6e6',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ff4d00',
  },
});



// screens/login.jsx
// import React from 'react';

// const LoginScreen = () => {
//   return (
//     <div>Login</div> // Your actual JSX here
//   );
// };

// export default LoginScreen;  // Default export
