import React from "react";
import { View, TouchableOpacity, Text, Modal, ScrollView } from "react-native";
import { styles } from "../constants/styles";

const Sidebar = ({ visible, onClose, onViewHistory, onSettings, onLogout }) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <ScrollView style={styles.scrollView}>
        <TouchableOpacity
          style={styles.overlay} // Style for the transparent overlay
          onPress={onClose} // Close the sidebar when overlay is pressed
        >
          <View style={styles.sidebar}>
            <TouchableOpacity onPress={onViewHistory} style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>View History</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onSettings} style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>Settings</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={onLogout} style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </Modal>
  );
};

export default Sidebar;
