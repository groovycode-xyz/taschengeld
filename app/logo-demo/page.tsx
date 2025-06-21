'use client';

import Image from 'next/image';

export default function LogoDemoPage() {
  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <h1 className='text-3xl font-bold mb-8 text-center'>Logo Options for Taschengeld</h1>

      <div className='max-w-6xl mx-auto space-y-12'>
        {/* Main Logos Comparison */}
        <section>
          <h2 className='text-2xl font-semibold mb-6'>Main Logo Options</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium mb-4'>Logo with Text (tgeld0)</h3>
              <div className='bg-gray-100 p-4 rounded flex justify-center'>
                <Image
                  src='/images/logo/logo.png'
                  alt='Logo with text'
                  width={250}
                  height={180}
                  className='object-contain'
                />
              </div>
              <p className='mt-4 text-sm text-gray-600'>
                Best for: Landing pages, marketing materials
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium mb-4'>Children with Money (tgeld5)</h3>
              <div className='bg-gray-100 p-4 rounded flex justify-center'>
                <Image
                  src='/images/logo/logo-children.png'
                  alt='Children with money'
                  width={250}
                  height={180}
                  className='object-contain'
                />
              </div>
              <p className='mt-4 text-sm text-gray-600'>
                Best for: Storytelling, onboarding, empty states
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium mb-4'>✨ Pocket Money (tgeld6)</h3>
              <div className='bg-gray-100 p-4 rounded flex justify-center'>
                <Image
                  src='/images/logo/logo-pocket.png'
                  alt='Pocket money'
                  width={250}
                  height={180}
                  className='object-contain'
                />
              </div>
              <p className='mt-4 text-sm text-gray-600'>
                <strong>RECOMMENDED:</strong> Perfect balance of simplicity and meaning
              </p>
            </div>
          </div>
        </section>

        {/* Icon Variations */}
        <section>
          <h2 className='text-2xl font-semibold mb-6'>Icon Variations (No Text)</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-md font-medium mb-4'>Single Child (tgeld1)</h3>
              <div className='bg-gray-100 p-4 rounded flex justify-center'>
                <Image
                  src='/images/logo/logo-icon.png'
                  alt='Single child icon'
                  width={120}
                  height={120}
                  className='object-contain'
                />
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-md font-medium mb-4'>Pocket Only (tgeld2)</h3>
              <div className='bg-gray-100 p-4 rounded flex justify-center'>
                <Image
                  src='/images/logo/logo-simple.png'
                  alt='Pocket only icon'
                  width={120}
                  height={120}
                  className='object-contain'
                />
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-md font-medium mb-4'>Two Children (tgeld4)</h3>
              <div className='bg-gray-100 p-4 rounded flex justify-center'>
                <Image
                  src='/images/logo/logo-family.png'
                  alt='Two children icon'
                  width={120}
                  height={120}
                  className='object-contain'
                />
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-md font-medium mb-4'>✨ Pocket (tgeld6)</h3>
              <div className='bg-gray-100 p-4 rounded flex justify-center'>
                <Image
                  src='/images/logo/logo-pocket.png'
                  alt='Pocket icon'
                  width={120}
                  height={120}
                  className='object-contain'
                />
              </div>
            </div>
          </div>
        </section>

        {/* Favicon Preview */}
        <section>
          <h2 className='text-2xl font-semibold mb-6'>Favicon Preview</h2>
          <div className='bg-white p-6 rounded-lg shadow-md'>
            <div className='flex items-center space-x-8'>
              <div>
                <h3 className='text-lg font-medium mb-4'>Alternative (Single Child)</h3>
                <div className='flex space-x-4'>
                  <div className='text-center'>
                    <div className='bg-gray-100 p-2 rounded'>
                      <Image
                        src='/images/icons/icon-16x16.png'
                        alt='16x16'
                        width={16}
                        height={16}
                      />
                    </div>
                    <p className='text-xs mt-1'>16x16</p>
                  </div>
                  <div className='text-center'>
                    <div className='bg-gray-100 p-2 rounded'>
                      <Image
                        src='/images/icons/icon-32x32.png'
                        alt='32x32'
                        width={32}
                        height={32}
                      />
                    </div>
                    <p className='text-xs mt-1'>32x32</p>
                  </div>
                  <div className='text-center'>
                    <div className='bg-gray-100 p-2 rounded'>
                      <Image
                        src='/images/icons/icon-48x48.png'
                        alt='48x48'
                        width={48}
                        height={48}
                      />
                    </div>
                    <p className='text-xs mt-1'>48x48</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className='text-lg font-medium mb-4'>✨ Current (Pocket Money)</h3>
                <div className='flex space-x-4'>
                  <div className='text-center'>
                    <div className='bg-gray-100 p-2 rounded'>
                      <Image
                        src='/images/icons/icon-pocket-16x16.png'
                        alt='16x16'
                        width={16}
                        height={16}
                      />
                    </div>
                    <p className='text-xs mt-1'>16x16</p>
                  </div>
                  <div className='text-center'>
                    <div className='bg-gray-100 p-2 rounded'>
                      <Image
                        src='/images/icons/icon-pocket-32x32.png'
                        alt='32x32'
                        width={32}
                        height={32}
                      />
                    </div>
                    <p className='text-xs mt-1'>32x32</p>
                  </div>
                  <div className='text-center'>
                    <div className='bg-gray-100 p-2 rounded'>
                      <Image
                        src='/images/icons/icon-pocket-48x48.png'
                        alt='48x48'
                        width={48}
                        height={48}
                      />
                    </div>
                    <p className='text-xs mt-1'>48x48</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Context */}
        <section>
          <h2 className='text-2xl font-semibold mb-6'>Usage in Context</h2>
          <div className='space-y-6'>
            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium mb-4'>Header Example with Pocket Logo</h3>
              <div className='bg-gray-900 text-white p-4 rounded flex items-center justify-between'>
                <div className='flex items-center space-x-3'>
                  <Image
                    src='/images/logo/logo-pocket.png'
                    alt='Taschengeld'
                    width={40}
                    height={40}
                    className='object-contain'
                  />
                  <span className='text-xl font-semibold'>Taschengeld</span>
                </div>
                <nav className='flex space-x-4 text-sm'>
                  <a href='#' className='hover:text-gray-300'>
                    Family
                  </a>
                  <a href='#' className='hover:text-gray-300'>
                    Tasks
                  </a>
                  <a href='#' className='hover:text-gray-300'>
                    Piggy Bank
                  </a>
                </nav>
              </div>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-md'>
              <h3 className='text-lg font-medium mb-4'>Mobile App Icon Preview</h3>
              <div className='flex space-x-8'>
                <div className='text-center'>
                  <div
                    className='bg-gray-100 p-4 rounded-2xl shadow-lg'
                    style={{ width: '120px', height: '120px' }}
                  >
                    <Image
                      src='/images/icons/icon-192x192.png'
                      alt='Single child app icon'
                      width={120}
                      height={120}
                      className='rounded-2xl'
                    />
                  </div>
                  <p className='text-sm mt-2'>Single Child</p>
                </div>
                <div className='text-center'>
                  <div
                    className='bg-gray-100 p-4 rounded-2xl shadow-lg'
                    style={{ width: '120px', height: '120px' }}
                  >
                    <Image
                      src='/images/icons/icon-pocket-192x192.png'
                      alt='Pocket app icon'
                      width={120}
                      height={120}
                      className='rounded-2xl'
                    />
                  </div>
                  <p className='text-sm mt-2'>✨ Pocket Version</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Recommendation */}
        <section className='bg-blue-50 p-6 rounded-lg'>
          <h2 className='text-2xl font-semibold mb-4'>Recommendation</h2>
          <p className='text-gray-700 mb-4'>
            The pocket money logo (tgeld6) is the perfect choice for Taschengeld because:
          </p>
          <ul className='list-disc list-inside space-y-2 text-gray-700'>
            <li>It literally represents "pocket money" - perfectly aligned with the app name</li>
            <li>Simple, iconic design that works well at all sizes</li>
            <li>More unique and memorable than generic piggy bank icons</li>
            <li>Maintains playful aesthetic while being universally understood</li>
            <li>The decorative stars add visual interest without cluttering the design</li>
          </ul>
          <div className='mt-6 p-4 bg-white rounded-lg'>
            <p className='font-medium'>Suggested Implementation:</p>
            <ul className='list-disc list-inside mt-2 space-y-1 text-sm'>
              <li>Use tgeld6 (pocket) as the primary icon throughout the app ✓</li>
              <li>Keep tgeld0 (with text) for marketing materials and landing pages</li>
              <li>Use tgeld5 (children with money) for storytelling contexts and empty states</li>
              <li>Reserve tgeld1-4 as alternative options if needed</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
