import Image from 'next/image'
import { AppShell } from '@/components/app-shell'

export default function HomePage() {
  return (
    <AppShell>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative w-full max-w-3xl aspect-video mb-8">
          <Image
            src="/images/taschengeld-landing.jpg"
            alt="Taschengeld Logo"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>
        <h1 className="text-4xl font-bold mt-4">Welcome to Taschengeld</h1>
        <p className="text-xl mt-4">Your family&apos;s allowance and task management app</p>
      </div>
    </AppShell>
  )
}