import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection,  getDocs,  query, where } from 'firebase/firestore'
import { useUser } from '@clerk/clerk-expo'
import { db } from '../../config/FirebaseConfig';
import UserItem from '../../components/Inbox/UserItem';

export default function Inbox() {
  const { user} =useUser();
  const [userList, setUserList] = useState([]);
  const [loader ,setLoader] = useState(false);
  useEffect(()=>{
    user&&GetUserList();
  },[user])
  //get user list depends on current user emails
  const GetUserList = async() => {
    setLoader(true);
   setUserList([]); 
   const q = query(collection(db , 'Chat'),
    where('userIds','array-contains', user?.primaryEmailAddress?.emailAddress ));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(doc=>{
      setUserList(prevList=>[...prevList, doc.data()])
    })
    setLoader(false);
  }

  //filter the list of other user in one state
  const MapOtherUserList=()=>{
    const List =[];
  userList.forEach((record)=>{
    const otherUser=record.users?.filter(u=>u?.email!=user?.primaryEmailAddress?.emailAddress);
    const result ={
      docId:record.id,
      ...otherUser[0]
    }
    List.push(result);  
  })
  return List;
  }
  return (
    <View style={{
      padding:20,
      marginTop:20,
    }}>
      <Text style={{
        fontFamily:'Outfit-Medium',
        fontSize:30,
      }}>Messages</Text>
      <FlatList
        data={MapOtherUserList()}
        refreshing={loader}
        onRefresh={GetUserList}
        style={{
          marginTop:20
        }}
        renderItem={({item,index})=>(
          <UserItem userInfo={item} key={index}/>
        )}
      />
    </View>
  )
}