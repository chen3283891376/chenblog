'use client';
import React from 'react';
import DOMPurify from 'dompurify';
import markdownit from 'markdown-it';
import ast from 'markdown-it-ast';
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
    const [toc, setToc] = React.useState([]);
    const [isDarkMode, setIsDarkMode] = React.useState(false);

    const generateTOC = tree => {
        const tocList = [];

        const walk = node => {
            if (!node) return;
            if (node.nodeType === 'heading') {
                try {
                    const level = parseInt(node.openNode.tag.replace('h', ''));
                    let text = '';

                    const extract = n => {
                        if (n.type === 'text') text += n.content;
                        if (n.children) n.children.forEach(extract);
                    };
                    node.children?.forEach(extract);

                    text = text.trim();
                    if (!text) return;

                    const id = `heading-${Math.random().toString(36).slice(2, 10)}`;
                    tocList.push({ level, text, id });
                } catch {}
            }
            if (node.children) node.children.forEach(walk);
        };

        tree.forEach(walk);
        setToc(tocList);
    };

    const scrollToHeading = id => {
        const el = document.getElementById(id);
        if (!el) return;
        const wrapBox = document.querySelector('.marked > div > div:first-child');
        if (!wrapBox) return;
        const wrapTop = wrapBox.getBoundingClientRect().top;
        const elemTop = el.getBoundingClientRect().top;
        // 容器原有滚动 + 元素相对容器高度 - 顶部留白
        const targetScroll = wrapBox.scrollTop + (elemTop - wrapTop) - 16;
        wrapBox.scrollTo({ top: targetScroll, behavior: 'smooth' });
    };

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        setPage(parseInt(params.get('page')) || 1);
        if (!params.get('page')) history.pushState(null, null, `?page=1`);
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

            const tokens = marked.parse(article, {});
            const tree = ast.makeAST(tokens);
            generateTOC(tree);

            const articleHtml = marked.render(article);
            setTitle(data[page - 1].name);
            setContentHTML(articleHtml);

            setShowLeft(page !== 1);
            setShowRight(page !== data.length);
        };
        if (!ignore) func().then();
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
                const lang =
                    el.className.replace('language-', '').replace(' hljs', '').replace('hljs ', '') || 'Plain Text';
                const head_el = document.createElement('div');
                head_el.className = 'code-header';

                const lang_el = document.createElement('span');
                if (lang === 'undefined') {
                    lang_el.innerText = 'Plain Text';
                } else {
                    lang_el.innerText = lang;
                }
                head_el.appendChild(lang_el);

                const copy_el = document.createElement('button');
                copy_el.className = 'copy-btn';
                copy_el.innerText = 'Copy';
                copy_el.addEventListener('click', () => {
                    navigator.clipboard.writeText(el.outerText).then(() => null);
                    copy_el.innerText = 'Copied!';
                    setTimeout(() => (copy_el.innerText = 'Copy'), 1000);
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
                <h3 style={{ marginLeft: '10px', marginBlockStart: '10px' }}>Article: {title}</h3>
                <div style={{ display: 'flex', gap: '16px' }}>
                    <div
                        style={{
                            flex: 8,
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            padding: '20px',
                            height: 'calc(100vh - 245px)',
                            overflow: 'auto',
                            position: 'relative',
                        }}
                        ref={ref => {
                            if (ref) {
                                ref.innerHTML = DOMPurify.sanitize(contentHTML);
                                const allHead = ref.querySelectorAll('h1,h2,h3,h4,h5,h6');
                                allHead.forEach((domH, idx) => {
                                    if (toc[idx]) domH.id = toc[idx].id;
                                });

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
                        }}
                    >
                        <h4 style={{ marginBottom: '12px' }}>目录</h4>
                        <div className="toc-container">
                            {toc.length === 0 ? (
                                <div className="toc-empty">暂无目录</div>
                            ) : (
                                toc.map((item, idx) => {
                                    const indent = (item.level - 1) * 12;
                                    return (
                                        <div
                                            key={idx}
                                            className={`toc-item h${item.level}`}
                                            onClick={() => scrollToHeading(item.id)}
                                            style={{ marginLeft: `${indent}px` }}
                                        >
                                            {item.text}
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </article>

            <button
                className="pretty-button"
                style={{ left: 0, display: show_left ? 'block' : 'none' }}
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
                style={{ right: 0, display: show_right ? 'block' : 'none' }}
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
