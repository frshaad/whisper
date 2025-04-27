import ThemeProvider from '@/components/theme-provider'

export default function App({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {children}
    </ThemeProvider>
  )
}
