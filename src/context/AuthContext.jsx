// src/context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AUTH_KEY      = '@acolhe:auth_user'
const ACCOUNTS_KEY  = '@acolhe:accounts'       // lista de todas as contas cadastradas

const AuthContext = createContext(null)

// Perfil limpo — sem sessões mockadas
function buildCleanProfile(profile) {
  return {
    address:      '',
    phone:        '',
    sessions:     [],          // sempre começa zerado
    appointments: [],          // para profissionais
    ...profile,
  }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  // Carrega usuário salvo ao iniciar
  useEffect(() => {
    async function loadUser() {
      try {
        const stored = await AsyncStorage.getItem(AUTH_KEY)
        if (stored) setUser(JSON.parse(stored))
      } catch (e) {
        console.error('Erro ao carregar usuário:', e)
      } finally {
        setLoading(false)
      }
    }
    loadUser()
  }, [])

  // ─── Login ─────────────────────────────────────────────────────────────────
  async function login({ email, password }) {
    try {
      const raw      = await AsyncStorage.getItem(ACCOUNTS_KEY)
      const accounts = raw ? JSON.parse(raw) : []
      const found    = accounts.find(a => a.email === email)

      if (!found) throw new Error('Usuário não encontrado.')

      // Em mock não validamos senha de verdade — só confirma que existe
      await AsyncStorage.setItem(AUTH_KEY, JSON.stringify(found))
      setUser(found)
      return found
    } catch (e) {
      console.error('Erro no login:', e)
      throw e
    }
  }

  // ─── Cadastro ──────────────────────────────────────────────────────────────
  async function register(profile) {
    try {
      const raw      = await AsyncStorage.getItem(ACCOUNTS_KEY)
      const accounts = raw ? JSON.parse(raw) : []

      const exists = accounts.find(a => a.email === profile.email)
      if (exists) throw new Error('E-mail já cadastrado.')

      const newUser = buildCleanProfile(profile)
      accounts.push(newUser)

      await AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
      return newUser
    } catch (e) {
      console.error('Erro no cadastro:', e)
      throw e
    }
  }

  // ─── Atualizar dados do usuário logado ─────────────────────────────────────
  async function updateUser(patch) {
    setUser(current => {
      if (!current) return current
      const next = { ...current, ...patch }

      // Persiste sessão ativa
      AsyncStorage.setItem(AUTH_KEY, JSON.stringify(next)).catch(console.error)

      // Atualiza também na lista de contas
      AsyncStorage.getItem(ACCOUNTS_KEY).then(raw => {
        if (!raw) return
        const accounts = JSON.parse(raw)
        const idx = accounts.findIndex(a => a.email === next.email)
        if (idx >= 0) {
          accounts[idx] = next
          AsyncStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts)).catch(console.error)
        }
      })

      return next
    })
  }

  // ─── Logout ────────────────────────────────────────────────────────────────
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
