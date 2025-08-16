import type { Metadata } from "next";
import { AuthProvider } from '@/lib/auth';
import "./globals.css";

export const metadata: Metadata = {
  title: "BITFUSE",
  description: "Advanced cryptocurrency investment platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
