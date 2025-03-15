# SmartBudget

SuperBudget is an iOS and Android app built with React Native and Expo.

The app is a personal finance tracking tool that allows you to enter every expense and income to ensure you manage your budget effectively.

<p align="center">
  <img src="https://github.com/Def1s1/SmartBudget/blob/main/assets/images/logo-git.png" width="250"/>
</p>

### Download the app

##### PlayStore:

<a href=''><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png' width="170"/></a>

##### AppStore:

<a href=''><img alt='Get it on AppStore' src='https://devimages-cdn.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg' width="140"/></a>

### Motivations

This project was created as a pet project to learn React Native and Expo.

SuperBudget does not aim to be revolutionary or even highly advanced; it's just a simple app for people who want to manage their finances easily.

### Technical details

The app is made with React Native using the following tech stack:
- React Native: [https://reactnative.dev/](https://reactnative.dev/)
- Expo: [https://expo.dev/](https://expo.dev/)

The app follows a modular component-based architecture, ensuring maintainability and scalability.

### Data provider

Expense data is stored securely using Supabase and Firebase Firestore.

<p align="center">
  <img src="https://via.placeholder.com/200" width="200" />
</p>

## Getting Started

### Cloning the Project
To get started with SmartBudget, clone the repository to your local machine:
```
git clone https://github.com/Def1s1/SmartBudget.git
cd SmartBudget
```

### Running the Project
Make sure you have Node.js and npm installed. Install Expo CLI and start the project using:
```
npm install -g expo-cli
npm install
npx expo start
```
This will start the Expo developer tools in your web browser. From there, you can run the app on an iOS or Android simulator, or on your physical device by scanning the QR code with the Expo Go app.

### Building for Android and iOS
Make sure you are logged into your Expo account and follow these steps:

#### For Android:
```
expo build:android
```
Choose APK or Android App Bundle when prompted. Download the build from your Expo dashboard once completed.

#### For iOS:
```
expo build:ios
```
You will need an Apple Developer account to proceed. Follow the prompts to choose the type of build and download it from your Expo dashboard after completion.

### Copyright

Copyright (C) 2025 Def1s1. The name "SuperBudget", the app idea, and assets (images, names, wordings, etc.) are all under copyright.

Sources are available under the Apache 2 license (See LICENSE for details), and contributions are warmly welcomed!
