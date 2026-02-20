import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'; 

export default function UserItem({ userInfo }) {
  return (
    <Link href={'/chat?id=' + userInfo.docId} asChild>
      <TouchableOpacity style={{ marginVertical: 5 }}> 
        <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            backgroundColor: '#FFF', 
            borderRadius: 15,
            gap: 15
        }}>
          <Image 
            source={{ uri: userInfo?.imageUrl }}
            style={{
              width: 55,
              height: 55,
              borderRadius: 99,
              borderWidth: 1,
              borderColor: '#EDEDED'
            }}
          />         
          <View style={{ flex: 1 }}>
            <Text style={{
              fontFamily: 'Outfit', 
              fontSize: 18,
              color: '#000',
              fontWeight: '600' 
            }}>
              {userInfo?.name}
            </Text>
            <Text style={{
              fontFamily: 'Outfit',
              fontSize: 14,
              color: '#7F7F7F', 
              marginTop: 2
            }} numberOfLines={1}> 
              {userInfo?.email ? userInfo.email : "Tap to start chatting 👋"}
            </Text>
          </View>
          
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={Colors.PRIMARY || '#007AFF'} />
          
        </View>
        <View style={{
           marginLeft: 80,
           height: 1,
           backgroundColor: '#F0F0F0',
           marginTop: 5
        }}/>
        
      </TouchableOpacity>
    </Link>
  )
}