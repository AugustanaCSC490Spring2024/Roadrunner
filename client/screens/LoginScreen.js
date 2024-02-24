import React from 'react';
import { View, Text, Image, TextInput, TouchableOpacity } from 'react-native'; 
import { StatusBar } from 'expo-status-bar';

export default function LoginScreen() {
  return (
    <View style={{ backgroundColor: 'white', height: '100%', width: '100%' }}>
      <StatusBar style="light" />
      <Image 
        style={{ height: '100%', width: '100%', position: 'absolute' }} 
        source={require('../asset/images/background.png')} 
      /> 

      {/* light */} 
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', position: 'absolute', width: '100%' }}> 
        <Image style={{ height: 255, width: 90 }} source={require('../asset/images/light.png')} />
        <Image style={{ height: 255, width: 90 }} source={require('../asset/images/light.png')} />
      </View > 

      {/* light and form */} 
      <View style={{ flex: 1, justifyContent: 'space-around', paddingTop: 40, paddingBottom: 10 }}>

        {/* Title */} 
        <View style={{ alignItems: 'center' }}>  
          <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 30 }}>
            Login
          </Text> 
        </View> 

        {/* form */} 
        <View className="flex items-center mx-4 space-y-4">
          <View className="bg-black/5 p-5 rounded-2xl w-full">
            <TextInput placeholder='Email' placeholderTextColor={'gray'} />
          </View>
          <View className="bg-black/5 p-5 rounded-2xl w-full mb-3">
            <TextInput placeholder='Password' placeholderTextColor={'gray'} secureTextEntry />
          </View>
          <View className="w-full">
            <TouchableOpacity 
              className="w-full bg-sky-400 p-3 rounded-2xl mb-3">
                <Text className="text-xl font bold text-white text-center">Login</Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center">
            <Text>Don't have an account? </Text>
            <TouchableOpacity>
              <Text className="text-sky-600">SignUp</Text>
            </TouchableOpacity>
            </View> 
        </View> 
      </View>
    </View>
  );
}
