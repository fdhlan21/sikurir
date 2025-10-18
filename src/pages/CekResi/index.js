import { View, Text, ScrollView, TouchableNativeFeedback, TextInput, Animated } from 'react-native'
import React, { useState, useRef, useEffect } from 'react'
import { MyHeader, MyInput } from '../../components'
import { colors, fonts } from '../../utils'
import resiJSON from '../../pages/CekResi/resi.json' // Sesuaikan path-nya
import { Icon } from 'react-native-elements'


export default function CekResi({navigation}) {
  const [noResi, setNoResi] = useState('');
  const [hasilResi, setHasilResi] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // animated "Loading" wave for button
  const loadingText = 'Loading';
  const letters = loadingText.split('');
  const animVals = useRef(letters.map(() => new Animated.Value(0))).current;
  const animLoopRef = useRef(null);

  useEffect(() => {
    if (isLoading) {
      const animations = letters.map((_, i) =>
        Animated.sequence([
          Animated.timing(animVals[i], { toValue: -7, duration: 300, useNativeDriver: true }),
          Animated.timing(animVals[i], { toValue: 0, duration: 300, useNativeDriver: true }),
        ])
      );
      animLoopRef.current = Animated.loop(Animated.stagger(100, animations));
      animLoopRef.current.start();
    } else {
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

  const handleCekResi = async () => {
    if (!noResi) {
      alert('Mohon masukkan nomor resi');
      return;
    }

    try {
      setIsLoading(true);
      // delay supaya animasi terlihat
      await new Promise(res => setTimeout(res, 700));

      const hasil = resiJSON.resi_data.find(
        item => item.no_resi.toLowerCase() === noResi.toLowerCase()
      );

      if (hasil) {
        setHasilResi(hasil);
      } else {
        alert('Nomor resi tidak ditemukan');
        setHasilResi(null);
      }
    } catch (e) {
      console.log(e);
      alert('Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Terkirim':
        return '#4caf50';
      case 'Dalam Perjalanan':
        return '#ff9800';
      case 'Diproses':
        return '#2196f3';
      default:
        return '#666';
    }
  };

  return (
    <View style={{
        flex:1,
        backgroundColor:'white',
    }}>
     <MyHeader title="Cek Resi"/>

     <ScrollView>
      <View style={{
        padding:20,
      }}>
        
        <MyInput 
          label="Masukan Nomor Resi"
          placeholder="Contoh: JKT001234567"
          value={noResi}
          onChangeText={setNoResi}
        />

        <TouchableNativeFeedback onPress={handleCekResi} disabled={isLoading}>
          <View style={{
            padding: 10,
            backgroundColor: colors.primary,
            borderRadius: 20,
            marginTop: 20,
            minHeight: 48,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {!isLoading && (
              <Text style={{
                textAlign: 'center',
                fontFamily: fonts.primary[600],
                color: 'white',
                fontSize: 16,
              }}>
                Cek Resi
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

        {/* Card Hasil Resi */}
        {hasilResi && (
          <View style={{
            marginTop: 20,
            backgroundColor: '#f8f9fa',
            borderRadius: 10,
            padding: 10,
            borderWidth: 0.5,
            
          }}>
            {/* Header Info */}
            <View style={{
              backgroundColor: colors.primary,
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
            }}>
              <Text style={{
                fontFamily: fonts.primary[700],
                fontSize: 18,
                color: 'white',
                marginBottom: 5,
              }}>
                {hasilResi.no_resi}
              </Text>
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
                <Text style={{
                  fontFamily: fonts.primary[400],
                  fontSize: 12,
                  color: 'white',
                }}>
                  Layanan: {hasilResi.layanan}
                </Text>
                <View style={{
                  backgroundColor: 'white',
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 15,
                }}>
                  <Text style={{
                    fontFamily: fonts.primary[600],
                    fontSize: 12,
                    color: getStatusColor(hasilResi.status),
                  }}>
                    {hasilResi.status}
                  </Text>
                </View>
              </View>
            </View>

            {/* Info Pengirim & Penerima */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
            }}>
              <View style={{ marginBottom: 15 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Icon type="ionicon" name="cube-outline" color={colors.primary} size={16} containerStyle={{marginRight:8}} />
                  <Text style={{
                    fontFamily: fonts.primary[600],
                    fontSize: 14,
                    color: colors.primary,
                    marginBottom: 0,
                  }}>
                    Pengirim
                  </Text>
                </View>
                <Text style={{
                  fontFamily: fonts.primary[600],
                  fontSize: 14,
                }}>
                  {hasilResi.pengirim.nama}
                </Text>
                <Text style={{
                  fontFamily: fonts.primary[400],
                  fontSize: 12,
                  color: '#666',
                }}>
                  {hasilResi.pengirim.alamat}
                </Text>
                <Text style={{
                  fontFamily: fonts.primary[400],
                  fontSize: 12,
                  color: '#666',
                }}>
                  {hasilResi.pengirim.telepon}
                </Text>
              </View>

              <View style={{
                borderBottomWidth: 1,
                borderBottomColor: '#e0e0e0',
                marginBottom: 15,
              }} />

              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Icon type="ionicon" name="location-outline" color={colors.primary} size={16} containerStyle={{marginRight:8}} />
                  <Text style={{
                    fontFamily: fonts.primary[600],
                    fontSize: 14,
                    color: colors.primary,
                    marginBottom: 0,
                  }}>
                    Penerima
                  </Text>
                </View>
                <Text style={{
                  fontFamily: fonts.primary[600],
                  fontSize: 14,
                }}>
                  {hasilResi.penerima.nama}
                </Text>
                <Text style={{
                  fontFamily: fonts.primary[400],
                  fontSize: 12,
                  color: '#666',
                }}>
                  {hasilResi.penerima.alamat}
                </Text>
                <Text style={{
                  fontFamily: fonts.primary[400],
                  fontSize: 12,
                  color: '#666',
                }}>
                  {hasilResi.penerima.telepon}
                </Text>
              </View>
            </View>

            {/* Detail Paket */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 15,
              marginBottom: 15,
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
              <View>
                <Text style={{
                  fontFamily: fonts.primary[600],
                  fontSize: 12,
                  color: '#666',
                }}>
                  Tanggal Kirim
                </Text>
                <Text style={{
                  fontFamily: fonts.primary[600],
                  fontSize: 14,
                }}>
                  {hasilResi.tanggal_kirim}
                </Text>
              </View>
              <View>
                <Text style={{
                  fontFamily: fonts.primary[600],
                  fontSize: 12,
                  color: '#666',
                }}>
                  Berat
                </Text>
                <Text style={{
                  fontFamily: fonts.primary[600],
                  fontSize: 14,
                }}>
                  {hasilResi.berat}
                </Text>
              </View>
            </View>

            {/* Tracking History */}
            <View style={{
              backgroundColor: 'white',
              borderRadius: 10,
              padding: 15,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
                <Icon type="ionicon" name="location-outline" color={colors.primary} size={18} containerStyle={{marginRight:8}} />
                <Text style={{
                  fontFamily: fonts.primary[700],
                  fontSize: 16,
                  color: colors.primary,
                }}>
                  Riwayat Pengiriman
                </Text>
              </View>

              {hasilResi.tracking.map((track, index) => (
                <View 
                  key={index}
                  style={{
                    flexDirection: 'row',
                    marginBottom: 15,
                  }}
                >
                  <View style={{
                    alignItems: 'center',
                    marginRight: 15,
                  }}>
                    <View style={{
                      width: 12,
                      height: 12,
                      borderRadius: 6,
                      backgroundColor: index === 0 ? colors.primary : '#e0e0e0',
                    }} />
                    {index < hasilResi.tracking.length - 1 && (
                      <View style={{
                        width: 2,
                        flex: 1,
                        backgroundColor: '#e0e0e0',
                        marginVertical: 5,
                      }} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{
                      fontFamily: fonts.primary[600],
                      fontSize: 13,
                      marginBottom: 3,
                    }}>
                      {track.status}
                    </Text>
                    <Text style={{
                      fontFamily: fonts.primary[400],
                      fontSize: 11,
                      color: '#666',
                    }}>
                      {track.lokasi}
                    </Text>
                    <Text style={{
                      fontFamily: fonts.primary[400],
                      fontSize: 11,
                      color: '#999',
                    }}>
                      {track.tanggal}
                    </Text>
                    {track.penerima && (
                      <Text style={{
                        fontFamily: fonts.primary[600],
                        fontSize: 11,
                        color: '#4caf50',
                        marginTop: 3,
                      }}>
                        Diterima oleh: {track.penerima}
                      </Text>
                    )}
                  </View>
                </View>
              ))}
            </View>

          </View>
        )}

      </View>
     </ScrollView>
    </View>
  )
}