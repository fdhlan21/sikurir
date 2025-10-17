// ...existing code...
import {View, Text, ScrollView, Image} from 'react-native';
import React from 'react';
import {colors, fonts, windowWidth} from '../../utils';
import {useToast} from 'react-native-toast-notifications';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import {MyButton, MyGap, MyInput} from '../../components';
import {useState} from 'react';
import SoundPlayer from 'react-native-sound-player';
import axios from 'axios';
import {apiURL, storeData, getData} from '../../utils/localStorage';
import MyLoading from '../../components/MyLoading';
import {TouchableOpacity} from 'react-native';

export default function Register({navigation, route}) {
  const [kirim, setKirim] = useState({
    nama_lengkap: '',
    username: '',
    telepon: '',
    alamat: '',
    password: '',
  });

  const toast = useToast();
  const updateKirim = (x, v) => {
    setKirim({
      ...kirim,
      [x]: v,
    });
  };
  
  const [loading, setLoading] = useState(false);

  // Fungsi untuk registrasi lokal
  const registerLocal = async (userData) => {
    try {
      // Ambil data users yang sudah ada
      const existingUsers = await getData('local_users') || [];
      
      // Cek apakah username sudah ada
      const userExists = existingUsers.find(user => user.username === userData.username);
      if (userExists) {
        return { success: false, message: 'Username sudah digunakan!' };
      }

      // Buat user baru dengan ID unik
      const newUser = {
        id: Date.now().toString(), // Simple ID generator
        nama_lengkap: userData.nama_lengkap,
        username: userData.username,
        telepon: userData.telepon,
        alamat: userData.alamat,
        password: userData.password, // Dalam implementasi nyata, password harus di-hash
        userType: 'customer', // Default customer untuk register
        created_at: new Date().toISOString(),
      };

      // Tambahkan user baru ke array
      const updatedUsers = [...existingUsers, newUser];
      
      // Simpan ke storage lokal
      await storeData('local_users', updatedUsers);
      
      return { success: true, data: newUser };
    } catch (error) {
      console.error('Error saving to local storage:', error);
      return { success: false, message: 'Gagal menyimpan data lokal' };
    }
  };

  const sendData = async () => {
    if (kirim.nama_lengkap.length == 0) {
      toast.show('Nama Lengkap masih kosong !');
    } else if (kirim.username.length == 0) {
      toast.show('Username masih kosong !');
    } else if (kirim.telepon.length == 0) {
      toast.show('Telepon masih kosong !');
    } else if (kirim.alamat.length == 0) {
      toast.show('Alamat masih kosong !');
    } else if (kirim.password.length == 0) {
      toast.show('Kata sandi masih kosong !');
    } else {
      console.log(kirim);
      setLoading(true);
      
      try {
        // Coba registrasi ke server dulu (tetap pakai jika tersedia)
        const response = await axios.post(apiURL + 'register', kirim);
        
        setTimeout(async () => {
          setLoading(false);
          toast.show(response.data.message || 'Registrasi berhasil', {type: 'success'});

          // Simpan juga ke local storage jika ingin offline
          await registerLocal(kirim);

          navigation.navigate('Login');
        }, 700);
        
      } catch (error) {
        console.log('Server registration failed, saving to local storage:', error);
        
        // Jika gagal ke server, coba simpan lokal
        const localResult = await registerLocal(kirim);
        
        setTimeout(() => {
          setLoading(false);
          if (localResult.success) {
            toast.show('Registrasi berhasil (disimpan lokal)', {type: 'success'});
            navigation.navigate('Login');
          } else {
            toast.show(localResult.message || 'Registrasi gagal, silakan coba lagi', {type: 'danger'});
          }
        }, 700);
      }
    }
  };

  return (
    <View
      style={{flex: 1, backgroundColor: colors.white, flexDirection: 'column'}}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}>
          <Image
            source={require('../../assets/logo.png')}
            style={{
              width: 220,
              height: 220,
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: 'flex-start',
            backgroundColor: colors.white,
            paddingHorizontal: 20,
            paddingBottom: 30,
          }}>
          <Text
            style={{
              marginBottom: 20,
              fontFamily: fonts.secondary[800],
              fontSize: 20,
            }}>
            Daftar
          </Text>

          <MyInput
            value={kirim.nama_lengkap}
            onChangeText={x => updateKirim('nama_lengkap', x)}
            label="Nama Lengkap"
            placeholder="Masukan nama lengkap"
            iconname="person-outline"
          />

          <MyInput
            value={kirim.username}
            onChangeText={x => updateKirim('username', x)}
            label="Username"
            placeholder="Masukan username"
            iconname="at"
          />

          <MyInput
            value={kirim.telepon}
            onChangeText={x => updateKirim('telepon', x)}
            label="Telepon"
            placeholder="Masukan nomor telepon"
            iconname="call-outline"
            keyboardType="phone-pad"
          />

          <MyInput
            value={kirim.alamat}
            onChangeText={x => updateKirim('alamat', x)}
            label="Alamat"
            placeholder="Masukan alamat lengkap"
            iconname="home-outline"
          />

          <MyInput
            value={kirim.password}
            onChangeText={x => updateKirim('password', x)}
            label="Kata Sandi"
            placeholder="Masukan kata sandi"
            iconname="lock-closed-outline"
            secureTextEntry
          />
          <MyGap jarak={20} />
          {!loading && <MyButton onPress={sendData} title="DAFTAR" />}
          {loading && <MyLoading />}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            style={{
              marginTop: 10,
              justifyContent: 'center',
              alignItems: 'center',
              padding: 15,
            }}>
            <Text
              style={{
                fontFamily: fonts.secondary[600],
                fontSize: 14,
              }}>
              Sudah punya akun ?{' '}
              <Text
                style={{
                  color: colors.primary,
                  fontFamily: fonts.secondary[800],
                }}>
                Masuk disini
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
// ...existing code...