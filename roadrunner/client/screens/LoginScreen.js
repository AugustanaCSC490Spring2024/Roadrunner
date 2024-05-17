import React, { useState, useContext, useEffect } from "react";
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
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React, { useContext, useState } from "react";
import { Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { API_URL } from "../constants/config";
import { AuthContext } from "../contexts/authcontext";

const LOGIN_API_URL = "http://127.0.0.1:8000/login";

export default function LoginScreen() {
  const navigation = useNavigation();
  const {
    auth,
    setAuth
  } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const options = {
    method: 'POST',
    url: 'http://127.0.0.1:8000/login',
    params: { 'api-version': '3.0' },
    headers: {
      "Content-Type": "application/json",
      "Authorization": auth["token_type"] + " "+ auth["access_token"],
    },
    data: 
      {
        username: username,
        password: password
      },
  
  };


  const handleLogin = async () => {
    try {
      console.log("Came here for login")
      const response = await axios.request(options);
  
      if (response.status === 200) {
        const responseData = response.data;

        //set current user
        setAuth(responseData)
        navigation.navigate("Home")
      } else {
        console.error("Login failed with status:", response.status);
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
              placeholder="Username"
              placeholderTextColor="white"
              style={{ color: "white" }}
              value={username}
              onChangeText={setUsername}
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
