import { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: 'Compute the world',
  description: 'This is an educational site, where you will get the knowledge of how computer works from basic physical elements.',
}

export default function RootLayout({
    children,   
  }: {
    children: React.ReactNode,
  }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full flex flex-col justify-between">
        <div className="flex-1 flex flex-col m-2">
          {children}
        </div>

        <div className="flex-0 w-full flex gap-2">
          <p>Made by Alexey Rogatin</p>
          <p> | </p>
          <Link href="/about">About</Link>
          <p> | </p>
          <a href="https://github.com/AlexeyRogatin/NandGameApp">Github</a>
        </div>
      </body>
    </html>
  );
}
