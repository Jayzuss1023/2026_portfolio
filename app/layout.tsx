import {
  ClerkProvider,
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Source_Sans_3 } from "next/font/google";
import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "@/components/disable-draft-mode";
import { Toaster } from "@/components/ui/sonner";
import { SanityLive } from "@/sanity/lib/live";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Jesus Flores — Software Developer",
    template: "%s | Jesus Flores",
  },
  description:
    "Full stack developer portfolio — TypeScript, React, Next.js, Python, and AI/LLM work.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const isDraftMode = (await draftMode()).isEnabled;

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${sourceSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <ClerkProvider>
          <div className="fixed top-3 right-4 z-50 flex items-center gap-2">
            <Show when="signed-out">
              <SignInButton>
                <button
                  type="button"
                  className="bg-card text-foreground border-border hover:bg-muted h-9 rounded-full border px-4 text-sm font-medium transition-colors"
                >
                  Sign in
                </button>
              </SignInButton>
              <SignUpButton>
                <button
                  type="button"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 h-9 rounded-full px-4 text-sm font-medium transition-colors"
                >
                  Sign up
                </button>
              </SignUpButton>
            </Show>
            <Show when="signed-in">
              <UserButton />
            </Show>
          </div>
          {children}
          <Toaster />
          <SanityLive />
          {isDraftMode && (
            <>
              <VisualEditing />
              <DisableDraftMode />
            </>
          )}
        </ClerkProvider>
      </body>
    </html>
  );
}
