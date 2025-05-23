import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Image,
  Dimensions,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const images = [
  require('../assets/images/welcome/splash1.png'),
  require('../assets/images/welcome/splash2.png'),
  require('../assets/images/welcome/splash3.png'),
];

const Welcome = () => {
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const autoSlide = setInterval(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      scrollRef.current?.scrollTo({ x: nextIndex * width, animated: true });
      setCurrentIndex(nextIndex);
    }, 3000); // Slide every 3 seconds

    return () => clearInterval(autoSlide); // Clear interval on unmount
  }, [currentIndex]);

  // Handle manual swipes
  const handleScrollEnd = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / width);
    setCurrentIndex(index);
  };

  const handleImagePress = () => {
    router.push('/(auth)/authOption');
  };

  return (
      <View style={styles.container}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
        >
          {images.map((img, index) => (
            <Pressable key={index} onPress={handleImagePress}>
              <Image
                source={img}
                style={styles.image}
                resizeMode="cover"
              />
            </Pressable>
          ))}
        </ScrollView>
      </View>
    
  );
};

export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: width,
    height: '100%',
    justifyContent: 'center',
    objectFit: 'cover',
    alignItems: 'center',
  },
});
