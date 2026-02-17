'use client';

import type { Metadata } from 'next';
import { useState, createContext } from 'react';
import './globals.css';
import SideNav from './_components/SideNav/SideNav';
import TopNav from './_components/TopNav/TopNav';
import CreditProvider from './_components/CreditContext/CreditProvider';

// export const metadata: Metadata = {
//   title: 'Tutortoise',
//   description:
//     'Tutortoise is a learning center management platform designed to help parents see the value of tutoring by tracking student performance and prevent revenue loss for learning centers through automatic credit-deduction for sessions and transaction observability.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body>
        <SideNav />
        <div className='shell__body'>
          <TopNav
            name='Samantha Villanueva'
            avatarIconSrc='/images/worm_with_glasses.png'
          />
          <CreditProvider>{children}</CreditProvider>
        </div>
      </body>
    </html>
  );
}
