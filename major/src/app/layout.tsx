"use client";
import { Provider } from "react-redux";
import Navbar from "@/components/Navbar";
import "./globals.css";
import { store } from "@/lib/redux/store";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en "
      className=" w-screen h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600"
    >
      <Provider store={store}>
        <body className=" min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-600 over">
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </body>
      </Provider>
    </html>
  );
}
