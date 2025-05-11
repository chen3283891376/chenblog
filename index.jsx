// import React from "react";
// import ReactDOM from "react-dom/client";
// import DOMPurify from 'dompurify';
// import markdownit from 'markdown-it';
// import renderMathInElement from 'katex/dist/contrib/auto-render';
// import hljs from 'highlight.js';
// import hitokoto from './js/hitokoto.js';

const App = () => {
    const params = new URLSearchParams(window.location.search);
    const [page, setPage] = React.useState(Number(params.get('page')) || 1);
    const [show_left, setShowLeft] = React.useState(true);
    const [show_right, setShowRight] = React.useState(true);
    const [title, setTitle] = React.useState('');
    const [contentHTML, setContentHTML] = React.useState('');
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    const hitokoto_text = hitokoto();

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
        const loader = document.querySelector('.loader');
        loader.classList.remove('hidden');

        let ignore = false;
        const func = async () => {
            const marked = markdownit();

            const response = await fetch(`./article.json`);
            const data = await response.json();

            const articleResponse = await fetch(
                `./posts/${data[page - 1].file}`
            );
            const article = await articleResponse.text();
            const articleHtml = marked.render(article);

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

            setTitle(data[page - 1].name);
            setContentHTML(articleHtml);
        };
        if (!ignore)
            func().then(() => {
                loader.classList.add('hidden');
            });
        return () => {
            ignore = true;
        };
    }, [page]);

    React.useEffect(() => {
        if (typeof renderMathInElement !== 'undefined') {
            renderMathInElement(document.body, {
                delimiters: [
                    { left: '$$', right: '$$', display: true },
                    { left: '$', right: '$', display: false },
                    { left: '\\(', right: '\\)', display: false },
                    { left: '\\[', right: '\\]', display: true }
                ],
                throwOnError: false
            });
        }
        if (typeof hljs !== 'undefined') {
            hljs.highlightAll();
        }

        document.querySelectorAll('.marked pre code').forEach(el => {
            window.LineNumbers.lineNumbersBlock(el);

            const lang = el.className
                .replace('language-', '')
                .replace(' hljs', '')
                .replace('hljs ', '');
            let head_el = document.createElement('div');
            head_el.className = 'code-header';

            let lang_el = document.createElement('span');
            if (lang === 'undefined') {
                lang_el.innerText = 'Plain Text';
            } else {
                lang_el.innerText = lang;
            }
            head_el.appendChild(lang_el);

            let copy_el = document.createElement('button');
            copy_el.className = 'copy-btn';
            copy_el.innerText = 'Copy';
            copy_el.addEventListener('click', () => {
                navigator.clipboard.writeText(el.outerText).then(() => null);
                copy_el.innerText = 'Copied!';
                setTimeout(() => {
                    copy_el.innerText = 'Copy';
                }, 1000);
            });
            head_el.appendChild(copy_el);

            el.parentNode.insertBefore(head_el, el);
        });
        
        const comments = document.querySelector('.comments');
        if (comments) {
            comments.innerHTML = '';

            const utterances = document.createElement('script');
            utterances.setAttribute('src', 'https://utteranc.es/client.js');
            utterances.setAttribute('repo', 'chen3283891376/chenblog');
            utterances.setAttribute('issue-term', 'title');
            utterances.setAttribute(
                'theme',
                isDarkMode ? 'github-dark' : 'github-light'
            );
            utterances.setAttribute('crossOrigin', 'anonymous');
            utterances.setAttribute('async', 'true');
            comments.appendChild(utterances);
        }
    }, [contentHTML, isDarkMode]);

    return (
        <div>
            <link
                rel="stylesheet"
                href={`https://fastly.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/stackoverflow-${isDarkMode ? 'dark' : 'light'}.min.css`}
                crossOrigin="anonymous"
            />
            <h1 style={{ marginLeft: 'calc(10% + 10px)' }}>Chen Blog</h1>
            <button className="theme-toggle-btn" onClick={toggleTheme}>
                {isDarkMode ? (
                    <i className="fa-solid fa-sun"></i>
                ) : (
                    <i className="fa-solid fa-moon"></i>
                )}
            </button>
            <div
                className="marked"
                id="content"
                style={{
                    width: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto'
                }}
            >
                <h3
                    style={{
                        marginLeft: '10px'
                    }}
                >
                    Article: {title}
                </h3>
                <div style={{
                    display: 'flex',
                }}>
                    <div
                        style={{
                            flex: 8,
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '20px',
                            height: 'calc(100vh - 270px)',
                            overflow: 'auto',
                            position: 'relative',
                            width: '80%'
                        }}
                        ref={ref => {
                            if (ref) {
                                ref.innerHTML = DOMPurify.sanitize(contentHTML);

                                const comments = document.createElement('div');
                                comments.className = 'comments';
                                ref.appendChild(comments);
                            }
                        }}
                    />

                    <div
                        style={{
                            flex: 2,
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '20px',
                            height: 'calc(100vh - 270px)',
                            overflow: 'auto',
                            position: 'relative',
                            width: '20%'
                        }}
                        ref={async ref => {
                            if (ref) {
                                const response = await fetch('./asserts/about.md');
                                const about = await response.text();
                                const aboutHtml = markdownit().render(about);
                                ref.innerHTML = DOMPurify.sanitize(aboutHtml);
                                renderMathInElement(ref, {
                                    delimiters: [
                                        { left: '$$', right: '$$', display: true },
                                        { left: '$', right: '$', display: false },
                                        { left: '\\(', right: '\\)', display: false },
                                        { left: '\\[', right: '\\]', display: true }
                                    ],
                                    throwOnError: false
                                });
                            }
                        }}
                    />
                </div>
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
                >
                    Last Page
                </button>
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
                >
                    Next Page
                </button>
            </div>
            <p className="hitokoto">{hitokoto_text}</p>
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<App />);
