/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { AuthProvider } from "@/components/auth-provider";
import { WorkspaceProvider } from "@/components/workspace-provider";
import { QueryProvider } from "@/components/query-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TaskFlow | Project Management",
  description: "A focused workspace for projects, tasks, teams, and sprints.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full">
        <QueryProvider>
          <AuthProvider>
            <WorkspaceProvider>
              {children}
            </WorkspaceProvider>
          </AuthProvider>
        </QueryProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
