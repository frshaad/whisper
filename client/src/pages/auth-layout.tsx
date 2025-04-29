import { Outlet } from 'react-router'

export default function AuthLayout() {
  return (
    <section className="from-primary/10 to-secondary flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <Outlet />
    </section>
  )
}
