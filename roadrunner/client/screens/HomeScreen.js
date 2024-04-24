import React, { useRef, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

import InputArea from "../components/InputAreaComponent";
import Header from "../components/headerComponet";
import Message from "../components/messageComponent";
import Settings from "../components/settingsComponent";
import Sidebar from "../components/sidebarComponent";
import { styles } from "../constants/styles";
import { Prompt, promptMessages } from "../prompts/prompts";
const API_URL = "http://192.168.1.100:8000/chat";

export default function HomeScreen() {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [theme, setTheme] = useState("light");
  const scrollViewRef = useRef();

  const handleLogout = () => {
    console.log("User logged out");
    setSidebarVisible(false);
  };

  const handleViewHistory = () => {
    console.log("View history");
    setSidebarVisible(false);
  };

  // Function to open the sidebar
  const openSidebar = () => {
    setSidebarVisible(true);
  };

  // Dummy functions for archive and delete chats
  const archiveAllChats = () => {
    console.log("Archive all chats");
  };

  const deleteAllChats = () => {
    console.log("Delete all chats");
  };

  const sendMessage = async (messageContent) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: 1,
          conversation_id: 1,
          message: messageContent,
        }),
      });
      const jsonResponse = await response.json();
      setResponse(jsonResponse.message);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // Function to handle prompt press
  const handlePromptPress = (prompt) => {
    sendMessage(prompt.text); // Pass prompt text to sendMessage function
    setShowPrompts(false); // Hide prompts after one is clicked
  };

  // Function to toggle settings popup visibility
  const toggleSettingsPopup = () => {
    setSettingsVisible(!settingsVisible);
    setSidebarVisible(false); // Close sidebar
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Use Header component */}
      <Header openSidebar={openSidebar} />

      <View style={styles.separator} />
      <View style={styles.chatContainer}>
        <ScrollView
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContentContainer}
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {/*Render prompts if showPrompts is true */}
          <View style={styles.promptContainer}>
            {showPrompts &&
              promptMessages.map((prompt, index) => (
                <Prompt
                  key={index}
                  prompt={prompt}
                  onPromptPress={handlePromptPress}
                  style={styles.customPrompt} // Custom prompt styles from parent
                />
              ))}
          </View>

          {/* Render messages */}
          {messages.map((message, index) => (
            <Message key={index} message={message} />
          ))}
        </ScrollView>
      </View>

      {/* Input area */}
      <InputArea
        inputText={inputText}
        setInputText={setInputText}
        sendMessage={sendMessage}
      />

      {/* Sidebar */}
      <Sidebar
        visible={sidebarVisible}
        onClose={() => setSidebarVisible(false)}
        onViewHistory={handleViewHistory}
        onSettings={toggleSettingsPopup}
        onLogout={handleLogout}
      />

      {/* Settings Popup */}
      <Settings
        visible={settingsVisible}
        onClose={toggleSettingsPopup}
        onArchiveChats={archiveAllChats}
        onDeleteChats={deleteAllChats}
      />
    </SafeAreaView>
  );
}
