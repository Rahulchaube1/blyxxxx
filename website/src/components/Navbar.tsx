"use client";
import { useHydrated } from "@/lib/useHydrated";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { bookEdition, mainLink, guideLink } from "@/lib/site";
export default function Navbar() {
    const ready = useHydrated();
    const [open, setOpen] = useState(false);
    const path = usePathname();
    const links = [
        ["Documentation", guideLink()],
        ["Examples", mainLink("/examples")],
        ["Playground", mainLink("/play")],
        ["Download", mainLink("/download")],
    ];
    return (
        <header className="mast">
            <div className="mast-inner">
                <a className="brand" href={mainLink("/")}>
                    <img src="/blyxlogo.png" alt="" width="38" height="38" />
                    Blyx
                </a>
                {bookEdition && (
                    <a className="book-mark" href="/">
                        Documentation
                    </a>
                )}
                <button
                    className="menu-toggle"
                    aria-expanded={open}
                    disabled={!ready}
                    aria-controls="primary-nav"
                    onClick={() => setOpen(!open)}
                >
                    Menu
                </button>
                <nav
                    aria-label="Main"
                    id="primary-nav"
                    className={open ? "nav open" : "nav"}
                >
                    {links.map(([label, href]) => (
                        <a
                            key={label}
                            href={href}
                            aria-current={path === href ? "page" : undefined}
                        >
                            {label}
                        </a>
                    ))}
                </nav>
            </div>
        </header>
    );
}
