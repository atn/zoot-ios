import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { ZootView } from './components/ZootView';

export default function App() {

  function Index() {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{color: '#fff', marginLeft: 20, fontWeight: '700', fontSize: 30}}>zoot</Text>
        <ZootView />
      </SafeAreaView>
    )
  }

  return (
    <NavigationContainer>
      <Index />
      <StatusBar style='light'/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
});
