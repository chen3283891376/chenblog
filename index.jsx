// import React, { React.useState, React.useEffect } from 'react';
// import ReactDOM from 'react-dom/client';

const App = () => {
    const params = new URLSearchParams(window.location.search);
    const [page, setPage] = React.useState(Number(params.get('page')) || 1);
    const [show_left, setShowLeft] = React.useState(true);
    const [show_right, setShowRight] = React.useState(true);
    const [pageComponent, setPageComponent] = React.useState(<div>Loading...</div>);
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    React.useEffect(() => {
        const storedMode = localStorage.getItem('theme');
        if (storedMode === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark-mode');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark-mode');
        }
    }, []);

    const toggleTheme = () => {
        setIsDarkMode(prevMode => {
            const newMode = !prevMode;
            document.documentElement.classList.toggle('dark-mode', newMode);
            localStorage.setItem('theme', newMode ? 'dark' : 'light');
            return newMode;
        });
    };

    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            const marked = window.markdownit();

            const response = await fetch(`./article.json`);
            const data = await response.json();

            const contentResponse = await fetch(`./posts/${data[page - 1].file}`);
            const content = await contentResponse.text();
            const contentHtml = marked.render(content);
            setPageComponent(
                <div className="marked" id="content" style={{
                    width: '70%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                }}>
                    <h3 style={{
                        textAlign: 'center',
                    }}>Article: {data[page - 1].name}</h3>
                    <p ref={(ref) => {
                        if (ref) {
                            ref.innerHTML = contentHtml;
                        }
                    }}></p>
                </div>
            );
            if (page === 1) {
                setShowLeft(false);
            } else {
                setShowLeft(true);
            }
            if (page === data.length) {
                setShowRight(false);
            } else {
                setShowRight(true);
            }
        };
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, [page]);

    React.useEffect(() => {
        if (typeof renderMathInElement!== 'undefined') {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false,
            });
        }
        if (typeof hljs!== 'undefined') {
            hljs.highlightAll();
        }
    }, [pageComponent]);

    return (
        <div>
            <h1 style={{ textAlign: 'center' }}>Chen Blog</h1>
            <button
                className="pretty-button"
                style={{ position: 'absolute', top: "10px", right: "10px" }}
                onClick={toggleTheme}
            >
                {!isDarkMode? 'Light' : 'Dark'}
            </button>
            <div>
                {pageComponent}
            </div>
            <div>
                <button
                    className="pretty-button"
                    style={{
                        left: 0,
                        position: 'absolute',
                        display: show_left? 'block' : 'none'
                    }}
                    onClick={() => {
                        setPage(page - 1);
                        history.pushState(null, null, `?page=${page - 1}`);
                    }}
                >Last Page</button>
                <button
                    className="pretty-button"
                    style={{
                        right: 0,
                        position: 'absolute',
                        display: show_right? 'block' : 'none'
                    }}
                    onClick={() => {
                        setPage(page + 1);
                        history.pushState(null, null, `?page=${page + 1}`);
                    }}
                >Next Page</button>
            </div>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);