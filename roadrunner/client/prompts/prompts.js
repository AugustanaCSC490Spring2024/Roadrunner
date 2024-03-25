// Prompt.js
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "../constants/styles";

// Static list of prompts
const promptMessages = [
  {
    key: "1",
    text: "Summarize a note",
  },
  {
    key: "2",
    text: "Python email script",
  },
];
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

export { Prompt, promptMessages };
