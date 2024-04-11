import React, { useState } from "react";
import { View, TouchableOpacity, Text, Modal } from "react-native";
import { styles } from "../constants/styles";
import ThemeOptionsSettings from "../components/themeOptionsSettings";

const Settings = ({ visible, onClose, onArchiveChats, onDeleteChats }) => {
  const [nestedSettingsVisible, setNestedSettingsVisible] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(""); // State to track selected theme

  const onSystemVClick = () => {
    setNestedSettingsVisible(true);
  };

  const closeNestedSettings = () => {
    setNestedSettingsVisible(false);
  };

  const handleThemeSelect = (theme) => {
    setSelectedTheme(theme);
    closeNestedSettings();
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
            <TouchableOpacity
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
              onPress={onSystemVClick}
            >
              <Text>Theme Options</Text>
              <TouchableOpacity onPress={onSystemVClick}>
                <Text style={{ fontSize: 14 }}>System v</Text>
              </TouchableOpacity>
            </TouchableOpacity>
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
