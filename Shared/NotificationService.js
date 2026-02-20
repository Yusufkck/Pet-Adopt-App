import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from './../config/FirebaseConfig';

// 1. Telefonun bildirim adresini (Token) alan fonksiyon
export const registerForPushNotificationsAsync = async () => {
  let token;

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Bildirim izni verilmedi!');
      return;
    }

    // KRİTİK NOT: 'projectId' kısmına app.json dosyasındaki "eas": {"projectId": "..."} içindeki ID'yi yazmalısın.
    // Eğer bulamazsan expo.dev sitesindeki proje ayarlarından kopyala.
    token = (await Notifications.getExpoPushTokenAsync({
      projectId: '4698ae94-9fec-4535-ba2b-e57d0c67c5fc', 
    })).data;
    
    console.log("Posta Kutusu Adresi (Token):", token);
  } else {
    console.log('Bildirimler için fiziksel cihaz gerekli (Emülatörde çalışmaz)');
  }

  return token;
};

// 2. Alınan Token'ı Firebase'de kullanıcının profiline kaydeden fonksiyon
export const saveTokenToFirebase = async (userEmail, token) => {
  if (!userEmail || !token) return;
  try {
    // Firebase'deki 'Users' koleksiyonunda, döküman ID'si email olan kaydı güncelliyoruz
    const userRef = doc(db, 'Users', userEmail); 
    await updateDoc(userRef, {
      pushToken: token
    });
    console.log("Token başarıyla Firebase'e mühürlendi! ✅");
  } catch (error) {
    console.log("Token kaydedilirken hata oluştu:", error);
  }
};