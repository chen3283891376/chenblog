import React from 'react';
import ReactDOM from 'react-dom/client';
import NavBar from '@/components/Navbar';
import Footer from '@/components/Footer';

const MessagePage = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [messages, setMessages] = React.useState([]);

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
            const response = await fetch('./src/asserts/messages.json');
            const responseData = await response.json();
            setMessages(responseData);
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
        <>
            <link rel="stylesheet" href="./src/css/message.css" />
            <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <article className="container">
                {messages.reverse().map((message, index) => (
                    <div key={index} className="card">
                        <p>{message.text}</p>
                        <p>{message.time}</p>
                    </div>
                ))}
            </article>
            <Footer />
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<MessagePage />);
