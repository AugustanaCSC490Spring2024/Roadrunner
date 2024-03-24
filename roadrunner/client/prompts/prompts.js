// Prompt.js
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "../constants/styles";

const Prompt = ({ prompt, onPromptPress, style }) => {
  return (
    <TouchableOpacity
      onPress={() => onPromptPress(prompt)}
      style={[styles.prompt, style]} // Combine with default prompt styles
    >
      <Text style={styles.promptText}>{prompt.text}</Text>
    </TouchableOpacity>
  );
};

export default Prompt;
