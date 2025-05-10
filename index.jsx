// import React from "react";
// import ReactDOM from "react-dom";

const App = () => {
    const params = new URLSearchParams(window.location.search);
    const [page, setPage] = React.useState(Number(params.get('page')) || 1);
    const [show_left, setShowLeft] = React.useState(true);
    const [show_right, setShowRight] = React.useState(true);
    const [pageComponent, setPageComponent] = React.useState(<div>Loading...</div>);
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    if (!params.get('page')) {
        history.pushState(null, null, `?page=1`);
    }
    document.title = `Page ${page} - Chen Blog`;

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
        };
        if (!ignore) func();
        return () => {
            ignore = true;
        };
    }, [page]);

    React.useEffect(() => {
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: true },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false,
            });
        }
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }

        document.querySelectorAll('.marked code').forEach(el => {
            window.LineNumbers.lineNumbersBlock(el);

            const lang = el.className.replace('language-', '').replace(' hljs', '');
            let head_el = document.createElement('div');
            head_el.className = 'code-header';

            let lang_el = document.createElement('span');
            lang_el.innerText = lang;
            head_el.appendChild(lang_el);

            let copy_el = document.createElement('button');
            copy_el.className = 'copy-btn';
            copy_el.innerText = 'Copy';
            copy_el.addEventListener('click', () => {
                navigator.clipboard.writeText(el.outerText);
                copy_el.innerText = 'Copied!';
                setTimeout(() => {
                    copy_el.innerText = 'Copy';
                }, 1000);
            });
            head_el.appendChild(copy_el);

            el.parentNode.insertBefore(head_el, el);
        });
    }, [pageComponent]);

    React.useEffect(() => {
        const comments = document.querySelector('.comments');
        if (comments) {
            comments.innerHTML = '';

            const utterances = document.createElement('script')
            utterances.setAttribute('src', 'https://utteranc.es/client.js')
            utterances.setAttribute('repo', "chen3283891376/chenblog")
            utterances.setAttribute('issue-term', "title")
            utterances.setAttribute('theme', isDarkMode ? 'github-dark' : 'github-light')
            utterances.setAttribute('crossOrigin', 'anonymous')
            utterances.setAttribute('async', 'true')
            comments.appendChild(utterances)
        }
    }, [pageComponent, isDarkMode]);

    return (
        <div>
            <link rel="stylesheet" href={`https://fastly.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/stackoverflow-${isDarkMode ? 'dark' : 'light'}.min.css`} crossOrigin="anonymous" />
            <h1 style={{ textAlign: 'center' }}>Chen Blog</h1>
            <button
                className="pretty-button"
                style={{ position: 'absolute', top: "10px", right: "10px" }}
                onClick={toggleTheme}
            >
                {!isDarkMode ? 'Light' : 'Dark'}
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
                        display: show_left ? 'block' : 'none'
                    }}
                    onClick={() => {
                        setPage(page - 1);
                        history.pushState(null, null, `?page=${page - 1}`);
                        document.title = `Page ${page - 1} - Chen Blog`;
                    }}
                >Last Page</button>
                <button
                    className="pretty-button"
                    style={{
                        right: 0,
                        position: 'absolute',
                        display: show_right ? 'block' : 'none'
                    }}
                    onClick={() => {
                        setPage(page + 1);
                        history.pushState(null, null, `?page=${page + 1}`);
                        document.title = `Page ${page + 1} - Chen Blog`;
                    }}
                >Next Page</button>
            </div>
            <br /><br />
            <div className="comments" id="comments"></div>
            {/* <footer>
                <div id='gitalk-container' style={{ margin: "auto", maxWidth: "600px" }}></div>
            </footer> */}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById("app"));
root.render(<App />);
