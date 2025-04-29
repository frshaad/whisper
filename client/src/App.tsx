import { Route, Routes } from 'react-router'

import ModeProvider from '@/components/mode-provider'
import { Toaster } from '@/components/ui/sonner'
import AuthLayout from '@/pages/auth-layout'
import Home from '@/pages/home'
import Login from '@/pages/login'
import Profile from '@/pages/profile'
import Settings from '@/pages/settings'
import SignUp from '@/pages/signup'

export default function App() {
  return (
    <ModeProvider defaultMode="system" storageKey="vite-ui-mode">
      <main>
        <Routes>
          <Route index element={<Home />} />
          <Route path="settings" element={<Settings />} />
          <Route path="profile" element={<Profile />} />

          <Route element={<AuthLayout />}>
            <Route path="login" element={<Login />} />
            <Route path="signup" element={<SignUp />} />
          </Route>
        </Routes>
      </main>
      <Toaster />
    </ModeProvider>
  )
}
