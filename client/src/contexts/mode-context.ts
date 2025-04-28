import { createContext, useContext } from 'react'

export type Mode = 'dark' | 'light' | 'system'

type ModeProviderState = {
  mode: Mode
  setMode: (mode: Mode) => void
}

const initialState: ModeProviderState = {
  mode: 'system',
  setMode: () => null,
}

export const ModeProviderContext =
  createContext<ModeProviderState>(initialState)

export function useMode() {
  const context = useContext(ModeProviderContext)

  if (context === undefined)
    throw new Error('useMode must be used within a ModeProvider')

  return context
}
