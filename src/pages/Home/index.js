import React, {useEffect, useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {getData} from '../../utils/localStorage';
import {colors, fonts} from '../../utils';

const WINDOW_WIDTH = Dimensions.get('window').width;
const SLIDE_WIDTH = WINDOW_WIDTH * 0.8; // lebar card slide
const GAP = 16; // jarak antar slide
const SIDE_PADDING = (WINDOW_WIDTH - SLIDE_WIDTH) / 2; // padding agar slide center

export default function Home({navigation}) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);
  const slideIndexRef = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    getData('user')
      .then(u => {
        setUser(u);
        console.log('User on Home (local):', u);
      })
      .catch(err => {
        console.log('Error reading user from local storage:', err);
      });
  }, []);

  const slides = [
    {key: 's1', image: require('../../assets/logo.png')},
    {key: 's2', image: require('../../assets/logo.png')},
    {key: 's3', image: require('../../assets/logo.png')},
  ];

  // auto scroll
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      const next = (slideIndexRef.current + 1) % slides.length;
      slideIndexRef.current = next;
      setActiveSlide(next);
      if (scrollRef.current) {
        scrollRef.current.scrollTo({x: next * (SLIDE_WIDTH + GAP), animated: true});
      }
    }, 3500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = ({nativeEvent}) => {
    const idx = Math.round(nativeEvent.contentOffset.x / (SLIDE_WIDTH + GAP));
    slideIndexRef.current = idx;
    setActiveSlide(idx);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top card */}
      <View style={styles.topCard}>
        <View style={{flex: 1}}>
          <Text style={styles.greeting}>
            Halo{user ? `, ${user.nama_lengkap || user.name || user.username}` : ''}
          </Text>
          <Text style={styles.greetsub}>Selamat datang kembali</Text>
        </View>
        <View style={styles.topLogoWrap}>
          <Image source={require('../../assets/logo.png')} style={styles.topLogo} resizeMode="contain" />
        </View>
      </View>

      {/* Slider */}
      <View style={styles.sliderContainer}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled={false}
          snapToInterval={SLIDE_WIDTH + GAP}
          snapToAlignment="center"
          decelerationRate="fast"
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          contentContainerStyle={{paddingHorizontal: SIDE_PADDING}}>
          {slides.map((s, i) => (
            <View
              key={s.key}
              style={[
                styles.slide,
                {backgroundColor: '#fff', width: SLIDE_WIDTH, marginRight: i === slides.length - 1 ? 0 : GAP},
              ]}>
              <Image source={s.image} style={styles.slideImage} resizeMode="contain" />
            </View>
          ))}
        </ScrollView>

        <View style={styles.dots}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                activeSlide === i ? {backgroundColor: colors.primary, width: 18} : {},
              ]}
            />
          ))}
        </View>
      </View>

      {/* Menu */}
      <View style={styles.menuArea}>
        <TouchableOpacity
          style={styles.menuCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CekTarif')}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>💲</Text>
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={styles.menuTitle}>Cek Tarif</Text>
            <Text style={styles.menuSubtitle}>Cek ongkos kirim dengan cepat</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuCard, {marginTop: 12}]}
          activeOpacity={0.8}
          onPress={() => console.log('Cek Resi tapped')}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>🔎</Text>
          </View>
          <View style={styles.menuTextWrap}>
            <Text style={styles.menuTitle}>Cek Resi</Text>
            <Text style={styles.menuSubtitle}>Lacak status pengiriman</Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F7F7F7'},

  topCard: {
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  greeting: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 4,
    fontFamily: fonts?.secondary?.[800],
  },
  greetsub: {
    fontSize: 12,
    color: '#fff',
    fontFamily: fonts?.secondary?.[600],
  },
  topLogoWrap: {
    backgroundColor: colors.white,
    borderRadius: 8,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topLogo: {width: 56, height: 56},

  sliderContainer: {
    height: 200,
    marginTop: 16,
  },
  slide: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    overflow: 'hidden',
    height: 160,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 6,
  },
  slideImage: {
    width: SLIDE_WIDTH * 0.8,
    height: 120,
    alignSelf: 'center',
  },
  dots: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: 8,
    width: 8,
    borderRadius: 8,
    backgroundColor: '#ccc',
    marginHorizontal: 6,
  },

  menuArea: {padding: 20},
  menuCard: {
    width: '100%',
    height: 110,
    backgroundColor: colors.primary,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  iconWrap: {
    width: 72,
    height: 72,
    borderRadius: 12,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {fontSize: 28},
  menuTextWrap: {flex: 1},
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    fontFamily: fonts?.secondary?.[800],
  },
  menuSubtitle: {
    fontSize: 13,
    color: 'white',
    marginTop: 6,
    fontFamily: fonts?.secondary?.[600],fontFamily: fonts?.secondary?.[600],
  },
});