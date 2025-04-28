import { useEffect, useState } from 'react'

const THEME_STORAGE_KEY = 'color-theme'

type Theme =
  | 'default'
  | 'red'
  | 'rose'
  | 'orange'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'violet'

export function useTheme() {
  const [theme, setTheme] = useState<Theme>('default')

  // Change theme on DOM + save to localStorage
  const updateTheme = (newTheme: Theme) => {
    setTheme(newTheme)

    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', newTheme)
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem(THEME_STORAGE_KEY, newTheme)
    }
  }

  // Load saved theme on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)

      if (savedTheme) {
        setTheme(savedTheme as Theme)
      } else {
        setTheme('default')
      }
    }
  }, [])

  return { theme, updateTheme }
}
