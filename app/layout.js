import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata = {
  title: 'POS Manager — Restaurant Owner Dashboard',
  description: 'Complete restaurant point-of-sale and management system for owners',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} style={{ height: '100%' }}>
      <body style={{ height: '100%', margin: 0 }}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
