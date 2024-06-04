// Prompt.js
import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "../constants/styles";

// Static list of prompts
const promptMessages = [
  {
    key: "1",
    text: "What happened today?!",
  },
  {
    key: "2",
    text: "Summarize my day with insights.",
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
