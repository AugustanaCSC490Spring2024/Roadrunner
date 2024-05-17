import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useRef, useState } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import InputArea from "../components/InputAreaComponent";
import Header from "../components/headerComponet";
import Message from "../components/messageComponent";
import Settings from "../components/settingsComponent";
import Sidebar from "../components/sidebarComponent";
import { API_URL } from "../constants/config";
import { darkStyles } from "../constants/darkStyle";
import { styles } from "../constants/styles";
import { AuthContext } from "../contexts/authcontext";
import { Prompt, promptMessages } from "../prompts/prompts";
const CHAT_API_URL = API_URL + "/chat";
const UPDATE_API_URL = API_URL + "/update-conversation";

export default function HomeScreen({ selectedTheme, onThemeChange }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [showPrompts, setShowPrompts] = useState(true);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [theme, setTheme] = useState("light");
  const scrollViewRef = useRef();
  const {
    auth,
    setAuth
  } = useContext(AuthContext);
  

  const navigation = useNavigation();

  useEffect(() => {
    setTheme(selectedTheme || "light");
  }, [selectedTheme]);

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

  const updateConversation = async (conversationId, newMessages) => {
    try {
      const response = await fetch(`${UPDATE_API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": auth["token_type"] + " " + auth["access_token"],
        },
        body: JSON.stringify({
          conversation_id: conversationId,
          messages: newMessages,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      console.log("Response: ", response)
      const responseData = await response.json();
      console.log("Conversation updated successfully:", responseData.message);
    } catch (error) {
      console.error("Error updating conversation:", error);
    }
  };

  // Function to send message
  const sendMessage = async (messageContent) => {
    try {
      messageContent = messageContent.trim();
      if (messageContent) {
        // Add user's request to messages
        const userMessage = { role: "user", content: messageContent };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
        console.log("Sent messages to LLM")
        console.log(auth["token_type"] + auth["access_token"])
        const response = await fetch(`${CHAT_API_URL}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": auth["token_type"] + " " +auth["access_token"],
          },
          body: JSON.stringify({
            conversation_id: 1,
            message: messageContent,
          }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const textResponse = await response.text();
        const cleanedResponse = textResponse
          .replace(/["']/g, "")
          .replace(/\s{2,}/g, " ");
        const botMessage = { role: "assistant", content: cleanedResponse };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        // Update conversation after sending the message
        await updateConversation(1, [userMessage, botMessage]);
      }
    } catch (error) {
      console.error("Error fetching response:", error);
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
      {/* <HistSideBar /> */}

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
