import type { Metadata } from "next";
import { DM_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  title: "Scarlet Paws — Cat Rescue | Rutgers New Brunswick",
  description:
    "Report cats in need of rescue. Shelters see locations and coordinate rescues. Supporting TNR and community cats in New Brunswick, NJ.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${fraunces.variable}`}>
      <body className="font-body min-h-screen">
        <AuthProvider>
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
