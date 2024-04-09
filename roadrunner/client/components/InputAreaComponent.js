import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  TouchableOpacity,
  Text,
} from "react-native";
import { styles } from "../constants/styles";

export default function InputArea({ inputText, setInputText, sendMessage }) {
  const handleSendMessage = () => {
    sendMessage(inputText); // Pass inputText to sendMessage function
    setInputText(""); // Clear input text after sending message
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.inputContainer}
    >
      <TextInput
        style={styles.input}
        placeholder="Type your message here..."
        value={inputText}
        onChangeText={setInputText}
        onSubmitEditing={handleSendMessage}
      />
      <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
        <Text style={styles.sendButtonText}>Send</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
