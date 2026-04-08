import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const imageAnim = useRef(new Animated.Value(0)).current;
  const titleAnim = useRef(new Animated.Value(0)).current;
  const taglineAnim = useRef(new Animated.Value(0)).current;
  const buttonAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(imageAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(taglineAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(buttonAnim, {
        toValue: 1,
        friction: 6,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.imageWrapper,
          {
            opacity: imageAnim,
            transform: [
              {
                translateY: imageAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          },
        ]}
      >
        <Image
          source={require('../assets/home.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text
        style={[
          styles.title,
          {
            opacity: titleAnim,
            transform: [
              {
                translateY: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [30, 0],
                }),
              },
            ],
          },
        ]}
      >
        Welcome{'\n'}to TaleTunes!
      </Animated.Text>

      <Animated.Text
        style={[
          styles.tagline,
          {
            opacity: taglineAnim,
            transform: [
              {
                translateY: taglineAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        Hear the Story,{'\n'}Feel the Magic!!
      </Animated.Text>

      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonAnim,
            transform: [
              {
                scale: buttonAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0.8, 1],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('login')}
        >
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => navigation.navigate('signup')}
        >
          <Text style={styles.loginText}>SIGN-UP</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#C194E8',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  imageWrapper: {
    width: 320,
    height: 320,
    backgroundColor: 'rgba(240,229,138,0.85)',
    borderRadius: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
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
  image: {
    width: 300,
    height: 300,
  },
  title: {
    color: 'white',
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  tagline: {
    color: '#FFFEFC',
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 40,
  },


  orText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 8,
  },
});


// // screens/index.jsx
// import React from 'react';

// const WelcomeScreen = () => {
//   return (
//     <div>Welcome</div> // Your actual JSX here
//   );
// };

// export default WelcomeScreen;  // Default export

//   return (
//     <View
//       style={{
//         flex: 1,
//         justifyContent: "center",
//         alignItems: "center",
//       }}
//     >
//       <MyButton title={"Continue"} onPress={onContinue} />
//       <MyButton title={"open"} onPress={()=>setVisible(true)}/>
//       <Modal visible={visible} animationType="slide" transparent>
//         {/* <View style={{flex:1,justifyContent:"flex-end"}}> */}
//           <View style={{backgroundColor:"blue",height:300}}>
//           <MyButton title={"close"} onPress={()=>setVisible(false)}/>

          
//         </View>
//       </Modal>
//     </View>
//   );
// }
