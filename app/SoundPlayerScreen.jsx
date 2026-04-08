// import React, { useState, useEffect } from "react";
// import { View, Text, Button, StyleSheet } from "react-native";
// import { Audio } from 'expo-av';

// export default function SoundPlayerScreen({ route, navigation }) {
//   const { soundUrl } = route.params; // Get the sound URL from route parameters
//   const [sound, setSound] = useState();
//   const [isLoading, setIsLoading] = useState(true); // Loading state for audio

//   useEffect(() => {
//     const loadSound = async () => {
//       try {
//         // Load the sound from the provided URL
//         const { sound } = await Audio.Sound.createAsync(
//           { uri: soundUrl },
//           { shouldPlay: true }
//         );
//         setSound(sound);
//         setIsLoading(false); // Set loading to false once the sound is loaded
//       } catch (error) {
//         console.error("Error loading sound:", error);
//         setIsLoading(false);
//       }
//     };

//     loadSound();

//     return () => {
//       if (sound) {
//         sound.unloadAsync();
//       }
//     };
//   }, [soundUrl]);

//   const handleGoBack = () => {
//     navigation.replace('Home'); 
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.text}>Playing generated sound...</Text>
//       {isLoading ? (
//         <Text>Loading sound...</Text>
//       ) : (
//         <Button title="Go Back" onPress={handleGoBack} />
//       )}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center" },
//   text: { fontSize: 18, marginBottom: 20 },
// });
