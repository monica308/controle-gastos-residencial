'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const pathname = usePathname()

  // Função para aplicar o estilo apenas se o link for a rota atual
  const getLinkStyle = (path: string) => {
    const isActive = pathname === path
    return isActive 
      ? "text-blue-700 font-extrabold border-b-2 border-blue-700 transition pb-1" 
      : "text-blue-600 font-bold hover:text-blue-800 transition"
  }

  return (
    <nav className="flex gap-6 mb-8 justify-center">
      <Link href="/" className={getLinkStyle('/')}>
        Membros
      </Link>
      <Link href="/categorias" className={getLinkStyle('/categorias')}>
        Categorias
      </Link>
      <Link href="/transacoes" className={getLinkStyle('/transacoes')}>
        Transações
      </Link>
      <Link href="/relatorios" className={getLinkStyle('/relatorios')}>
        Relatórios
      </Link>
    </nav>
  )
}