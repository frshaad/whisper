import { Button } from '@/components/ui/button'
import { useTheme } from '@/hooks/use-theme'

export function ThemeSwitcher() {
  const { theme, updateTheme } = useTheme()

  return (
    <div className="flex flex-col gap-2">
      <div>Current theme: {theme}</div>
      <Button onClick={() => updateTheme('default')}>Default</Button>
      <Button onClick={() => updateTheme('blue')}>Blue</Button>
      <Button onClick={() => updateTheme('green')}>Green</Button>
    </div>
  )
}
