import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/providers/AuthProvider";
import { CallStatusProvider } from "@/providers/CallStatusProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StreamVideoProvider from "@/providers/StreamClientProvider";
import "@stream-io/video-react-sdk/dist/css/styles.css";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "QuickCall",
  description: "Connecting People Quickly",
  keywords: ["QuickCall", "Video Call", "Call", "Video", "Chat"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <CallStatusProvider>
          <AuthProvider>
            <StreamVideoProvider>
              {children}
              <ToastContainer
                className="mt-12"
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                stacked
                theme="colored"
              />
            </StreamVideoProvider>
          </AuthProvider>
        </CallStatusProvider>
      </body>
    </html>
  );
}
