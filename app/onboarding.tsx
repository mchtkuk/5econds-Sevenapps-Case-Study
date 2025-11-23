import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface OnboardingSlide {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
}

const slides: OnboardingSlide[] = [
  {
    id: '1',
    icon: 'videocam',
    title: 'Capture Life in 5 Seconds',
    description: 'Transform your everyday moments into meaningful 5-second memories that last forever.',
    color: '#0095f6',
  },
  {
    id: '2',
    icon: 'cut',
    title: 'Perfect Every Moment',
    description: 'Select the best 5 seconds from any video. No more long boring clips, just the good stuff.',
    color: '#10b981',
  },
  {
    id: '3',
    icon: 'heart',
    title: 'Your Personal Diary',
    description: 'Build a collection of funny, meaningful memories. One 5-second clip at a time.',
    color: '#f43f5e',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useSharedValue(0);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
      setCurrentIndex(nextIndex);
    } else {
      handleGetStarted();
    }
  };

  const handleSkip = () => {
    handleGetStarted();
  };

  const handleGetStarted = async () => {
    try {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving onboarding status:', error);
      router.replace('/(tabs)');
    }
  };

  const renderSlide = ({ item, index }: { item: OnboardingSlide; index: number }) => {
    return (
      <View style={{ width: SCREEN_WIDTH }} className="flex-1 items-center justify-center px-8">
        <View
          className="w-32 h-32 rounded-full items-center justify-center mb-8"
          style={{ backgroundColor: `${item.color}20` }}
        >
          <Ionicons name={item.icon} size={64} color={item.color} />
        </View>

        <Text className="text-3xl font-bold text-white text-center mb-4">
          {item.title}
        </Text>

        <Text className="text-base text-gray-400 text-center leading-6">
          {item.description}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1">
        {/* Skip Button */}
        {currentIndex < slides.length - 1 && (
          <View className="absolute top-4 right-4 z-10">
            <TouchableOpacity onPress={handleSkip} className="px-4 py-2">
              <Text className="text-gray-400 text-sm font-semibold">Skip</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderSlide}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / SCREEN_WIDTH);
            setCurrentIndex(index);
          }}
          scrollEventThrottle={16}
        />

        {/* Pagination Dots */}
        <View className="flex-row justify-center items-center mb-8">
          {slides.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full mx-1 ${
                index === currentIndex ? 'w-8 bg-instagram-primary' : 'w-2 bg-gray-600'
              }`}
            />
          ))}
        </View>

        {/* Next/Get Started Button */}
        <View className="px-8 pb-8">
          <TouchableOpacity
            onPress={handleNext}
            className="bg-instagram-primary py-4 rounded-full items-center"
          >
            <Text className="text-white text-base font-semibold">
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
