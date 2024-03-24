import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";

import { styles } from "../constants/styles";
import Sidebar from "../components/sidebarComponent";
import Settings from "../components/settingsComponent";
import Prompt from "../prompts/prompts";
import Message from "../components/messageComponent";

export default function HomeScreen() {
  const [messages, setMessages] = useState([]); // State for messages
  const [inputText, setInputText] = useState(""); // State for input text
  const [sidebarVisible, setSidebarVisible] = useState(false); // State for sidebar visibility
  const [showPrompts, setShowPrompts] = useState(true); // State for showing prompts
  const [settingsVisible, setSettingsVisible] = useState(false); // State for settings popup visibility
  const [theme, setTheme] = useState("light");
  const scrollViewRef = useRef(); // Ref for ScrollView

  // Static list of prompts
  const [promptMessages] = useState([
    {
      key: "1",
      text: "Fantasy team names",
    },
    {
      key: "2",
      text: "Python email script",
    },
    { key: "3", text: "Thank-you note to interviewer" },
    {
      key: "4",
      text: "Thank-you note to babysitter",
    },
  ]);

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

  // Dummy functions for archive and delete chats
  const archiveAllChats = () => {
    console.log("Archive all chats");
  };

  const deleteAllChats = () => {
    console.log("Delete all chats");
  };

  // Function to send message
  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: Date.now(),
        role: "user",
        content: inputText.trim(),
      };
      setMessages([...messages, newMessage]);
      setInputText("");
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          role: "assistant",
          content: "This is a simulated response.",
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      }, 1000); // Simulate a delay for bot response
    }
  };

  // Function to handle prompt press
  const handlePromptPress = (prompt) => {
    setInputText(prompt.text);
    sendMessage();
    setShowPrompts(false); // Hide prompts after one is clicked
  };

  // Function to toggle settings popup visibility
  const toggleSettingsPopup = () => {
    setSettingsVisible(!settingsVisible);
    setSidebarVisible(false); // Close sidebar
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => setSidebarVisible(true)} // Open sidebar
          style={styles.sidebarButton}
        >
          <Image
            source={require("../asset/images/menu-icon.png")}
            style={styles.sidebarIcon}
          />
        </TouchableOpacity>
      </View>
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inputContainer}
      >
        <TextInput
          style={styles.input}
          placeholder="Type your message here..."
          value={inputText}
          onChangeText={setInputText}
          onSubmitEditing={sendMessage}
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

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
