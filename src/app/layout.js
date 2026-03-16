import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from '@/components/providers/AuthProvider';
import { AlertProvider } from '@/components/providers/AlertProvider';
import { AccountProvider } from '@/contexts/AccountContext';
import ToastWrapper from '@/components/providers/ToastWrapper';
import Navbar from '@/components/layout/Navbar';
import AlertBadge from '@/components/alerts/AlertBadge';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Budget Buddy - Personal Finance Manager",
  description: "Smart personal finance tracking with multi-account support, budget management, and real-time expense monitoring. Built with Next.js 14 and MongoDB.",
  keywords: ["budget tracker", "personal finance", "expense tracker", "budget app", "finance management"],
  authors: [{ name: "Martin Emil Brabenec" }],
  creator: "Martin Emil Brabenec",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AlertProvider>
            <AccountProvider>
              <ToastWrapper>
                <div className="min-h-screen bg-gray-50">
                  <Navbar />
                  <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                  </main>
                  <AlertBadge />
                </div>
              </ToastWrapper>
            </AccountProvider>
          </AlertProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
