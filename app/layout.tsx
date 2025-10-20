import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "パスキーデモ - 証券Webログイン",
  description: "Twilio Verify Passkeyを使用した次世代認証デモ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
