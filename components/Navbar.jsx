// import React from 'react';

const Navbar = ({ isDarkMode, setIsDarkMode }) => {
    const toggleTheme = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            document.documentElement.classList.toggle('dark-mode', newMode);
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };
    return (
        <header>
            <div className="loader"></div>
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
                    <li className={'blog-nav-links-item'}>
                        <a href={'./message.html'}>闲言碎语</a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

(function () {
    window.NavBar = Navbar;
})();
