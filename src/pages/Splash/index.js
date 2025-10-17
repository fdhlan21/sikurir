import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Image,
  Animated,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {MyButton, MyGap} from '../../components';
import {MyDimensi, colors, fonts, windowHeight, windowWidth} from '../../utils';
import {MYAPP, getData} from '../../utils/localStorage';

export default function Splash({navigation}) {
  // gunakan useRef agar nilai Animated.Value tidak dibuat ulang setiap render
  const img = useRef(new Animated.Value(0.5)).current;
  const textScale = useRef(new Animated.Value(0.8)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(img, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(textScale, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 750,
        useNativeDriver: true,
      }),
    ]).start();

    const t = setTimeout(() => {
      navigation.replace('Login');
    }, 1200);

    return () => clearTimeout(t);
  }, [img, textScale, textOpacity, navigation]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.Image
        source={require('../../assets/logo.png')}
        resizeMode="contain"
        style={[
          styles.logo,
          {
            transform: [{scale: img}],
          },
        ]}
      />

     

      <ActivityIndicator color={colors.primary} size="large" style={{marginTop: 16}} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white || '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: Math.min(windowWidth * 0.8, 420), // diperbesar: 80% lebar layar, max 420
    height: Math.min(windowHeight * 0.35, 300), // diperbesar: 35% tinggi layar, max 300
    marginBottom: 18,
  },
  appName: {
    fontSize: 20,
    color: colors.primary || '#0a84ff',
    fontWeight: '700',
    marginTop: 6,
  },
});