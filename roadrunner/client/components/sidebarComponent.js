import React, { useEffect } from "react";
import {
  Button,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_URL } from "../constants/config";
import { styles } from "../constants/styles";
import { useConversationHistory } from "../hooks/conversation";

const Sidebar = ({
  visible,
  onClose,
  onViewHistory,
  onSettings,
  onLogout,
  conversationHistory,
  setMessages,
  auth,
  setCurrentActiveThreadID,
  currentActiveThreadID,
  setSidebarVisible,
}) => {
  res = useConversationHistory(auth, setSidebarVisible);

  useEffect(() => {
    displayActiveHistory(1);
  }, []);

  const displayActiveHistory = async (conversationID) => {
    console.log("Displaying active history");
    await fetch(`${API_URL}/conversations/${currentActiveThreadID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth["token_type"] + " " + auth["access_token"],
      },
    })
      .then(async (response) => {
        setCurrentActiveThreadID(conversationID);
        console.log("Active conversation thread: ", currentActiveThreadID);
        data = await response.json();
        console.log("Time to set messages: ", data.context);
        if (data.context == undefined) {
          setMessages([]);
        } else {
          setMessages(data.context);
        }
      })
      .catch((err) => {
        console.log("Error fetching conversation history: ", err);
      });
  };

  const createNewThread = async () => {
    console.log("Creating new thread");
    try {
      const response = await fetch(`${API_URL}/conversations/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${auth.token_type} ${auth.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to create new conversation", response.text);
      }

      const newConversation = await response.json();
      setCurrentActiveThreadID(newConversation.id);
      setMessages([]);
    } catch (err) {
      console.error("Error creating new thread: ", err);
    }
  };

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
            <Button
              variant="primary"
              onPress={createNewThread}
              title="New Conversation"
            />

            {conversationHistory.map((eachHistory, i) => (
              <TouchableOpacity
                key={i}
                style={styles.sidebarItem}
                data-id={eachHistory?.id}
              >
                <Text
                  style={styles.sidebarItemText}
                  onPress={() => displayActiveHistory(eachHistory?.id)}
                >
                  {
                    eachHistory?.context[(eachHistory?.context).length - 1]
                      ?.content
                  }
                </Text>
              </TouchableOpacity>
            ))}

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
