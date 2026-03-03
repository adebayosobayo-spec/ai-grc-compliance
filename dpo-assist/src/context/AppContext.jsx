import React, { createContext, useContext, useState } from 'react'

const AppContext = createContext(null)

export function AppProvider({ children }) {
    const [orgProfile, setOrgProfile] = useState(() => {
        try {
            const saved = localStorage.getItem('dpo_org_profile')
            return saved ? JSON.parse(saved) : null
        } catch { return null }
    })

    function saveProfile(profile) {
        setOrgProfile(profile)
        localStorage.setItem('dpo_org_profile', JSON.stringify(profile))
    }

    function clearProfile() {
        setOrgProfile(null)
        localStorage.removeItem('dpo_org_profile')
    }

    return (
        <AppContext.Provider value={{ orgProfile, saveProfile, clearProfile }}>
            {children}
        </AppContext.Provider>
    )
}

export function useAppContext() {
    return useContext(AppContext)
}
