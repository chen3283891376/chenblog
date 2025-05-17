// import React from 'react';

const Navbar = ({ isDarkMode, toggleTheme }) => {
    return (
        <header>
            <h1
                style={{
                    marginLeft: 'calc(10% + 10px)',
                    marginBlockStart: '10px'
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
                <ul>
                    <li className={'blog-nav-links-item'}>
                        <a href={`./index.html?page=1`}>主页</a>
                    </li>
                    <li className={'blog-nav-links-item'}>
                        <a href={'./about.html'}>关于</a>
                    </li>
                    <li className={'blog-nav-links-item'}>
                        <a href={'./friends.html'}>友链</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

(function () {
    window.NavBar = Navbar;
})();
