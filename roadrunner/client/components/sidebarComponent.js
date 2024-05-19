import React, { useEffect } from "react";
import Button from "react-bootstrap/Button";
import { View, TouchableOpacity, Text, Modal, ScrollView} from "react-native";
import { styles } from "../constants/styles";
import { getActiveHistory, useConversationHistory } from "../hooks/conversation";


const Sidebar = ({ visible, onClose, onViewHistory, onSettings, onLogout, conversationHistory, setMessages, auth, setCurrentActiveThreadID, currentActiveThreadID }) => {
  res = useConversationHistory(auth);

  useEffect(() => {
    displayActiveHistory(1);
  }, [])


  const displayActiveHistory = async (conversationID) => {
    await fetch(`http://127.0.0.1:8000/conversations/${currentActiveThreadID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": auth["token_type"] + " " + auth["access_token"],
      },
    }).then(async (response) => {
      setCurrentActiveThreadID(conversationID)
      console.log("Active conversation thread: ", currentActiveThreadID)
      data = await response.json()
      console.log("Time to set messages: ", data.context)
      if (data.context == undefined){
        setMessages([])
      }
      else{
        setMessages(data.context)
      }
    }).catch(err => {
      console.log("Error: ", err)
    });
  }


  const createNewThread = async () => {
    await fetch(`http://127.0.0.1:8000/conversations`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": auth["token_type"] + " " + auth["access_token"],
      },
    }).then(async (response) => {
      data = await response.json()
      newID = data.length+1
      setCurrentActiveThreadID(newID)
      setMessages([])
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
            <TouchableOpacity style={styles.sidebarItemButton}>
              <Button variant="primary" onClick={createNewThread}>New Conversation</Button>
            </TouchableOpacity>

            {
              conversationHistory.map((eachHistory, i) => (
                <TouchableOpacity key={i} style={styles.sidebarItem} data-id={eachHistory?.id}>
                  <Text style={styles.sidebarItemText} onClick={() => displayActiveHistory(eachHistory?.id)}> {eachHistory?.context[(eachHistory?.context).length - 1]?.content}</Text>
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
