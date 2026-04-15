import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { PlayIcon, GithubIcon } from '@hugeicons/core-free-icons'
import { BrutalButton } from './ui/brutal-button'

export function Navigation() {
  return (
    <nav className="mb-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 md:flex md:w-auto md:flex-wrap md:gap-3">
          <Link href="/simulation">
            <BrutalButton variant="primary" className="w-full bg-white sm:w-auto border-r-8 border-b-8 border-black hover:border-r-3 hover:border-b-3">
              <HugeiconsIcon icon={PlayIcon} className="h-4 w-4 mr-2"   aria-hidden="true" />
              Start Simulation
            </BrutalButton>
          </Link>
          <Link href="https://github.com/XuanGiaHanNguyen/Parkcore-Frontend" target="_blank" rel="noopener noreferrer">
            <BrutalButton variant="primary" className="w-full bg-white sm:w-auto border-r-8 border-b-8 border-black hover:border-r-3 hover:border-b-3">
              <HugeiconsIcon icon={GithubIcon} className="h-4 w-4 mr-2"   aria-hidden="true" />
              View on GitHub
            </BrutalButton>
          </Link>
        </div>
      </div>
    </nav>
  )
}
