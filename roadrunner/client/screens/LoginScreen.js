import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import Animated, { FadeIn, FadeInUp, FadeOut } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";

const LOGIN_API_URL = "http://127.0.0.1:8000/login";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for showing password

  const handleLogin = async () => {
    navigation.navigate("Home");
    {/*try {
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      if (response.ok) {
        const data = await response.json();
        // Navigate to Home screen or perform any action on successful login
        navigation.navigate("Home");
      } else {
        // Log the entire response body for debugging
        const responseBody = await response.text();
        console.error("Server response:", responseBody);
        Alert.alert("Error", "An error occurred. Please try again later.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert(
        "Error",
        "An error occurred. Please check your network connection and try again."
      );
    } */}
  };
  

  return (
    <View style={{ backgroundColor: "white", height: "100%", width: "100%" }}>
      <StatusBar style="light" />
      {/* Background Image */}
      <Image
        style={{ height: "100%", width: "100%", position: "absolute" }}
        source={require("../asset/images/background.png")}
      />

      {/* Light Images */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          position: "absolute",
          width: "100%",
        }}
      >
        <Animated.Image
          entering={FadeInUp.delay(200).duration(1000).springify()}
          style={{ height: 255, width: 90 }}
          source={require("../asset/images/light.png")}
        />
        <Animated.Image
          entering={FadeInUp.delay(400).duration(1000).springify()}
          style={{ height: 255, width: 90 }}
          source={require("../asset/images/light.png")}
        />
      </View>

      {/* Login Form */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Animated.Text
          entering={FadeInUp.duration(1000).springify()}
          style={{ color: "white", fontWeight: "bold", fontSize: 30 }}
        >
          Login
        </Animated.Text>

        <View style={{ marginTop: 20 }}>
          <Animated.View
            entering={FadeInUp.duration(1000).springify()}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <TextInput
              placeholder="Email"
              placeholderTextColor="white"
              style={{ color: "white" }}
              value={email}
              onChangeText={setEmail}
            />
          </Animated.View>

          <Animated.View
            entering={FadeInUp.duration(1000).delay(200).springify()}
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              borderRadius: 10,
              padding: 10,
              marginBottom: 10,
            }}
          >
            <TextInput
              placeholder="Password"
              placeholderTextColor="white"
              secureTextEntry={!showPassword} // Toggle secureTextEntry based on showPassword state
              style={{ color: "white" }}
              value={password}
              onChangeText={setPassword}
            />
          </Animated.View>

          {/* Toggle Show Password Button */}
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)} // Toggle showPassword state
            style={{
              alignSelf: "flex-end",
              marginRight: 10,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "gray" }}>
              {showPassword ? "Hide Password" : "Show Password"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogin}
            style={{
              backgroundColor: "#00bcd4",
              padding: 10,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Login</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ color: "white" }}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text style={{ color: "#00bcd4" }}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
