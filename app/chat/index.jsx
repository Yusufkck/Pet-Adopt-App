import { View, Text, ImageBackground } from 'react-native';
import React, { useEffect, useState } from 'react'; 
import { useLocalSearchParams, useNavigation, Stack } from 'expo-router';
import { addDoc, collection, doc, getDoc, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from './../../config/FirebaseConfig';
import { useUser } from '@clerk/clerk-expo';
import { headerHeight } from '@react-navigation/elements';
import { GiftedChat } from 'react-native-gifted-chat';

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const navigation = useNavigation();
  const { user } = useUser();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!params?.id) return; 

    GetUserDetails();
    const q = query(collection(db, 'Chat', params?.id, 'Messages'), orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messageData = snapshot.docs.map((doc) => ({
        _id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
      }));
      setMessages(messageData);
    });
    return () => unsubscribe();
  }, [params?.id]); 

  const GetUserDetails = async () => {
    try {
      const docRef = doc(db, "Chat", params?.id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const result = docSnap.data();
        const otherUser = result?.users?.filter(item => item.email != user?.primaryEmailAddress?.emailAddress);
        
        if (otherUser && otherUser.length > 0) {
          navigation.setOptions({
            headerTitle: otherUser[0]?.name
          });
        }
      }
    } catch (error) {
      console.log("Kullanıcı detayları çekilirken hata:", error);
    }
  }

  const onSend = async (newMessage) => {
    setMessages((previousMessage) => GiftedChat.append(previousMessage, newMessage));
    newMessage[0].createdAt = new Date();
    await addDoc(collection(db, 'Chat', params?.id, 'Messages'), newMessage[0]);
  }

  return (
    <ImageBackground
      source={require('./../../assets/images/newyork and winter background.png')}
      style={{ flex: 1 }}>
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTitleStyle: { color: 'black', fontWeight: 'bold' },
          headerTintColor: 'black',
        }}
      />
      <GiftedChat
        messages={messages}
        onSend={messages => onSend(messages)}
        showUserAvatar={true}
        showAvatarForEveryMessage={true}
        user={{
          _id: user?.primaryEmailAddress?.emailAddress,
          name: user?.fullName,
          avatar: user?.imageUrl
        }}
        keyboardAvoidingViewProps={{ keyboardVerticalOffset: headerHeight }}
      />
    </ImageBackground>
  )
}