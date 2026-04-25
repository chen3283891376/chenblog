"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const Navbar = ({ isDarkMode, setIsDarkMode, haveIframe = false }) => {
    const pathname = usePathname() || '/';
    const router = useRouter();

    const toggleTheme = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            document.documentElement.classList.toggle('dark', newMode);
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

    const links = [
        { href: '/', label: '首页' },
        { href: '/about', label: '关于' },
        { href: '/friends', label: '友链' },
        { href: '/message', label: '闲言碎语' },
        { href: '/comments', label: '留言板' },
    ];

    const isActive = (href) => {
        if (href === '/') return pathname === '/';
        return pathname.startsWith(href);
    };

    return (
        <header className="blog-header">
            <h1
                className="blog-title"
                style={{ cursor: 'pointer' }}
                onClick={() => router.push('/')}
            >
                Chen Blog
            </h1>

            <button className="theme-toggle-btn" onClick={toggleTheme} aria-label="切换主题">
                {isDarkMode ? <i className="fa-solid fa-sun"></i> : <i className="fa-solid fa-moon"></i>}
            </button>

            <nav className="blog-nav">
                <div className="blog-nav-pill">
                    <ul className="blog-nav-links">
                        {links.map(link => (
                            <li key={link.href} className="blog-nav-links-item">
                                <Link href={link.href} className={isActive(link.href) ? 'active' : ''}>{link.label}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
