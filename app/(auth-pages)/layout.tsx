import "../globals.css";
import { Space_Grotesk } from "next/font/google";

const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
});

export const metadata = {
  title: "Take Interview",
  description: "AI Interview Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${grotesk.className} h-full w-full`}
      suppressHydrationWarning
    >
      {/* Browser extensions sometimes inject attributes (e.g. cz-shortcut-listen) before hydration; suppress to avoid false mismatch */}
      <body className="bg-[#FFFFFF] h-full w-full" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
