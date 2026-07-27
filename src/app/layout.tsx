import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

export const metadata: Metadata = {
  title: 'FAT Digital Repair POS',
  description: 'Enterprise Repair Shop Management SaaS',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        {main }
      </body>
    </html>
  );
}
