import React from "react";
import { View, Text, Image } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export default function Features() {
  return (
    <View style={{ height: hp(60), paddingTop: hp(2) }}>
      <Text
        style={{
          fontSize: wp(6.5),
          fontWeight: "bold",
          color: "#4B5563",
          marginBottom: hp(2),
        }}
      >
        Features
      </Text>
      <View
        style={{
          backgroundColor: "#B5F0B2",
          padding: 16,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../asset/images/chatgpt-icon.webp")}
            style={{ height: hp(5), width: hp(5) }}
          />
          <Text
            style={{
              fontSize: wp(4.8),
              fontWeight: "bold",
              color: "#4B5563",
              marginLeft: 10,
            }}
          >
            {" "}
            ChatGPT{" "}
          </Text>
        </View>
        <Text
          style={{
            fontSize: wp(3.8),
            fontWeight: "bold",
            color: "#4B5563",
            marginTop: 10,
          }}
        >
          ChatGPT can provide you with instant and knowledgeable responses,
          assist you with creative ideas
        </Text>
      </View>
      <View
        style={{
          backgroundColor: "#D7B0F5",
          padding: 16,
          borderRadius: 10,
          marginBottom: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../asset/images/dall-e-icon.webp")}
            style={{ height: hp(5), width: hp(5) }}
          />
          <Text
            style={{
              fontSize: wp(4.8),
              fontWeight: "bold",
              color: "#4B5563",
              marginLeft: 10,
            }}
          >
            {" "}
            DALL-E{" "}
          </Text>
        </View>
        <Text
          style={{
            fontSize: wp(3.8),
            fontWeight: "bold",
            color: "#4B5563",
            marginTop: 10,
          }}
        >
          DALL-E can generate imaginative and diverse images from textual
          descriptions, expanding the boundaries of visual creativity
        </Text>
      </View>

      <View
        style={{ backgroundColor: "#81ADCF", padding: 16, borderRadius: 10 }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../asset/images/chat_bot.png")}
            style={{ height: hp(5), width: hp(5) }}
          />
          <Text
            style={{
              fontSize: wp(4.8),
              fontWeight: "bold",
              color: "#4B5563",
              marginLeft: 10,
            }}
          >
            {" "}
            SMART AI{" "}
          </Text>
        </View>
        <Text
          style={{
            fontSize: wp(3.8),
            fontWeight: "bold",
            color: "#4B5563",
            marginTop: 10,
          }}
        >
          A powerful voice assistant with the abilities of ChatGPT and Dall-E,
          providing you the best of worlds
        </Text>
      </View>
    </View>
  );
}
