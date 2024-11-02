import Image from 'next/image';
import { AppShell } from 'components/app-shell';
import { MainLayout } from '@/components/main-layout';

export default function HomePage() {
  return (
    <AppShell>
      <MainLayout className='flex items-center justify-center min-h-full'>
        <div className='max-w-5xl w-full space-y-8'>
          {/* Hero Image - reduced height */}
          <div className='relative w-full aspect-[21/9] rounded-2xl overflow-hidden shadow-2xl'>
            <Image
              src='/images/taschengeld-landing.jpg'
              alt='Family doing household tasks together'
              fill
              style={{ objectFit: 'cover' }}
              priority
              className='transition-transform duration-700 hover:scale-105'
            />
          </div>

          {/* Welcome Text - reduced vertical spacing */}
          <div className='text-center space-y-4'>
            <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent'>
              Welcome to Taschengeld
            </h1>
            <p className='text-xl text-gray-700 max-w-2xl mx-auto'>
              Your family&apos;s allowance and task management app
            </p>
          </div>

          {/* Feature Cards - more compact layout */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
            {[
              {
                title: 'Task Management',
                description: 'Create and manage household tasks easily',
                icon: '✓',
              },
              {
                title: 'Piggy Bank',
                description: 'Track allowances and savings',
                icon: '🐷',
              },
              {
                title: 'Family Friendly',
                description: 'Designed for parents and children',
                icon: '👨‍👩‍👧‍👦',
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className='bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'
              >
                <div className='text-3xl mb-2'>{feature.icon}</div>
                <h3 className='text-lg font-semibold mb-1 text-gray-800'>{feature.title}</h3>
                <p className='text-sm text-gray-600'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    </AppShell>
  );
}
