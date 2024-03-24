import React from "react";
import { View, TouchableOpacity, Text, Modal } from "react-native";
import { styles } from "../constants/styles";

const Settings = ({ visible, onClose, onArchiveChats, onDeleteChats }) => {
  return (
    <Modal visible={visible} onClose={onClose}>
      <View style={styles.settingsPopupContainer}>
        <View style={styles.settingsPopup}>
          <Text style={styles.settingHeader}>Settings</Text>
          <View style={styles.separator} />
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>x</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => console.log("Theme Options clicked")}
          >
            <Text>Theme Options</Text>
          </TouchableOpacity>
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
