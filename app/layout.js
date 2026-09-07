import { Inter } from "next/font/google";
import "./globals.css";
import ReduxProvider from "./provider/ReduxProvider";
import AuthProvider from "./provider/AuthProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "POS Manager — Restaurant Owner Dashboard",
  description:
    "Complete restaurant point-of-sale and management system for owners",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased min-h-screen">
        <ReduxProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
