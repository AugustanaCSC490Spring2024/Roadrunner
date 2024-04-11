import React, { useState } from "react";
import { View, TouchableOpacity, Text, Modal, Switch } from "react-native";
import { styles } from "../constants/styles";

const Settings = ({ visible, onClose, onArchiveChats, onDeleteChats }) => {
  const [nestedSettingsVisible, setNestedSettingsVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(""); // State to track selected theme
  const [isCustomThemeEnabled, setIsCustomThemeEnabled] = useState(false); // New state to control the switch

  const onSystemVClick = () => {
    setNestedSettingsVisible(true);
  };

  const closeNestedSettings = () => {
    setNestedSettingsVisible(false);
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    setIsCustomThemeEnabled(true); // Enable custom theme when one is selected
    closeNestedSettings();
  };

  const toggleThemeSwitch = (value) => {
    setIsCustomThemeEnabled(value);
    // Additional logic to apply the theme can go here
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.settingsPopupContainer}>
        <View style={styles.settingsPopup}>
          <Text style={styles.settingHeader}>Settings</Text>
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

      {/* Nested Settings Popup */}
      {nestedSettingsVisible && (
        <ThemeOptionsSettings
          onClose={closeNestedSettings}
          onThemeSelect={handleThemeSelect}
        />
      )}
    </Modal>
  );
};

export default Settings;
