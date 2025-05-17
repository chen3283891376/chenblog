// import React from "react";
// import ReactDOM from "react-dom/client";
// import NavBar from '../components/NavBar';
// import Footer from '../components/Footer';

const Message = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {
        const loader = document.querySelector('.loader');
        loader.classList.remove('hidden');

        let ignore = false;
        const func = async () => {
            const response = await fetch('./asserts/messages.json');
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
        <div className="about">
            <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <article className="container">
                {messages.map((message, index) => (
                    <div key={index} className="card">
                        <p>{message.text}</p>
                        <p>{message.time}</p>
                    </div>
                ))}
            </article>
            <Footer />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Message />);
