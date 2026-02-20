import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ImageBackground } from 'react-native'
import React, { useEffect , forwardRef, useImperativeHandle } from 'react'
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router'
import PetInfo from '../../components/PetDetails/PetInfo';
import PetSubInfo from '../../components/PetDetails/PetSubInfo';
import AboutPet from '../../components/PetDetails/AboutPet';
import OwnerInfo from '../../components/PetDetails/OwnerInfo';
import Colors from '../../constants/Colors';
import { useUser } from '@clerk/clerk-expo';
import {collection, doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { db } from '../../config/FirebaseConfig';

export default function PetDetails() {
    const pet = useLocalSearchParams();
    const navigation=useNavigation();
    const {user}=useUser();
    const router=useRouter();
    const Image=require('./../../assets/images/butonArkaplanı2.png.webp');
    
    

    useEffect(()=>{
        navigation.setOptions({
            headerTransparent: true,
            headerTitle:''
        })
 },[])
 /**
  * used to initiate chat between two user
  */

 const InitiateChat=async()=>{
     const docId1=user?.primaryEmailAddress?.emailAddress+'_'+pet?.userEmail;
     const docId2=pet?.userEmail+'_'+user?.primaryEmailAddress?.emailAddress;
     const q = query(collection(db,'Chat'),where('id','in',[docId1,docId2]));
     const querySnapshot = await getDocs(q);
     querySnapshot.forEach(doc=>{
      console.log(doc.data());
        router.push({
          pathname:'/chat',
          params:{id:doc.id}
        })
      })
      if(querySnapshot.docs?.length==0){
        await setDoc(doc(db, 'Chat',docId1),{
          id:docId1,
          users: [
            {
              email:user?.primaryEmailAddress?.emailAddress,
              imageUrl:user?.imageUrl,
              name:user?.fullName
            },
            {
              email:pet?.userEmail,
              imageUrl:pet?.userImage,
              name:pet?.userName
            }
          ],
          userIds:[user?.primaryEmailAddress?.emailAddress,pet?.userEmail]
      
        });
        router.push({
           pathname:'/chat',
           params:{id:docId1}
        })
      }
}
  return (
  <View>
    <ScrollView>

      {/* Pet Info */}
      <PetInfo pet={pet}/>
      {/*Pet SubInfo*/}
      <PetSubInfo pet={pet}/>

      {/*about*/}
      <AboutPet pet={pet}/>

      {/*owner detail*/}
      <OwnerInfo pet={pet}/>
      <View style={{
        height:90
      }}></View>

      </ScrollView>
{/*Adopt me button*/}
<View style={styles?.bottomContainer}>
<TouchableOpacity 
onPress={InitiateChat}
style={styles?.adoptBtn}>
<ImageBackground source={Image} style={styles?.backgroundImage} resizeMode='cover'>
      <Text style={{
          textAlign: 'center',
          fontFamily:'Outfit-Medium',
          fontSize:20
        }}>Adopt Me</Text>
      </ImageBackground>
      </TouchableOpacity>
</View>
</View>
  )
}
const styles = StyleSheet.create({
  adoptBtn:{
    padding:0,
    width:'100%',
    height:70,

  },
  bottomContainer:{
    position: 'absolute',
    width:'100%',
    bottom:0
  
  },
  backgroundImage:{
    width:'100%',
    height:'100%',
    alignItems: 'center',
    justifyContent: 'center',
  }
})


