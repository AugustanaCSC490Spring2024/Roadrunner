// Prompt.js
import React from "react";
import { TouchableOpacity, Text } from "react-native";
import { styles } from "../constants/styles";

// Static list of prompts
const promptMessages = [
  {
    key: "1",
    text: "Fantasy team names",
  },
  {
    key: "2",
    text: "Python email script",
  },
  { key: "3", text: "Thank-you note to interviewer" },
  {
    key: "4",
    text: "Thank-you note to babysitter",
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
