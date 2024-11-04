import Image from 'next/image';
import { AppShell } from 'components/app-shell';
import { MainLayout } from '@/components/main-layout';

export default function HomePage() {
  return (
    <AppShell>
      <MainLayout className='flex items-center justify-center min-h-full bg-background-primary'>
        <div className='max-w-4xl w-full space-y-6'>
          {/* Hero Image */}
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

          {/* Welcome Text */}
          <div className='text-center space-y-3'>
            <h1 className='text-3xl font-bold text-content-primary'>Welcome to Taschengeld</h1>
            <p className='text-lg text-content-secondary max-w-2xl mx-auto'>
              Your family&apos;s allowance and task management app
            </p>
          </div>

          {/* Feature Cards */}
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
                className='bg-background-secondary/80 backdrop-blur-sm p-4 rounded-xl shadow-lg 
                         hover:shadow-xl transition-all duration-300 hover:bg-background-secondary/90 
                         border border-border-primary'
              >
                <div className='text-2xl mb-2'>{feature.icon}</div>
                <h3 className='text-base font-semibold mb-1 text-content-primary'>
                  {feature.title}
                </h3>
                <p className='text-sm text-content-secondary'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    </AppShell>
  );
}
