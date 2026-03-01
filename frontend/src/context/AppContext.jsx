import React, { createContext, useContext, useState, useEffect } from 'react'

const AppContext = createContext(null)

const SESSION_KEY = 'grc_session_id'
const PROFILE_KEY = 'grc_org_profile'
const GAP_RESULT_KEY = 'grc_last_gap_result'

export function AppProvider({ children }) {
  const [orgProfile, setOrgProfileState] = useState(() => {
    try {
      const saved = localStorage.getItem(PROFILE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [sessionId, setSessionIdState] = useState(() => {
    return localStorage.getItem(SESSION_KEY) || null
  })

  const [lastGapResult, setLastGapResultState] = useState(() => {
    try {
      const saved = localStorage.getItem(GAP_RESULT_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const setOrgProfile = (profile) => {
    setOrgProfileState(profile)
    if (profile) {
      localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
      localStorage.setItem(SESSION_KEY, profile.session_id)
      setSessionIdState(profile.session_id)
    } else {
      localStorage.removeItem(PROFILE_KEY)
      localStorage.removeItem(SESSION_KEY)
      setSessionIdState(null)
    }
  }

  const setLastGapResult = (result) => {
    setLastGapResultState(result)
    if (result) {
      localStorage.setItem(GAP_RESULT_KEY, JSON.stringify(result))
    } else {
      localStorage.removeItem(GAP_RESULT_KEY)
    }
  }

  const clearProfile = () => setOrgProfile(null)

  return (
    <AppContext.Provider value={{ orgProfile, setOrgProfile, sessionId, clearProfile, lastGapResult, setLastGapResult }}>
      {children}
    </AppContext.Provider>
  )
}

export function useAppContext() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useAppContext must be used within AppProvider')
  return ctx
}
