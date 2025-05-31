// import React from 'react';

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
                    window.location.href = './index.html';
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
                        <a href="./index.html">主页</a>
                    </li>
                    <li className="blog-nav-links-item">
                        <a href="./about.html">关于</a>
                    </li>
                    <li className="blog-nav-links-item">
                        <a href="./friends.html">友链</a>
                    </li>
                    <li className="blog-nav-links-item">
                        <a href="./message.html">闲言碎语</a>
                    </li>
                    <li className="blog-nav-links-item">
                        <a href="./comments.html">留言板</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

(function () {
    window.NavBar = Navbar;
})();
