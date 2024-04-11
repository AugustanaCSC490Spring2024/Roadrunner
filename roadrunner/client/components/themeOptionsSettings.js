import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "../constants/styles";

const ThemeOptionsSettings = ({ onClose, onThemeSelect }) => {
  return (
    <View style={styles.settingsPopupContainer}>
      <View style={styles.settingsPopup}>
        <TouchableOpacity
          style={styles.option}
          onPress={() => onThemeSelect("dark")}
        >
          <Text>Dark</Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity
          style={styles.option}
          onPress={() => onThemeSelect("light")}
        >
          <Text>Light </Text>
        </TouchableOpacity>
        <View style={styles.separator} />
        <TouchableOpacity style={styles.option} onPress={onClose}>
          <Text>Close</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ThemeOptionsSettings;
