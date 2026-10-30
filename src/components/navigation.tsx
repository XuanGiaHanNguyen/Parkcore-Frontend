import Link from 'next/link'
import Image from 'next/image'
import { HugeiconsIcon } from '@hugeicons/react'
import { GithubIcon, PlayIcon } from '@hugeicons/core-free-icons'
import appIcon from '@/app/icon.png'

export const GITHUB_URL = 'https://github.com/XuanGiaHanNguyen/Parkcore-Frontend'

export function Navigation() {
  return (
    <nav className="mb-8 flex items-center justify-between gap-4">
      <Link href="/" className="flex items-center gap-2.5">
        <Image src={appIcon} alt="" width={36} height={36} className="h-9 w-9" priority />
        <span className="text-lg font-bold tracking-tight text-slate-900">ParkCore</span>
      </Link>

      <div className="flex items-center gap-2">
        <Link
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-slate-900 sm:flex"
        >
          <HugeiconsIcon icon={GithubIcon} className="h-4 w-4" aria-hidden="true" />
          GitHub
        </Link>
        <Link
          href="/simulation"
          className="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700"
        >
          <HugeiconsIcon icon={PlayIcon} className="h-4 w-4" aria-hidden="true" />
          Open simulator
        </Link>
      </div>
    </nav>
  )
}
