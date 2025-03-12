import React, { useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import InAppReview from 'react-native-in-app-review';

const InAppReviewScreen = () => {
  useEffect(() => {
    // Показываем окно оценки только если доступно
    if (InAppReview.isAvailable()) {
      const timer = setTimeout(() => {
        requestReview();
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, []);

  const requestReview = () => {
    if (InAppReview.isAvailable()) {
      InAppReview.RequestInAppReview()
        .then((hasFlowFinishedSuccessfully) => {
          console.log('Оценка завершена:', hasFlowFinishedSuccessfully);
        })
        .catch((error) => {
          console.error('Ошибка вызова оценки:', error);
        });
    } else {
      Alert.alert('Оцените нас', 'Вы можете оценить приложение в Google Play.', [
        { text: 'OK' }
      ]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Нравится приложение?</Text>
      <Text style={styles.text}>Поделитесь своим мнением!</Text>
      <Button title="Оценить приложение" onPress={requestReview} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default InAppReviewScreen;
