'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { HugeiconsIcon } from '@hugeicons/react'
import { ChevronDown, Login, Logout, UserAddIcon } from '@hugeicons/core-free-icons'
import { BrutalButton } from '@/components/ui/brutal-button'


type SessionUser = {
  id: string
  email: string
  name?: string | null
}

export function AuthUserControls() {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      try {
        const { data } = await authClient.getSession()

        if (!mounted) {
          return
        }

        setUser((data?.user as SessionUser | undefined) ?? null)
      } catch {
        // Auth service unavailable — treat as signed out
      } finally {
        if (mounted) {
          setIsReady(true)
        }
      }
    }

    loadSession()

    return () => {
      mounted = false
    }
  }, [])

  useEffect(() => {
    if (!isMenuOpen) {
      return
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isMenuOpen])

  const handleSignOut = async () => {
    setIsSigningOut(true)
    setUser(null)
    setIsSigningOut(false)
    setIsMenuOpen(false)
  }

  if (!isReady) {
    return (
      <>
        <div className="h-10 w-32 animate-pulse rounded border-3 border-black bg-gray-200"></div>
      </>
    )
  }

  if (!user) {
    return (
      <>
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <Link href="/auth/sign-in">
            <BrutalButton variant="outline" className="w-full sm:w-auto">
              <HugeiconsIcon icon={Login} className="mr-2 h-4 w-4" aria-hidden="true" />
              Sign In
            </BrutalButton>
          </Link>
          <Link href="/auth/sign-up">
            <BrutalButton variant="accent" className="w-full sm:w-auto">
              <HugeiconsIcon icon={UserAddIcon} className="mr-2 h-4 w-4" aria-hidden="true" />
              Sign Up
            </BrutalButton>
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="relative w-full sm:w-auto" ref={menuRef}>
        <BrutalButton
          variant="accent"
          onClick={() => setIsMenuOpen((current) => !current)}
          aria-haspopup="menu"
          aria-expanded={isMenuOpen}
          className="w-full justify-between sm:w-auto"
        >
          <span className="max-w-[180px] truncate">{user.name || user.email}</span>
          <HugeiconsIcon icon={ChevronDown} className="ml-2 h-4 w-4" aria-hidden="true" />
        </BrutalButton>

        {isMenuOpen ? (
          <div
            className="absolute right-0 z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] border-3 border-black bg-white p-3 shadow-brutal-xl"
            role="menu"
          >
            <div className="mb-3 border-3 border-black bg-accent p-3">
              <p className="text-xs font-bold uppercase tracking-wide">Signed In As</p>
              <p className="mt-1 truncate text-sm font-black">{user.email}</p>
            </div>

            <div className="flex flex-col gap-2">
              <BrutalButton
                variant="outline"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full justify-start"
                role="menuitem"
              >
                <HugeiconsIcon icon={Logout} className="mr-2 h-4 w-4" aria-hidden="true" />
                {isSigningOut ? 'Signing out…' : 'Sign Out'}
              </BrutalButton>
            </div>
          </div>
        ) : null}
      </div>
    </>
  )
}
