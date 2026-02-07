'use client';
import React from 'react';
import DOMPurify from 'dompurify';
import markdownit from 'markdown-it';
import hljs from 'highlight.js';
import render_katex from '../js/utils';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import 'katex/dist/katex.min.css';

const Article = () => {
    const [page, setPage] = React.useState(1);
    const [show_left, setShowLeft] = React.useState(true);
    const [show_right, setShowRight] = React.useState(true);
    const [title, setTitle] = React.useState('');
    const [contentHTML, setContentHTML] = React.useState('');
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setPage(parseInt(params.get('page')) || 1);

        if (!params.get('page')) {
            history.pushState(null, null, `?page=1`);
        }
        document.title = `Page ${page} - Chen Blog`;
    }, [page]);

    React.useEffect(() => {
        const storedMode = localStorage.getItem('theme');
        if (storedMode === 'dark') {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }
    }, []);

    React.useEffect(() => {
        const loader = document.querySelector('.loader');
        loader.classList.remove('hidden');

        let ignore = false;
        const func = async () => {
            const marked = markdownit({
                html: true,
                linkify: true,
                typographer: true,
                quotes: '“”‘’',
            });

            const response = await fetch(`/article.json`);
            const data = await response.json();

            const articleResponse = await fetch(`/posts/${data[page - 1].file}`);
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
        let ignore = false;
        const processCodeBlocks = async () => {
            const { lineNumbersBlock } = await import('../js/highlight-line-number');

            render_katex();
            hljs.highlightAll();

            document.querySelectorAll('.code-header').forEach(header => header.remove());

            document.querySelectorAll('.marked pre code').forEach(el => {
                lineNumbersBlock(el);

                const lang = el.className.replace('language-', '').replace(' hljs', '').replace('hljs ', '');
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
                utterances.setAttribute('src', '/utterances-client.js');
                utterances.setAttribute('repo', 'chen3283891376/chenblog');
                utterances.setAttribute('issue-term', 'title');
                utterances.setAttribute('theme', isDarkMode ? 'github-dark' : 'github-light');
                utterances.setAttribute('crossOrigin', 'anonymous');
                utterances.setAttribute('async', 'true');
                comments.appendChild(utterances);
            }
        };

        if (!ignore) processCodeBlocks().then();
        return () => {
            ignore = true;
        };
    }, [contentHTML, isDarkMode]);

    return (
        <>
            <link
                rel="stylesheet"
                href={`https://fastly.jsdelivr.net/npm/highlight.js/styles/stackoverflow-${isDarkMode ? 'dark' : 'light'}.min.css`}
                crossOrigin="anonymous"
            />
            <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <article className="marked" id="content">
                <h3
                    style={{
                        marginLeft: '10px',
                        marginBlockStart: '10px',
                    }}
                >
                    Article: {title}
                </h3>
                <div style={{ display: 'flex' }}>
                    <div
                        style={{
                            flex: 8,
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '20px',
                            height: 'calc(100vh - 245px)',
                            overflow: 'auto',
                            position: 'relative',
                            width: '80%',
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
                            height: 'calc(100vh - 245px)',
                            overflow: 'auto',
                            position: 'relative',
                            width: '20%',
                        }}
                    >
                        <h4>About Me</h4>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="https://avatars.githubusercontent.com/u/168898000?v=4" alt={'Chenify'}></img>
                    </div>
                </div>
            </article>
            <button
                className="pretty-button"
                style={{
                    left: 0,
                    display: show_left ? 'block' : 'none',
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
                    display: show_right ? 'block' : 'none',
                }}
                onClick={() => {
                    setPage(page + 1);
                    history.pushState(null, null, `?page=${page + 1}`);
                    document.title = `Page ${page + 1} - Chen Blog`;
                }}
            >
                Next Page
            </button>
            <Footer />
        </>
    );
};

export default Article;
