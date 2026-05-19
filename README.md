# Acolhe+ Mobile

App mobile do Acolhe+ — migração do projeto web (React + Vite) para React Native com Expo.

## Stack

- **React Native** + **Expo SDK 52**
- **@react-navigation** — navegação (Stack + Bottom Tabs)
- **AsyncStorage** — substituiu localStorage
- **react-native-safe-area-context** — safe areas iOS/Android

## Estrutura

```
acolhe-mobile/
├── App.jsx                        # Ponto de entrada (SafeAreaProvider + AuthProvider)
├── app.json                       # Config Expo
├── babel.config.js
├── package.json
└── src/
    ├── theme.js                   # Equivalente às CSS variables do App.css
    ├── context/
    │   └── AuthContext.jsx        # Mesmo AuthContext web, localStorage → AsyncStorage
    ├── navigation/
    │   └── index.jsx              # RootNavigator (Tab + Stacks)
    ├── components/
    │   └── BottomTabBar.jsx       # Equivalente ao BottomNav.jsx web
    ├── screens/                   # (a criar — equivalente a pages/)
    │   ├── HomeScreen.jsx
    │   ├── SearchScreen.jsx
    │   ├── PsychologistScreen.jsx
    │   ├── LoginScreen.jsx
    │   ├── RegisterScreen.jsx
    │   ├── ProfileScreen.jsx
    │   └── FichaScreen.jsx
    └── data/
        └── psychologists.js       # Igual ao web, zero alterações
```

## Como rodar

```bash
npm install
npx expo start
```

Depois escaneie o QR com o app **Expo Go** no celular, ou pressione:
- `a` para Android (emulador)
- `i` para iOS (simulador macOS)

## Mapeamento Web → Mobile

| Web | Mobile |
|-----|--------|
| `<div>` / `<span>` | `<View>` / `<Text>` |
| `<input>` | `<TextInput>` |
| `<button onClick>` | `<TouchableOpacity onPress>` |
| `<img src>` | `<Image source={{ uri }}>`|
| `<form onSubmit>` | sem form, lógica no `onPress` |
| `react-router-dom` | `@react-navigation` |
| CSS classes | `StyleSheet.create()` |
| CSS variables | `src/theme.js` |
| `localStorage` | `AsyncStorage` |
| `useNavigate` | `useNavigation` |
| `useParams` | `useRoute().params` |
| `<Link to>` | `navigation.navigate()` |

## Próximos passos

1. Copiar `src/data/psychologists.js` do projeto web (sem alterações)
2. Criar screens uma a uma — começar por `LoginScreen` e `HomeScreen`
3. Substituir os placeholders em `src/navigation/index.jsx` pelos imports reais
4. Adicionar ícones com `@expo/vector-icons` no `BottomTabBar`
