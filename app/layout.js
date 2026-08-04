import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata = {
  title: "POS Manager — Restaurant Owner Dashboard",
  description:
    "Complete restaurant point-of-sale and management system for owners",
};

import ReduxProvider from "./components/ReduxProvider";
import AuthProvider from "./components/AuthProvider";

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable} style={{ height: "100%" }}>
      <body style={{ height: "100%", margin: 0 }}>
        <ReduxProvider>
          <AuthProvider>{children}</AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
