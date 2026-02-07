"use client";

import React, { useEffect, useState } from 'react';

const Navbar = ({ isDarkMode, setIsDarkMode, haveIframe = false }) => {
    const [currentPath, setCurrentPath] = useState('/');

    useEffect(() => {
        if (typeof window !== 'undefined') setCurrentPath(window.location.pathname || '/');
    }, []);

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
        if (href === '/') return currentPath === '/';
        return currentPath.startsWith(href);
    };

    return (
        <header className="blog-header">
            <h1
                className="blog-title"
                style={{ cursor: 'pointer' }}
                onClick={() => {
                    window.location.href = './';
                }}
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
                                <a href={link.href} className={isActive(link.href) ? 'active' : ''}>{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
