// src/context/AuthContext.jsx
// Migração do AuthContext web:
// - localStorage → AsyncStorage (assíncrono)
// - Mesma API pública: login, logout, register, updateUser, useAuth

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AUTH_KEY = '@acolhe:auth_user'
const REGISTERED_KEY = '@acolhe:registered_user'

const AuthContext = createContext(null)

function buildDefaultProfile(profile) {
  const baseProfile = {
    address: '',
    sessions: [
      {
        id: 1,
        professional: 'Dra. Camila Rocha',
        specialty: 'Ansiedade',
        date: '12/03/2026',
        status: 'Realizada',
        notes: 'Foco em ansiedade e rotina de sono.',
      },
      {
        id: 2,
        professional: 'Dr. Rafael Mendes',
        specialty: 'Depressão',
        date: '21/03/2026',
        status: 'Realizada',
        notes: 'Retorno clínico, acompanhamento geral.',
      },
    ],
  }

  return {
    ...baseProfile,
    ...profile,
    address: profile?.address || '',
    sessions: profile?.sessions || baseProfile.sessions,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true) // evita flash de tela não autenticada

  // Carrega usuário salvo ao iniciar
  useEffect(() => {
    async function loadUser() {
      try {
        const stored = await AsyncStorage.getItem(AUTH_KEY)
        if (stored) {
          setUser(buildDefaultProfile(JSON.parse(stored)))
        }
      } catch (e) {
        console.error('Erro ao carregar usuário:', e)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  async function login({ email, password }) {
    try {
      const registeredRaw = await AsyncStorage.getItem(REGISTERED_KEY)
      const registered = registeredRaw ? JSON.parse(registeredRaw) : null

      const nextUser = registered && registered.email === email
        ? buildDefaultProfile(registered)
        : {
            name: email.split('@')[0],
            email,
            role: 'paciente',
            address: '',
            sessions: buildDefaultProfile().sessions,
          }

      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(nextUser))
      setUser(nextUser)
      return nextUser
    } catch (e) {
      console.error('Erro no login:', e)
      throw e
    }
  }

  async function register(profile) {
    try {
      const normalized = buildDefaultProfile(profile)
      await AsyncStorage.setItem(REGISTERED_KEY, JSON.stringify(normalized))
      return normalized
    } catch (e) {
      console.error('Erro no cadastro:', e)
      throw e
    }
  }

  async function updateUser(patch) {
    setUser(current => {
      if (!current) return current
      const next = { ...current, ...patch }

      // Persiste de forma assíncrona sem bloquear o setState
      AsyncStorage.setItem(AUTH_KEY, JSON.stringify(next)).catch(console.error)

      AsyncStorage.getItem(REGISTERED_KEY).then(raw => {
        if (!raw) return
        const reg = JSON.parse(raw)
        if (reg.email === next.email) {
          AsyncStorage.setItem(REGISTERED_KEY, JSON.stringify(next)).catch(console.error)
        }
      })

      return next
    })
  }

  async function logout() {
    try {
      await AsyncStorage.removeItem(AUTH_KEY)
      setUser(null)
    } catch (e) {
      console.error('Erro no logout:', e)
    }
  }

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    loading,
    login,
    logout,
    register,
    updateUser,
  }), [user, loading])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro do AuthProvider')
  return ctx
}
