import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "MORA Tube - Watch. Learn. Grow.",
  description: "Money Era awareness platform. Learn about finance, AI tools, habits, and technology.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className="dark">
        <body className="antialiased min-h-screen flex flex-col bg-[#0A0A0A] text-white selection:bg-[#E53935] selection:text-white">
          <Navbar />
          
          <div className="flex flex-1 pt-16">
            <Sidebar />
            
            <main className="flex-1 md:pl-64 min-w-0">
              {children}
            </main>
          </div>
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#0a0a0a",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.1)",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}