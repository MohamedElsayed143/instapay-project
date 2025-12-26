import type { Metadata } from "next";
import "./globals.css";
import { VisualEditsMessenger } from "orchids-visual-edits";
import { LanguageProvider } from "@/hooks/use-language";

export const metadata: Metadata = {
  title: "InstaPay - Send money to anyone, anywhere, at any time!",
  description:
    "InstaPay is an app that allows direct access to all your bank accounts and transfer instantly using your mobile device 24/7.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <VisualEditsMessenger />
      </body>
    </html>
  );
}
