import Image from 'next/image';
import { AppShell } from 'components/app-shell';
import { MainLayout } from '@/components/main-layout';

export default function HomePage() {
  return (
    <AppShell>
      <MainLayout className='flex items-center justify-center min-h-full bg-background'>
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
            <h1 className='text-3xl font-bold text-foreground'>Welcome to Taschengeld</h1>
            <p className='text-lg text-muted-foreground max-w-2xl mx-auto'>
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
                className='bg-card p-4 rounded-xl shadow-lg border border-border'
              >
                <div className='text-4xl mb-3'>{feature.icon}</div>
                <h3 className='text-lg font-semibold text-foreground mb-2'>{feature.title}</h3>
                <p className='text-muted-foreground'>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </MainLayout>
    </AppShell>
  );
}
