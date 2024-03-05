import { View, Text, SafeAreaView, Image } from "react-native";
import React from "react";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useEffect, useState } from "react";
import Features from "../components/Features"

export default function HomeScreen() {
  const [messages, setMessages] = useState([]);
  return (
    <View className=" flex-1 bg-white">
      <SafeAreaView className="flex-1 flex mx-5">
        {/* bot icon */}
        <View className="flex-row justify-center">
          <Image
            source={require("../asset/images/home_screen_bot.png")}
            style={{ height: hp(15), width: hp(15) }}
          />
        </View>

        {/* features || messages */}

        {messages.length ? 0(<View></View>) : <Features />}
      </SafeAreaView>
    </View>
  );
}
