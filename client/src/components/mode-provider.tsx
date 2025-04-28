import { useEffect, useState } from 'react'

import { type Mode, ModeProviderContext } from '@/contexts/mode-context'

type ModeProviderProps = {
  children: React.ReactNode
  defaultMode?: Mode
  storageKey?: string
}

export default function ModeProvider({
  children,
  defaultMode = 'system',
  storageKey = 'vite-ui-mode',
  ...props
}: ModeProviderProps) {
  const [mode, setMode] = useState<Mode>(
    () => (localStorage.getItem(storageKey) as Mode) || defaultMode,
  )

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (mode === 'system') {
      const systemMode = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemMode)
      return
    }

    root.classList.add(mode)
  }, [mode])

  const value = {
    mode,
    setMode: (mode: Mode) => {
      localStorage.setItem(storageKey, mode)
      setMode(mode)
    },
  }

  return (
    <ModeProviderContext.Provider {...props} value={value}>
      {children}
    </ModeProviderContext.Provider>
  )
}
