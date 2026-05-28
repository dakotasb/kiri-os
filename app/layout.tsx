import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { ChatPanel } from '@/components/chat/ChatPanel';
import { ChatTrigger } from '@/components/chat/ChatTrigger';
import { ChatProvider } from '@/lib/chat-context';
import { UpdateBanner } from '@/components/shell/UpdateBanner';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Kiri OS',
  description: 'Your intelligent agent fleet',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      {/* Blocking script — runs before paint to avoid dark→light flash */}
      <head>
        <script dangerouslySetInnerHTML={{ __html:
          `(function(){try{var t=localStorage.getItem('kiri-theme');` +
          `if(t==='light')document.documentElement.setAttribute('data-theme','light');}catch(e){}})();`
        }} />
      </head>
      <body className="font-sans antialiased">
        <ChatProvider>
          <div className="flex h-screen bg-bg overflow-hidden">
            <Sidebar />
            <main className="flex-1 min-w-0 overflow-hidden flex flex-col">
              <UpdateBanner />
              <div className="flex-1 min-h-0 overflow-hidden">
                {children}
              </div>
            </main>
            <ChatPanel />
          </div>
          <ChatTrigger />
        </ChatProvider>
      </body>
    </html>
  );
}
