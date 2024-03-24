{
  /*This component contains the header of the home screen.*/
}

// Header.js
import React from "react";
import { TouchableOpacity, Image, View } from "react-native";
import { styles } from "../constants/styles";

export default function Header({ openSidebar }) {
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={openSidebar} style={styles.sidebarButton}>
        <Image
          source={require("../asset/images/menu-icon.png")}
          style={styles.sidebarIcon}
        />
      </TouchableOpacity>
    </View>
  );
}
