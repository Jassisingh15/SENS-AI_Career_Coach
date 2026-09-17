import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import Header from "@/components/header";
import { ThemeProvider } from "@/components/theme-provider";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SENSAI — AI Career Coach",
  description: "AI-powered career coaching, intelligent resume builder, industry insights, and interview prep.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark,
        variables: {
          colorPrimary: "#7C3AED",
          colorBackground: "#0D111A",
          colorText: "#F8FAFC",
          colorInputBackground: "#080C14",
          colorInputText: "#F8FAFC",
        },
        elements: {
          card: "bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl",
          navbar: "bg-slate-900/80 border-b border-white/10",
          headerTitle: "text-white font-bold",
          headerSubtitle: "text-slate-400",
        },
      }}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/logo.png" sizes="any" />
        </head>
        <body className={`${inter.className} min-h-screen bg-deepSpace text-slate-100 antialiased selection:bg-indigo-500/30 selection:text-indigo-200`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            forcedTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="grid-background" />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors theme="dark" />

            {/* FOOTER */}
            <footer className="border-t border-white/10 bg-slate-950/60 backdrop-blur-xl py-8">
              <div className="container mx-auto px-4 text-center text-sm text-slate-400">
                <p>
                  © {new Date().getFullYear()} SENSAI AI Career Coach — Made with 💗 by Jasvinder Singh
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
