import { Podcast } from 'lucide-react'
import { Link } from 'react-router'

type LogoProps = {
  href?: string
}

export default function Logo({ href = '/' }: LogoProps) {
  return (
    <Link to={href ? href : '#'} className="flex items-center gap-3">
      <Podcast size={46} className="text-primary" />
      <span className="font-pacifico text-3xl">Whisper</span>
    </Link>
  )
}
