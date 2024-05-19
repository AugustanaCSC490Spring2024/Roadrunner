{
  /*This component contains the header of the home screen.*/
}

// Header.js
import React from "react";
import { TouchableOpacity, Image, View } from "react-native";
import { styles } from "../constants/styles";
import { Avatar } from "react-native-paper"; 

export default function Header({ openSidebar, currUsername }) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={openSidebar} style={styles.sidebarButton}>
        <Image
          source={require("../asset/images/menu-icon.png")}
          style={styles.sidebarIcon}
        />
      </TouchableOpacity>
      <TouchableOpacity style={styles.sidebarAvatar}>
        <Avatar.Text size={35} label={currUsername[0].toUpperCase()}/>
      </TouchableOpacity>
    </View>
  );
}
