import './globals.css';
import { Inter } from 'next/font/google';
import { ClerkProvider, SignInButton, SignedIn, SignedOut } from '@clerk/nextjs';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Study Buddy',
  description: 'Your AI-powered study companion',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className={`${inter.className} min-h-screen bg-gradient-to-br from-background to-card text-foreground`}>
            <SignedOut>
              <SignInButton mode="modal" />
            </SignedOut>
            <SignedIn>
              {/* Removed UserButton to prevent duplicate avatars */}
            </SignedIn>
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
