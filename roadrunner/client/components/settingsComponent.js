import React, { useState } from "react";
import { View, TouchableOpacity, Text, Modal, Switch } from "react-native";
import { styles } from "../constants/styles";
import { darkStyles } from "../constants/darkStyle";

const Settings = ({ visible, onClose, onArchiveChats, onDeleteChats, onThemeChange }) => {
  const [isCustomThemeEnabled, setIsCustomThemeEnabled] = useState(false); // New state to control the switch

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setIsCustomThemeEnabled(true); // Enable custom theme when one is selected
    closeNestedSettings();
  };

  const toggleThemeSwitch = (value) => {
    setIsCustomThemeEnabled(value); 
    onThemeChange(value ? "light" : "dark"); // Immediately update the theme
    // Additional logic to apply the theme can go here
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <View
        style={
          isCustomThemeEnabled
            ? darkStyles.settingsPopupContainer
            : styles.settingsPopupContainer
        }
      >
        <View
          style={
            isCustomThemeEnabled
              ? darkStyles.settingsPopup
              : styles.settingsPopup
          }
        >
          <Text
            style={
              isCustomThemeEnabled
                ? darkStyles.settingHeader
                : styles.settingHeader
            }
          >
            Settings
          </Text>
          <View style={styles.separator} />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>x</Text>
          </TouchableOpacity>
          <View style={styles.option}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text>Theme Options</Text>
              <Switch
                value={isCustomThemeEnabled}
                onValueChange={toggleThemeSwitch}
              />
            </View>
          </View>

          <View style={styles.separator} />
          <TouchableOpacity style={styles.option} onPress={onArchiveChats}>
            <Text>Archive all chats</Text>
          </TouchableOpacity>
          <View style={styles.separator} />
          <TouchableOpacity style={styles.option} onPress={onDeleteChats}>
            <Text>Delete all chats</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Settings;
