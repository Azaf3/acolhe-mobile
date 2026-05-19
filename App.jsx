// App.jsx — ponto de entrada do app
// Equivalente ao main.jsx + App.jsx do projeto web
//
// Web tinha:
//   <BrowserRouter> → <AuthProvider> → <Routes>
//
// Mobile tem:
//   <SafeAreaProvider> → <AuthProvider> → <NavigationContainer> (dentro do RootNavigator)

import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { AuthProvider } from './src/context/AuthContext'
import { RootNavigator } from './src/navigation'

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        {/* StatusBar verde para combinar com o tema do app */}
        <StatusBar style="dark" backgroundColor="#ffffff" />
        <RootNavigator />
      </AuthProvider>
    </SafeAreaProvider>
  )
}
