import { Outlet } from 'react-router'

import Logo from '@/components/logo'

export default function AuthLayout() {
  return (
    <section className="from-primary/10 to-secondary flex min-h-screen flex-col items-center justify-center gap-y-14 bg-gradient-to-br p-4">
      <Logo href="" />
      <Outlet />
    </section>
  )
}
