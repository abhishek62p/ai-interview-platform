import './globals.css';
import { Space_Grotesk } from 'next/font/google';
import Provider from './provider';
import React from 'react';

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk'
});

export const metadata = {
  title: 'Take Interview',
  description: 'AI Interview Platform'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' className={`${grotesk.className} h-full w-full`} suppressHydrationWarning>
      <body className='bg-[#FFFFFF] min-h-screen w-full' suppressHydrationWarning>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
