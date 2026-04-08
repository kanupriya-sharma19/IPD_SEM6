import { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Animated, Alert, ActivityIndicator, Image,StyleSheet ,Easing} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import * as ImagePicker from 'expo-image-picker'; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import BubbleGroup from '../components/BubbleGroup';

export default function ProfileScreen() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [grade, setGrade] = useState('');
  const [age, setAge] = useState('');
  const [mobile, setMobile] = useState('');
  const [profileImage, setProfileImage] = useState(null); 
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const inputOpacity = useRef(new Animated.Value(0)).current;
  const buttonSlide = useRef(new Animated.Value(100)).current;
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

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem('authToken');
        if (token) {
          setIsAuthenticated(true);

          const res = await axios.get('https://passport-wl8y.onrender.com/user/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });

          const userData = res.data.user;
          setUser(userData);
          setEmail(userData.email || '');
          setUsername(userData.username || '');
          setGrade(userData.grade || '');
          setAge(userData.age?.toString() || '');
          setMobile(userData.mobile_no || '');
          setProfileImage(userData.profile_image || null);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleImagePick = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setProfileImage(result.assets[0].uri);
    }
    
  };

  const handleSave = async () => {
    
    setErrorMessage('');
    if (!isAuthenticated) {
      Alert.alert('Authentication Required', 'Please log in to edit your profile');
      navigation.navigate('login');
      return;
    }

    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('authToken');

      const formData = new FormData();
      formData.append('email', email);
      formData.append('username', username);
      formData.append('grade', grade);
      formData.append('age', age);
      formData.append('mobile_no', mobile);

      if (profileImage) {
        const imageData = {
          uri: profileImage,
          type: 'image/jpeg',
          name: profileImage.split('/').pop(),
        };
        formData.append('profile_image', imageData);
      }

      const res = await axios.put(
        'https://passport-wl8y.onrender.com/user/profile',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Alert.alert('Success', 'Profile updated successfully');
      navigation.navigate('home');
    } catch (error) {

      console.error(error);
      console.error('Signup error:', error);
      const msg = error?.response?.data?.error || 'Profile Updation Failed';
      setErrorMessage(msg);
setTimeout(() => setErrorMessage(''), 4000);

    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
    <BubbleGroup />
    <TouchableOpacity style={styles.backIcon} onPress={() => navigation.navigate('home')}>
      <Ionicons name="arrow-back" size={30} color="#000" />
    </TouchableOpacity>
    
    <Text style={styles.header}>Profile</Text>
  
    {isAuthenticated ? (
      <View style={styles.combinedInputContainer}>
  
        <View style={styles.profileImageContainer}>
          <Image
            source={profileImage ? { uri: profileImage } : require('../assets/my.jpg')}
            style={styles.profileImage}
          />
          <TouchableOpacity style={styles.changeImageButton} onPress={handleImagePick}>
            <Text style={styles.changeImageText}>Change Profile Picture</Text>
          </TouchableOpacity>
        </View>
  
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: '#eee' }]}
            value={email}
            placeholder="demo@gmail.com"
            onChangeText={setEmail}
            editable={false}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
  
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            value={username}
            placeholder="What would u like to be called"
            onChangeText={setUsername}
          />
        </View>
  
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Grade</Text>
          <TextInput
            style={styles.input}
            value={grade}
            placeholder="Your Grade"
            onChangeText={setGrade}
          />
        </View>
  
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            value={age}
            placeholder="Your Age"
            keyboardType="numeric"
            onChangeText={setAge}
          />
        </View>
  
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Mobile No</Text>
          <TextInput
            style={styles.input}
            value={mobile}
            placeholder="Your phone number"
            keyboardType="phone-pad"
            onChangeText={setMobile}
          />
        </View>
  
        {errorMessage ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        ) : null}
  
      </View>
    ) : (
      <View style={styles.profileImageContainer}>
        <Text style={styles.message}>Please log in to edit your profile.</Text>
      </View>
    )}
  
    <Animated.View style={{ transform: [{ translateY: buttonSlide }] }}>
      <TouchableOpacity style={styles.loginButton} onPress={handleSave}>
        {loading ? (
          <View style={styles.loaderInsideButton}>
            <ActivityIndicator size="small" color="#fff" />
          </View>
        ) : (
          <Text style={styles.loginText}>Save Changes</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  </View>
  
      )}


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
    top: 45,
    left: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    color: '#211C4D',
    marginTop:'20'
  },
  combinedInputContainer: {
    width: '100%',
    backgroundColor: 'rgba(109,93,232,0.85)',
    padding: 10,
    borderRadius: 25,
    marginBottom: 20
  },changeImageButton: {
    marginTop: 10,
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
  },errorContainer: {
    marginTop: 0,
    marginBottom: 0,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  
  changeImageText: {
    color: '#000',
    fontWeight: '500',
    textAlign: 'center',
  },
  
  
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
    letterSpacing: 2,
    marginBottom: 10,
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
  
  loaderInsideButton: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', 
  },
  profileImageContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50, 
    borderWidth: 2,
    borderColor: '#000',
  },
  editIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5, 
    backgroundColor: '#000',
    borderRadius: 20,
    padding: 6,
  },
  
  
  
  input: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 14,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    marginBottom: 0,
  },
  loginText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '500',
    letterSpacing: 2,
    textAlign: 'center',
    
  },
  footerWrapper: {
    marginTop: 8,
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
  
});
