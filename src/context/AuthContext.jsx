import { createContext, useContext, useState, useEffect } from 'react'
import { api, setToken } from '../utils/api.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('medicare_token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .me()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const data = await api.login({ email, password })
    setToken(data.token)
    setUser(data)
    return data
  }

  const staffLogin = async ({ email, password, role, accessCode }) => {
    const data = await api.staffLogin({ email, password, role, accessCode })
    setToken(data.token)
    setUser(data)
    return data
  }

  const staffRegister = async (payload) => {
    const data = await api.staffRegister(payload)
    setToken(data.token)
    setUser(data)
    return data
  }

  const register = async ({ name, email, mobile, password }) => {
    const data = await api.register({ name, email, mobile, password })
    setToken(data.token)
    setUser(data)
    return data
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, staffLogin, staffRegister, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
