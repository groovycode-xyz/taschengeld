import Image from 'next/image';
import { AppShell } from 'components/app-shell';
import { MainLayout } from '@/components/main-layout';

export default function HomePage() {
  return (
    <AppShell>
      <MainLayout className='flex items-center justify-center min-h-full bg-black'>
        <div className='max-w-4xl w-full space-y-6'>
          {/* Hero Image - reduced height */}
          <div className='relative w-full aspect-[21/8] rounded-2xl overflow-hidden shadow-2xl'>
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
          <div className='text-center space-y-3'>
            <h1 className='text-3xl font-bold text-white'>Welcome to Taschengeld</h1>
            <p className='text-lg text-gray-300 max-w-2xl mx-auto'>
              Your family&apos;s allowance and task management app
            </p>
          </div>

          {/* Feature Cards - more compact layout */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
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
                className='bg-gray-800/80 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-gray-800/90 border border-gray-700'
              >
                <div className='text-2xl mb-2'>{feature.icon}</div>
                <h3 className='text-base font-semibold mb-1 text-gray-100'>{feature.title}</h3>
                <p className='text-sm text-gray-400'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    </AppShell>
  );
}
