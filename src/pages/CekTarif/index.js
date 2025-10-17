import { View, Text, ScrollView, TouchableNativeFeedback } from 'react-native'
import React from 'react'
import { MyHeader, MyInput } from '../../components'
import { colors, fonts } from '../../utils'

export default function CekTarif() {
  return (
    <View style={{
        flex:1,
        backgroundColor:'white',
    }}>
      <MyHeader title="Cek Tarif"/>

    <ScrollView>
        <View style={{
            padding:10,
        }}>
        <MyInput label="Asal" placeholder="Masukan Alamat Asal"/>
        <MyInput label="Tujuan" placeholder="Masukan Alamat Tujuan"/>
        <MyInput label="OK" placeholder="Masukan Tarif Harga OK"/>
        <MyInput label="REG" placeholder="Masukan Tarif Harga REG"/>
        <MyInput label="YES" placeholder="Masukan Tarif Harga YES"/>

        <TouchableNativeFeedback>
            <View style={{
                padding:10,
                backgroundColor:colors.primary,
                borderRadius:20,
                
            }}>
            <Text style={{
                textAlign:'center',
                fontFamily:fonts.primary[600],
                color:'white',
                fontSize:16,
            }}>
                Cek Tarif
            </Text>

            </View>
        </TouchableNativeFeedback>
        </View>
    </ScrollView>
      
    </View>
  )
}