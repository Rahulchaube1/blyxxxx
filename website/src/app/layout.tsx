import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { bookEdition, docs, website } from "@/lib/site";
export const metadata: Metadata = {
    metadataBase: new URL(bookEdition ? docs : website),
    title: bookEdition ? "Blyx Documentation" : "The Blyx Programming Language",
    icons: { icon: { url: "/favicon-192.png", sizes: "192x192", type: "image/png" } },
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
