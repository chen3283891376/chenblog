'use client';
import React from 'react';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';
import '../message.css';

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
        let ignore = false;
        const func = async () => {
            const response = await fetch('/messages.json');
            const responseData = await response.json();
            setMessages(responseData);
        };
        if (!ignore)
            func().then();
        return () => {
            ignore = true;
        };
    }, []);

    return (
        <>
            <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <article className="container">
                {messages.toReversed().map((message, index) => (
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

export default MessagePage;
