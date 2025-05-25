// import React from "react";
// import ReactDOM from "react-dom/client";
// import NavBar from '../components/Navbar';
// import Footer from '../components/Footer';

const CommentsPage = () => {
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

    React.useEffect(() => {
        const utterances = document.querySelector('.utterances');
        if (utterances) {
            utterances.setAttribute(
                'theme',
                isDarkMode ? 'github-dark' : 'github-light'
            );
        }
    }, [isDarkMode]);

    return (
        <div>
            <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <article
                className="comment-box"
                ref={ref => {
                    const utterances = ref;
                    if (utterances) {
                        utterances.innerHTML = '';

                        const script = document.createElement('script');
                        script.className = 'utterances';
                        script.src = './js/utterances-client.js';
                        script.setAttribute('repo', 'chen3283891376/chenblog');
                        script.setAttribute('issue-term', 'title');
                        script.setAttribute(
                            'theme',
                            isDarkMode ? 'github-dark' : 'github-light'
                        );
                        script.setAttribute('crossOrigin', 'anonymous');
                        script.setAttribute('async', 'true');
                        utterances.appendChild(script);
                    }
                }}
            />
            <Footer />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<CommentsPage />);
