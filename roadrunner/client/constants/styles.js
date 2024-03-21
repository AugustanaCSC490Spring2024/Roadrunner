import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
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
      borderRadius: 25, // Adjusted border radius to match input border radius
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
      borderRadius: 25, // Adjusted border radius to match input border radius
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
      marginBottom: 10, // Add marginBottom to match the spacing
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
  