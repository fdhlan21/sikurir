import { View, Text, ScrollView, TouchableNativeFeedback, FlatList, TouchableOpacity, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { MyHeader, MyInput } from '../../components'
import { colors, fonts } from '../../utils'
import tarifJSON from '../../pages/CekTarif/cek.json' // Sesuaikan path-nya
import { Icon } from 'react-native-elements'

export default function CekTarif() {
  const [asal, setAsal] = useState('');
  const [tujuan, setTujuan] = useState('');
  const [showAsalList, setShowAsalList] = useState(false);
  const [showTujuanList, setShowTujuanList] = useState(false);
  const [hasilTarif, setHasilTarif] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // animated "Loading" wave
  const loadingText = 'Loading';
  const letters = loadingText.split('');
  const animVals = useRef(letters.map(() => new Animated.Value(0))).current;
  const animLoopRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      const animations = letters.map((_, i) =>
        Animated.sequence([
          Animated.timing(animVals[i], { toValue: -8, duration: 300, useNativeDriver: true }),
          Animated.timing(animVals[i], { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );
      // stagger and loop
      animLoopRef.current = Animated.loop(Animated.stagger(100, animations));
      animLoopRef.current.start();
    } else {
      // stop and reset
      if (animLoopRef.current) {
        animLoopRef.current.stop();
        animLoopRef.current = null;
      }
      animVals.forEach(v => v.setValue(0));
    }

    return () => {
      if (animLoopRef.current) {
        animLoopRef.current.stop();
        animLoopRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const filterKota = (text) => {
    if (!text) return [];
    return tarifJSON.daftar_kota.filter(kota =>
      kota.toLowerCase().startsWith(text.toLowerCase())
    );
  };

  const handleAsalChange = (text) => {
    setAsal(text);
    setShowAsalList(text.length > 0);
  };

  const handleTujuanChange = (text) => {
    setTujuan(text);
    setShowTujuanList(text.length > 0);
  };

  const selectAsal = (kota) => {
    setAsal(kota);
    setShowAsalList(false);
  };

  const selectTujuan = (kota) => {
    setTujuan(kota);
    setShowTujuanList(false);
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(angka);
  };

  const handleCekTarif = async () => {
    if (!asal || !tujuan) {
      alert('Mohon isi asal dan tujuan');
      return;
    }

    setIsLoading(true);

    // beri sedikit delay agar animasi terlihat
    await new Promise(res => setTimeout(res, 700));

    const hasil = tarifJSON.tarif_data.find(
      item => item.asal.toLowerCase() === asal.toLowerCase() &&
        item.tujuan.toLowerCase() === tujuan.toLowerCase()
    );

    if (hasil) {
      setHasilTarif(hasil);
    } else {
      alert('Tarif tidak ditemukan untuk rute ini');
      setHasilTarif(null);
    }

    setIsLoading(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <MyHeader title="Cek Tarif" />

      <ScrollView>
        <View style={{ padding: 20 }}>

          {/* Input Asal */}
          <View style={{ marginBottom: 10, zIndex: 2 }}>
            <MyInput
              label="Asal"
              placeholder="Masukan Alamat Asal"
              value={asal}
              onChangeText={handleAsalChange}
            />
            {showAsalList && filterKota(asal).length > 0 && (
              <View style={{
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10,
                marginTop: -10,
                maxHeight: 150,
                elevation: 3,
              }}>
                <FlatList
                  data={filterKota(asal)}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => selectAsal(item)}
                      style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
                    >
                      <Text style={{ fontFamily: fonts.primary[400], fontSize: 14 }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          {/* Input Tujuan */}
          <View style={{ marginBottom: 20, zIndex: 1 }}>

            <MyInput
              label="Tujuan"
              placeholder="Masukan Alamat Tujuan"
              value={tujuan}
              onChangeText={handleTujuanChange}
            />
            {showTujuanList && filterKota(tujuan).length > 0 && (
              <View style={{
                backgroundColor: 'white',
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 10,
                marginTop: -10,
                maxHeight: 150,
                elevation: 3,
              }}>
                <FlatList
                  data={filterKota(tujuan)}
                  keyExtractor={(item) => item}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => selectTujuan(item)}
                      style={{ padding: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' }}
                    >
                      <Text style={{ fontFamily: fonts.primary[400], fontSize: 14 }}>
                        {item}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}
          </View>

          {/* Tombol Cek Tarif */}
          <TouchableNativeFeedback onPress={handleCekTarif} disabled={isLoading}>
            <View style={{
              padding: 10,
              backgroundColor: colors.primary,
              borderRadius: 20,
              marginTop: 10,
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 48,
            }}>
              {!isLoading && (
                <Text style={{
                  textAlign: 'center',
                  fontFamily: fonts.primary[600],
                  color: 'white',
                  fontSize: 16,
                }}>
                  Cek Tarif
                </Text>
              )}

              {isLoading && (
                <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                  {letters.map((l, i) => (
                    <Animated.Text
                      key={i}
                      style={{
                        marginHorizontal: 2,
                        color: 'white',
                        fontSize: 16,
                        fontFamily: fonts.primary[600],
                        transform: [{ translateY: animVals[i] }],
                      }}>
                      {l}
                    </Animated.Text>
                  ))}
                </View>
              )}
            </View>
          </TouchableNativeFeedback>

          {/* Card Hasil Tarif */}
          {hasilTarif && (
            <View style={{
              marginTop: 20,
              backgroundColor: '#f8f9fa',
              borderRadius: 15,
              padding: 15,
              borderWidth: 0.5,
            }}>
              <Text style={{
                fontFamily: fonts.primary[700],
                fontSize: 18,
                color: colors.primary,
                marginBottom: 15,
              }}>
                Informasi Tarif
              </Text>

              <View style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 12,
                marginBottom: 10,
              }}>
                <Text style={{ fontFamily: fonts.primary[600], fontSize: 14, color: '#666' }}>
                  Rute Pengiriman
                </Text>
                <View style={{
                  flexDirection: "row",
                  justifyContent: 'flex-start',
                  alignItems: "center"

                }}>
                  <Text style={{ fontFamily: fonts.primary[700], fontSize: 16, marginTop: 5 }}>
                    {hasilTarif.asal}
                  </Text>
                  <Icon type='ionicon' name='arrow-forward' size={20} color='#666' style={{
                    marginHorizontal: 5
                  }} />
                  <Text style={{ fontFamily: fonts.primary[700], fontSize: 16, marginTop: 5 }}>
                    {hasilTarif.tujuan}
                  </Text>
                </View>

              </View>

              {/* Tarif OK */}
              <View style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 12,
                marginBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <View>
                  <Text style={{ fontFamily: fonts.primary[700], fontSize: 16, color: colors.primary }}>
                    Layanan OK
                  </Text>
                  <Text style={{ fontFamily: fonts.primary[400], fontSize: 12, color: '#666', marginTop: 2 }}>
                    Estimasi: {hasilTarif.estimasi_waktu.OK}
                  </Text>
                </View>
                <Text style={{ fontFamily: fonts.primary[700], fontSize: 16, color: colors.primary }}>
                  {formatRupiah(hasilTarif.tarif.OK)}
                </Text>
              </View>

              {/* Tarif REG */}
              <View style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 12,
                marginBottom: 8,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <View>
                  <Text style={{ fontFamily: fonts.primary[700], fontSize: 16, color: '#ff9800' }}>
                    Layanan REG
                  </Text>
                  <Text style={{ fontFamily: fonts.primary[400], fontSize: 12, color: '#666', marginTop: 2 }}>
                    Estimasi: {hasilTarif.estimasi_waktu.REG}
                  </Text>
                </View>
                <Text style={{ fontFamily: fonts.primary[700], fontSize: 16, color: '#ff9800' }}>
                  {formatRupiah(hasilTarif.tarif.REG)}
                </Text>
              </View>

              {/* Tarif YES */}
              <View style={{
                backgroundColor: 'white',
                borderRadius: 10,
                padding: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <View>
                  <Text style={{ fontFamily: fonts.primary[700], fontSize: 16, color: '#4caf50' }}>
                    Layanan YES
                  </Text>
                  <Text style={{ fontFamily: fonts.primary[400], fontSize: 12, color: '#666', marginTop: 2 }}>
                    Estimasi: {hasilTarif.estimasi_waktu.YES}
                  </Text>
                </View>
                <Text style={{ fontFamily: fonts.primary[700], fontSize: 16, color: '#4caf50' }}>
                  {formatRupiah(hasilTarif.tarif.YES)}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  )
}