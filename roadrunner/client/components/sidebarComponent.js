import React from "react";
import { View, TouchableOpacity, Text, Modal, ScrollView } from "react-native";
import { styles } from "../constants/styles";

const Sidebar = ({ visible, onClose, onViewHistory, onSettings, onLogout, conversationHistory }) => {
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
            {
              conversationHistory.map((eachHistory) => (
                <TouchableOpacity onPress={onViewHistory} style={styles.sidebarItem} id={eachHistory?.id}>
                  <Text style={styles.sidebarItemText}> {eachHistory?.context[(eachHistory?.context).length -1]?.content}</Text>
                </TouchableOpacity>
              ))
            }



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
