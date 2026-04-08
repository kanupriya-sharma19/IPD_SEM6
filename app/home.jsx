import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import { Audio } from 'expo-av';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [isPlaying, setIsPlaying] = useState(false); 
  const [query, setQuery] = useState(""); 
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState("");  
  const [sound, setSound] = useState(null); 


  const playSound = async (url) => {
  
    try {
      if (sound) {
        await sound.unloadAsync();
      }
  
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );
  
      setSound(newSound);
      setIsPlaying(true);  
  
      await newSound.playAsync();
  
      newSound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) {
          setIsPlaying(false);  
        }
      });
  
    } catch (error) {
      console.log("Error playing sound:", error);
    }
  };
  
  const handleSearch = async () => {
    console.log('Making API request...');
    setLoading(true);
    setError("");

    try {
      const response = await axios.get("https://flask-demo-smxx.onrender.com/search_sound", {
        params: { query }
      });
      if (response.data.success && response.data.sound) {
        playSound(response.data.sound);
      } else {
        setError("No sound found.");
      }
    } catch (err) {
      setError("Error fetching data");
    } finally {
      setLoading(false);
    }
  };


  

  const handleLogout = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      await AsyncStorage.removeItem("authToken");
      Alert.alert("Logged out", "You have been logged out successfully.");
      navigation.navigate('login')
    } catch (error) {
      console.error("Logout error:", error);
      Alert.alert("Error", "An error occurred while logging out.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity>
            <Ionicons name="menu" size={33} color="black" />
          </TouchableOpacity>
          <View style={styles.searchBar}>
            <TextInput
              placeholder="Search for your story"
              style={styles.input}
              value={query}
              onChangeText={setQuery}
            />
            <FontAwesome name="camera" size={20} color="black" />
          </View>
          <TouchableOpacity onPress={() => navigation.navigate("profile")}>
            <Ionicons name="person-circle-outline" size={32} color="black" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={32} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
        {isPlaying && <Text style={styles.playingText}>Audio is playing...</Text>}

        {loading && <Text>Loading...</Text>}
        {error && <Text style={styles.error}>{error}</Text>}

        <Text style={styles.title}>What would you like to listen today?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storyRow}
        >
        </ScrollView>

        <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.storyRow}
      >
        <View style={styles.storyCard}>
          <Image
            source={require("../assets/crow.png")}
            style={styles.image}
          />
          <Text style={styles.cardTitle}>Thirsty Crow</Text>
          <Text style={styles.cardSub}>1 min</Text>
        </View>
        <View style={styles.storyCard}>
          <Image
            source={require("../assets/fox.png")}
            style={styles.image}
          />
          <Text style={styles.cardTitle}>Fox and the crow</Text>
          <Text style={styles.cardSub}>2 min</Text>
        </View>
        <View style={styles.storyCard}>
          <Image
            source={require("../assets/crow.png")}
            style={styles.image}
          />
          <Text style={styles.cardTitle}>Thirsty Crow</Text>
          <Text style={styles.cardSub}>1 min</Text>
        </View>
        <View style={styles.storyCard}>
          <Image
            source={require("../assets/crow.png")}
            style={styles.image}
          />
          <Text style={styles.cardTitle}>Thirsty Crow</Text>
          <Text style={styles.cardSub}>1 min</Text>
        </View>
        <View style={styles.storyCard}>
          <Image
            source={require("../assets/crow.png")}
            style={styles.image}
          />
          <Text style={styles.cardTitle}>Fox and the crow</Text>
          <Text style={styles.cardSub}>1 min</Text>
        </View>
      </ScrollView>

     
        <Text style={styles.sectionTitle}>Categories</Text>
        <View style={styles.categoryBox}>
          <Image
            source={require("../assets/adventure.png")}
            style={styles.icon}
          />
          <Text style={styles.categoryText}>Adventure</Text>
        </View>
        <View style={styles.categoryBox}>
          <Image
            source={require("../assets/adventure.png")}
            style={styles.icon}
          />
          <Text style={styles.categoryText}>Bed Time</Text>
        </View>
        <View style={styles.categoryBox}>
          <Image
            source={require("../assets/adventure.png")}
            style={styles.icon}
          />
          <Text style={styles.categoryText}>Fantasy</Text>
        </View>

      
        <Text style={styles.sectionTitle}>Recently Listened</Text>
        <View style={styles.categoryBox}>
          <Image
            source={require("../assets/adventure.png")}
            style={styles.icon}
          />
          <Text style={styles.categoryText}>Kite and a Monkey</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#D2AFF0",
    padding: 16,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  searchBar: {
    flex: 1,
    marginHorizontal: 12,
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    marginRight: 8,
  }, playingText: {
    color: "red",  
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2e0249",
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: "#6D5DE8",
    padding: 12,
    borderRadius: 24,
    alignItems: "center",
    marginVertical: 12,
  },
  searchButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginBottom: 16,
  },
  storyRow: {
    marginBottom: 24,
  },
  storyCard: {
    width: 160,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginRight: 16,
    overflow: "hidden",
    elevation: 3,
    paddingBottom: 8,
  },
  image: {
    width: "100%",
    height: 110,
  },
  cardTitle: {
    textAlign: "center",
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    color: "#240332",
  },
  cardSub: {
    textAlign: "center",
    fontSize: 12,
    color: "#240332",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    color: "#211C4D",
  },
  categoryBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6D5DE8",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFFFFC",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingLeft: 20,
    marginTop: 1,
  },
});
