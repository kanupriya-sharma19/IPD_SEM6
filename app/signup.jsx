
import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Easing,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BubbleGroup from '../components/BubbleGroup';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignupScreen() {
  const inputOpacity = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(100)).current;
  const navigation = useNavigation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    Animated.stagger(300, [
      Animated.timing(inputOpacity, {
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
  }, []);

  const handleSignup = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await axios.post('https://passport-wl8y.onrender.com/user/signup', {
        email,
        password,
        confirmPassword,
      });

      const { userId } = res.data; 
  
      if (userId) {
        const loginRes = await axios.post('https://passport-wl8y.onrender.com/user/login', {
          email,
          password,
        });
  
        const token = loginRes.data.token; 
        console.log(token);
  
        if (token) {
          await AsyncStorage.setItem('authToken', token);
  
          Alert.alert('Success', 'Account created successfully!');
          navigation.replace('home'); 
        }
      }
    } catch (err) {
      console.error('Signup error:', err);
      const msg = err?.response?.data?.error || 'Signup failed';
      setErrorMessage(msg);
      setTimeout(() => setErrorMessage(''), 4000);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <BubbleGroup />

      <TouchableOpacity
        style={styles.backIcon}
        onPress={() => navigation.navigate('index')}
      >
        <Ionicons name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>

      <Text style={styles.header}>Create Your Magical{'\n'}Account!</Text>

      <Animated.View style={[styles.combinedInputContainer, { opacity: inputOpacity }]}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Parent’s Email</Text>
          <TextInput
            placeholder="demo@gmail.com"
            placeholderTextColor="#aaa"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.passwordWrapper, { borderColor: '#aaa', borderWidth: 1 }]}>
            <TextInput
              placeholder="••••••••"
              secureTextEntry={!showPassword}
              placeholderTextColor="#aaa"
              style={[styles.input, { flex: 1, borderWidth: 0 }]}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={22}
                color="#ff4d00"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={[styles.passwordWrapper, { borderColor: '#aaa', borderWidth: 1 }]}>
            <TextInput
              placeholder="••••••••"
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#aaa"
              style={[styles.input, { flex: 1, borderWidth: 0 }]}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
              <Ionicons
                name={showConfirmPassword ? 'eye' : 'eye-off'}
                size={22}
                color="#ff4d00"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>

      {errorMessage ? (
        <Text style={styles.errorText}>{errorMessage}</Text>
      ) : null}

      <Animated.View style={{ transform: [{ translateY: buttonSlide }] }}>
        <TouchableOpacity style={styles.loginButton} onPress={handleSignup} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginText}>Let’s begin!</Text>
          )}
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity style={styles.footerWrapper} onPress={() => navigation.navigate('login')}>
        <Text style={styles.footerText}>
          Already have an account? <Text style={styles.link}>Login here</Text>
        </Text>
      </TouchableOpacity>
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
    padding: 20,
    borderRadius: 25,
    marginBottom: 30,
  },errorText: {
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
  
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 10,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#000',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  loginButton: {
    backgroundColor: '#6D5DE8',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 2,
  },
  footerWrapper: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  
  footerText: {
    fontSize: 15,
    color: '#21032b',
    textAlign: 'center',
  },
  
  link: {
    color: '#ff4d00',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  
  link: {
    color: '#1976d2',
    textDecorationLine: 'underline',
  },
});


  {/* scroolview{[1,2,3,4,5,6,7,6,4,54].map((item)=>{
        return(<View style={{width:100,height:100,backgroundColor:"red",marginBottom:20,marginRight:20}}></View>)
      })}
      <View
      // can do horizontal also ,map method use kar sakte ho for repeative divs display
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: 20, // Ensure there is space at the bottom of the page
        }}
      > */} 
      //iske jagah use flaglist
      // <FlagList data={[1,2,3,4,5,3,]} horizontal contentConiatinerStyle={{}}
      // numColumns={3} grid main boxes>
      // renderItem={({item})}=>{
      //   retrun (<View></View>)
      // }
      // jsx main java script likhne ke liye we use {}
      // <text>{{item}}
      //header footer bhi add kar sakte ho