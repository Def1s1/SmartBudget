import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { Slot } from 'expo-router';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';
import { TransactionProvider } from './context/TransactionContext';
import BottomTabNavigator from './components/BottomTab'; // Подключаем готовый BottomTab

// Предотвращаем скрытие SplashScreen, пока приложение загружается
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <TransactionProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Slot /> {/* Здесь рендерятся экраны */}
        <BottomTabNavigator /> {/* Всегда отображается снизу */}
        <StatusBar style="auto" />
      </ThemeProvider>
    </TransactionProvider>
  );
}
