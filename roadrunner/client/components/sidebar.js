import React from 'react';
import { View, TouchableOpacity, Text, Modal } from 'react-native';
import { styles } from '../constants/styles';

const Sidebar = ({ visible, onClose, onViewHistory, onSettings, onLogout }) => {
  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <TouchableOpacity onPress={onClose} style={styles.sidebarContainer}>
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
    </Modal>
  );
};

export default Sidebar;
