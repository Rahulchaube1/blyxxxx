import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { bookEdition, docs, website } from "@/lib/site";
export const metadata: Metadata = {
    metadataBase: new URL(bookEdition ? docs : website),
    title: {
        default: bookEdition
            ? "Blyx documentation"
            : "Blyx programming language",
        template: "%s · Blyx",
    },
    description:
        "Write, run and build Blyx programs. Explore language guides and runnable numerical examples for Blyx 0.2.1.",
    icons: { icon: "/blyxlogo.png" },
};
export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body>
                <a className="skip" href="#content">
                    Skip to content
                </a>
                <Navbar />
                <div id="content" tabIndex={-1}>
                    {children}
                </div>
                <Footer />
            </body>
        </html>
    );
}
