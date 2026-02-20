import { View, Text, Image } from 'react-native'
import React from 'react'
import Colors from '../../constants/Colors'
import PetSubInfoCard from './PetSubInfoCard'

export default function PetSubInfo({pet}) {
  return (
    <View style={{
        paddingHorizontal:20
    }}>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
      }}>
       <PetSubInfoCard 
       icon={require('./../../assets/images/DALL-E age.png.webp')}
        title={'Age'}
        value={pet?.age}
       />
       <PetSubInfoCard 
       icon={require('./../../assets/images/DALL-E breed.png.webp')}
        title={'Breed'}
        value={pet?.breed}
       />
        
      </View>
      <View style={{
        display: 'flex',
        flexDirection: 'row',
      }}>
       <PetSubInfoCard 
       icon={require('./../../assets/images/DALL-E sex.png.webp')}
        title={'Sex'}
        value={pet?.sex}
       />
       <PetSubInfoCard 
       icon={require('./../../assets/images/DALL-E weight.png.webp')}
        title={'Weight'}
        value={pet?.weight}
       />
        
      </View>
    </View>
  )
}
