import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

// Helper function to generate border radius style
const borderRadius = (value) => ({
  borderRadius: value,
});

// Helper function to generate padding style
const padding = (vertical, horizontal) => ({
  paddingVertical: vertical,
  paddingHorizontal: horizontal,
});

export const darkStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#333", // Dark background color
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    ...padding(hp("2%"), wp("5%")),
    paddingBottom: hp("1%"),
    backgroundColor: "#222", // Dark background color
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
    marginBottom: 10,
  },
  chatContainer: {
    flex: 1,
    paddingHorizontal: wp("5%"),
    overflow: "hidden",
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: "#444", // Darker background color for messages container
    ...borderRadius(30),
    overflow: "hidden",
  },
  messagesContentContainer: {
    ...padding(20, 20),
  },
  userMessageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: wp("70%"),
    alignSelf: "flex-end",
    backgroundColor: "#666", // Darker background color for user messages
    ...borderRadius(25),
    ...padding(10, 10),
    marginBottom: 10,
  },
  assistantMessageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    maxWidth: wp("70%"),
    alignSelf: "flex-start",
    backgroundColor: "#555", // Darker background color for assistant messages
    ...borderRadius(25),
    ...padding(10, 10),
    marginBottom: 10,
  },
  messageText: {
    color: "#fff", // White text color for messages
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: "row",
    ...padding(10, 10),
  },
  input: {
    flex: 1,
    padding: 10,
    backgroundColor: "#444", // Darker background color for input
    ...borderRadius(25),
    marginRight: 10,
    marginBottom: 10,
    color: "#fff", // White text color for input
  },
  sendButton: {
    backgroundColor: "#007bff",
    ...borderRadius(25),
    padding: 10,
  },
  sendButtonText: {
    color: "#ffffff",
  },
  messageImage: {
    width: wp("40%"),
    height: wp("40%"),
    ...borderRadius(20),
  },
  sidebarContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  sidebar: {
    backgroundColor: "#222", // Dark background color for sidebar
    width: wp("60%"),
    height: "100%",
    paddingTop: hp("20%"),
    paddingBottom: hp("20%"),
    paddingHorizontal: wp("5%"),
  },
  sidebarItem: {
    paddingVertical: hp("1%"),
    borderBottomWidth: 1,
    borderBottomColor: "#555", // Darker border color for sidebar items
  },
  sidebarItemText: {
    fontSize: 18,
    color: "#fff", // White text color for sidebar items
  },
  promptContainer: {
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 1000,
    paddingBottom: hp("8%"),
    marginBottom: 20,
  },
  prompt: {
    backgroundColor: "#555", // Darker background color for prompts
    ...padding(10, 10),
    ...borderRadius(25),
    marginBottom: 10,
    marginRight: 10,
    width: wp("48%"),
  },
  promptText: {
    color: "#fff", // White text color for prompts
    textAlign: "center",
  },
  settingsPopupContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  settingsPopup: {
    backgroundColor: "#444", // Darker background color for settings popup
    padding: 20,
    borderRadius: 10,
    width: "80%",
  },
  settingHeader: {
    fontSize: 15,
    fontWeight: "semibold",
    marginBottom: 10,
    color: "#fff", // White text color for setting header
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "transparent",
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#999",
  },
  closeButtonText: {
    fontSize: 18,
    color: "#999",
  },
  option: {
    marginBottom: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: "#999",
    marginBottom: 10,
  },
  themeOptionsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
