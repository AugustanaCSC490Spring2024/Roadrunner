import React, { useState, useRef, useEffect } from "react";
import { View, SafeAreaView, ScrollView, Text } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { styles } from "../constants/styles";
import { darkStyles } from "../constants/darkStyle";
import Sidebar from "../components/sidebarComponent";
import Settings from "../components/settingsComponent";
import { Prompt, promptMessages } from "../prompts/prompts";
import Message from "../components/messageComponent";
import InputArea from "../components/InputAreaComponent";
import Header from "../components/headerComponet";
import { API_URL } from "../constants/config";

import axios from "axios";

export default function HomeScreen({ selectedTheme, onThemeChange }) {
  const [messages, setMessages] = useState([]); // State for messages
  const [inputText, setInputText] = useState(""); // State for input text
  const [sidebarVisible, setSidebarVisible] = useState(false); // State for sidebar visibility
  const [showPrompts, setShowPrompts] = useState(true); // State for showing prompts
  const [settingsVisible, setSettingsVisible] = useState(false); // State for settings popup visibility
  const [theme, setTheme] = useState("light"); //Initialize theme to "light"
  const scrollViewRef = useRef(); // Ref for ScrollView
  const navigation = useNavigation();

  useEffect(() => {
    setTheme(selectedTheme || "light");
  }, [selectedTheme]);

  // Function to handle logout
  const handleLogout = () => {
    console.log("User logged out");
    setSidebarVisible(false); // Close sidebar after selecting an option
  };

  // Function to handle view history
  const handleViewHistory = () => {
    console.log("View history");
    setSidebarVisible(false); // Close sidebar after selecting an option
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

  // Function to send message

  const sendMessage = async (messageContent) => {
    if (messageContent && messageContent.trim()) {
      // Check if messageContent is defined and not empty before trimming
      const newMessage = {
        id: Date.now(),
        role: "user",
        content: messageContent.trim(),
      };
      setMessages([...messages, newMessage]);

      try {
        // Make a POST request to the chat API
        const response = await axios.post(API_URL, {
          message: messageContent.trim(),
        });

        // Check if the response contains an error
        if (
          Array.isArray(response.data) &&
          response.data.length > 0 &&
          response.data[0].error
        ) {
          console.error("API Error:", response.data[0].error);
          // Handle the error, e.g., display an error message to the user
        } else {
          // Extract the response content
          const responseData = response.data;

          // Construct the bot message
          const botMessage = {
            id: Date.now() + 1,
            role: "assistant",
            content: responseData.response,
          };

          // Update messages state with the bot response
          setMessages((prevMessages) => [...prevMessages, botMessage]);
        }
      } catch (error) {
        // Handle error if request fails
        console.error("Error fetching response:", error);
        // Optionally, you can display an error message to the user
      }
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

  // Function to handle theme change
  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    navigation.setOptions({ headerTitle: newTheme });
  };

  return (
    <SafeAreaView
      style={theme === "light" ? styles.container : darkStyles.container}
    >
      {/* Use Header component */}
      <Header openSidebar={openSidebar} />

      <View
        style={theme === "light" ? styles.separator : darkStyles.separator}
      />
      <View
        style={
          theme === "light" ? styles.chatContainer : darkStyles.chatContainer
        }
      >
        <ScrollView
          style={
            theme === "light"
              ? styles.messagesContainer
              : darkStyles.messagesContainer
          }
          contentContainerStyle={
            theme === "light"
              ? styles.messagesContentContainer
              : darkStyles.messagesContentContainer
          }
          ref={scrollViewRef}
          onContentSizeChange={() =>
            scrollViewRef.current.scrollToEnd({ animated: true })
          }
        >
          {/* Render prompts if showPrompts is true */}
          <View
            style={
              theme === "light"
                ? styles.promptContainer
                : darkStyles.promptContainer
            }
          >
            {showPrompts &&
              promptMessages.map((prompt, index) => (
                <Prompt
                  key={index}
                  prompt={prompt}
                  onPromptPress={handlePromptPress}
                  style={
                    theme === "light"
                      ? styles.customPrompt
                      : darkStyles.customPrompt
                  } // Custom prompt styles from parent
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
        onThemeChange={handleThemeChange}
      />
    </SafeAreaView>
  );
}
