// import React from "react";
// import ReactDOM from "react-dom/client";
// import NavBar from '../components/Navbar';
// import Footer from '../components/Footer';

const Home = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [articleList, setArticleList] = React.useState([]);
    const [articleContents, setArticleContents] = React.useState([]);

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
            const response = await fetch(`./article.json`);
            const data = await response.json();
            setArticleList(data.reverse());

            const contents = await Promise.all(
                data.map(async article => {
                    const response = await fetch(`./posts/${article.file}`);
                    const responseText = await response.text();
                    return responseText.slice(0, 200) + '...';
                })
            );
            setArticleContents(contents);
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
        <div>
            <NavBar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
            <div
                className="marked"
                style={{
                    width: '80%',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    border: '1px solid #ccc',
                    borderRadius: '5px',
                    padding: '20px',
                    height: 'calc(100vh - 200px)',
                    overflow: 'auto',
                    position: 'relative',
                    marginTop: '90px',
                }}
            >
                {articleContents.map((content, index) => (
                    <div key={index}>
                        <h2>{articleList[index].name}</h2>
                        <p>{content}</p>
                        <a
                            href={`./articles.html?page=${articleList[index].id}`}
                        >
                            查看更多
                        </a>
                        <i
                            style={{
                                float: 'right',
                                fontSize: '12px',
                                color: '#999',
                                display: 'block'
                            }}
                        >
                            {articleList[index].time}
                        </i>
                        <hr />
                    </div>
                ))}
            </div>
            <Footer />
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Home />);
