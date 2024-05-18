import React from "react";
import { View, TouchableOpacity, Text, Modal, ScrollView } from "react-native";
import { styles } from "../constants/styles";
import { getActiveHistory } from "../hooks/conversation";


const Sidebar = ({ visible, onClose, onViewHistory, onSettings, onLogout, conversationHistory, setMessages, auth }) => {

  const displayActiveHistory = async (conversationID) => {
    await fetch(`http://127.0.0.1:8000/conversations/${conversationID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": auth["token_type"] + " " + auth["access_token"],
      },
    }).then(async (response) => {
      data = await response.json()
      console.log("Time to set messages: ", data.context)
      setMessages(data.context)
    }).catch(err => {
      console.log("Error: ", err)
    });
  }

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
              conversationHistory.map((eachHistory, i) => (
                <TouchableOpacity key={i} style={styles.sidebarItem} data-id={eachHistory?.id}>
                  <Text style={styles.sidebarItemText} onClick={() => displayActiveHistory(eachHistory?.id)} > {eachHistory?.context[(eachHistory?.context).length - 1]?.content}</Text>
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
