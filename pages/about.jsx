// import React from "react";
// import ReactDOM from "react-dom/client";
// import DOMPurify from 'dompurify';
// import markdownit from 'markdown-it';
// import render_katex from './utils.js';
// import NavBar from '../components/Navbar';
// import Footer from '../components/Footer';

const About = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [contentHTML, setContentHTML] = React.useState('');

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

    React.useEffect(() => {
        const loader = document.querySelector('.loader');
        loader.classList.remove('hidden');

        let ignore = false;
        const func = async () => {
            const marked = markdownit();

            const articleResponse = await fetch(`./asserts/about.md`);
            const article = await articleResponse.text();
            const articleHtml = marked.render(article);
            setContentHTML(articleHtml);
        };
        if (!ignore)
            func().then(() => {
                loader.classList.add('hidden');
            });
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <div className="about">
            <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <div
                style={{
                    margin: '0 auto',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '20px',
                    height: 'calc(100vh - 250px)',
                    overflow: 'auto',
                    position: 'relative',
                    width: '80%'
                }}
                ref={ref => {
                    if (ref) {
                        ref.innerHTML = DOMPurify.sanitize(contentHTML);

                        render_katex();
                    }
                }}
            />
            <Footer />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<About />);
