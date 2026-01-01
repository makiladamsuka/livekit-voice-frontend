import type { Metadata } from "next";
import "./globals.css";
import "@livekit/components-styles";

export const metadata: Metadata = {
  title: "LiveKit Voice Agent",
  description: "Modern dark-mode frontend for LiveKit Voice Agent",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}
