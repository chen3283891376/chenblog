import React from 'react';

const Navbar = ({ isDarkMode, setIsDarkMode, haveIframe = false }) => {
    const toggleTheme = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            document.documentElement.classList.toggle('dark', newMode);
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            return newMode;
        });
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
            <button className="theme-toggle-btn" onClick={toggleTheme}>
                {isDarkMode ? (
                    <i className="fa-solid fa-sun"></i>
                ) : (
                    <i className="fa-solid fa-moon"></i>
                )}
            </button>
            <nav className="blog-nav">
                <ul className="blog-nav-links">
                    <li className="blog-nav-links-item">
                        <a href="/">主页</a>
                    </li>
                    <li className="blog-nav-links-item">
                        <a href="/about">关于</a>
                    </li>
                    <li className="blog-nav-links-item">
                        <a href="/friends">友链</a>
                    </li>
                    <li className="blog-nav-links-item">
                        <a href="/message">闲言碎语</a>
                    </li>
                    <li className="blog-nav-links-item">
                        <a href="/comments">留言板</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Navbar;
