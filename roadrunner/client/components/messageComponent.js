{
  /*This component renders individual chat messages.*/
}
import React from "react";
import { View, Text, Image } from "react-native";
import { styles } from "../constants/styles";

export default function Message({ message }) {
  return (
    <View>
      {message.role === "user" && (
        <View style={styles.userMessageContainer}>
          <Text style={styles.messageText}>{message.content}</Text>
        </View>
      )}
      {message.role === "assistant" && (
        <View style={styles.assistantMessageContainer}>
          {message.content.includes("https") ? (
            <Image
              source={{ uri: message.content }}
              style={styles.messageImage}
            />
          ) : (
            <Text style={styles.messageText}>{message.content}</Text>
          )}
        </View>
      )}
    </View>
  );
}
