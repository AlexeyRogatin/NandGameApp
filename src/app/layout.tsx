import "./globals.css";
import Link from "next/link";

export default function RootLayout(
    {children}: {children: React.ReactNode;}
  ) {
  return (
    <html lang="en">
      <head>
        <title>Compute the world</title>
      </head>
      <body className="flex flex-col justify-between">
        <div className="flex-1 flex flex-col m-2">
          {children}
        </div>
        <div className="flex-0 w-full flex gap-10">
          <p>Made by Alexey Rogatin | </p>
          <Link href="/about">About</Link>
          <p> | </p>
          <a href="https://github.com/AlexeyRogatin/NandGameApp">Github</a>
        </div>
      </body>
    </html>
  );
}
