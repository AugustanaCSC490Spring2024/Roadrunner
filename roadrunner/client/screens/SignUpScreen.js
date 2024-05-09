import React, { useState, useContext } from "react";
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
import { AuthContext } from "../contexts/authcontext";
import axios from "axios";

const SIGNUP_API_URL = "https://infra-67yyg4i2vq-uc.a.run.app/signup";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const {
    currentUser,
    setCurrentUser
  } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async () => {
    try {
      const response = await axios.post(SIGNUP_API_URL, {
        username: username,
        email: email,
        password: password
      });
  
      if (response.status === 200) {
        const responseData = response.data;
        console.log("Sign Up successful");
        console.log("Response data:", responseData);
       
        //set current user
        setCurrentUser(responseData['user_id'])
        navigation.navigate("Home")
        
      } else {
        console.error("Sign Up failed:", response.status);
        // Handle other status codes if needed
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle network errors or other exceptions
    }
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

      {/* Signup Form */}
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Animated.Text
          entering={FadeInUp.duration(1000).springify()}
          style={{ color: "white", fontWeight: "bold", fontSize: 30 }}
        >
          Sign Up
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
              placeholder="Username"
              placeholderTextColor="white"
              style={{ color: "white" }}
              value={username}
              onChangeText={setUsername}
            />
          </Animated.View>

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
              secureTextEntry
              style={{ color: "white" }}
              value={password}
              onChangeText={setPassword}
            />
          </Animated.View>

          <TouchableOpacity
            onPress={handleSignUp}
            style={{
              backgroundColor: "#00bcd4",
              padding: 10,
              borderRadius: 10,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Sign Up</Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Text style={{ color: "white" }}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={{ color: "#00bcd4" }}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
