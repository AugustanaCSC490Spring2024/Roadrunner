import React, { useState, useRef } from "react";
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from "react-native";

// Import responsive screen utilities
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const Prompt = ({ prompt, onPromptPress }) => {
  return (
    <TouchableOpacity
      onPress={() => onPromptPress(prompt)}
      style={[styles.messageContainer, styles.prompt]}
    >
      <Text style={[styles.messageText, styles.promptText]}>{prompt.text}</Text>
    </TouchableOpacity>
  );
};


export default function HomeScreen() {
  const [messages, setMessages] = useState([]); // State for messages
  const [inputText, setInputText] = useState(""); // State for input text
  const [sidebarVisible, setSidebarVisible] = useState(false); // State for sidebar visibility
  const [showPrompts, setShowPrompts] = useState(true); // State for showing prompts
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
          { showPrompts && 
          promptMessages.map((prompt, index) => (
            <Prompt
              key={index}
              prompt={prompt}
              onPromptPress={handlePromptPress}
            />
          ))}

          {/* Render messages */}
          {messages.map((message, index) => {
            return (
              <View key={index}>
                {message.role === "user" && (
                  <View style={styles.userMessageContainer}>
                    <Text style={styles.messageText}>{message.content}</Text>
                  </View>
                )}
                {message.role === "assistant" && (
                  <View style={styles.assistantMessageContainer}>
                    {message.content.includes("https") ? (
                      <Image
                        source={{ uri: message.content }}
                        style={styles.messageImage}
                      />
                    ) : (
                      <Text style={styles.messageText}>{message.content}</Text>
                    )}
                  </View>
                )}
              </View>
            );
          })}
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={sidebarVisible}
        onRequestClose={() => setSidebarVisible(false)}
      >
        <TouchableOpacity
          onPress={() => setSidebarVisible(false)} // Close sidebar
          style={styles.sidebarContainer}
        >
          <View style={styles.sidebar}>
            <TouchableOpacity onPress={handleLogout} style={styles.sidebarItem}>
              <Text style={styles.sidebarItemText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleViewHistory}
              style={styles.sidebarItem}
            >
              <Text style={styles.sidebarItemText}>View History</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingHorizontal: wp("5%"),
    paddingTop: hp("2%"),
    paddingBottom: hp("1%"),
  },
  sidebarButton: {
    padding: 10,
  },
  sidebarIcon: {
    height: 40,
    width: 40,
    resizeMode: "contain",
  },
  separator: {
    height: 10,
    backgroundColor: "transparent",
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: wp("5%"),
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#D8E4D8",
    borderRadius: 30,
  },
  messagesContentContainer: {
    padding: 20,
  },
  userMessageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: wp("70%"),
    alignSelf: "flex-end",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  assistantMessageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: wp("70%"),
    alignSelf: "flex-start",
    backgroundColor: "#CEEFCE",
    borderRadius: 20,
    padding: 10,
    marginBottom: 10,
  },
  messageText: {
    color: "#000000",
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 25,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007bff",
    borderRadius: 25,
    padding: 10,
  },
  sendButtonText: {
    color: "#ffffff",
  },
  messageImage: {
    width: wp("40%"),
    height: wp("40%"),
    borderRadius: 20,
  },
  sidebarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    backgroundColor: "white",
    width: wp("60%"),
    height: "100%",
    paddingTop: hp("20%"),
    paddingBottom: hp("20%"),
    paddingHorizontal: wp("5%"),
  },
  sidebarItem: {
    paddingVertical: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: "lightgray",
  },
  sidebarItemText: {
    fontSize: 18,
  },
  promptContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    paddingHorizontal: wp("5%"),
    paddingBottom: hp("2%"),
  },
  prompt: {
    backgroundColor: "#FFFFFF", // Set background color to match input background
    paddingHorizontal: 10, // Adjust padding to match input padding
    paddingVertical: 10,
    borderRadius: 25, // Adjust border radius to match input border radius
    marginBottom: 10,
    marginRight: 10,
    width: wp("48%"), // Adjusted width to fit two prompts in a row with some spacing
  },
  promptText: {
    color: "#000000", // Set text color to match input text color
    textAlign: "center", // Center the text within the prompt
  },

});
