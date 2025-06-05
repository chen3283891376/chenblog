import React from 'react';
import ReactDOM from 'react-dom/client';
import NavBar from '../components/Navbar';
import Footer from '../components/Footer';

const itemsPerPage = 5; // 每页显示的文章数量

const Home = () => {
    const [isDarkMode, setIsDarkMode] = React.useState(false);
    const [articleList, setArticleList] = React.useState([]);
    const [articleContents, setArticleContents] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1); // 当前页码

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

    // 计算当前页显示的文章索引
    const indexOfLastArticle = currentPage * itemsPerPage;
    const indexOfFirstArticle = indexOfLastArticle - itemsPerPage;
    const currentArticles = articleList.slice(
        indexOfFirstArticle,
        indexOfLastArticle
    );
    const currentContents = articleContents.slice(
        indexOfFirstArticle,
        indexOfLastArticle
    );

    // 计算总页数
    const totalPages = Math.ceil(articleList.length / itemsPerPage);

    // 处理页码改变
    const handlePageChange = pageNumber => {
        setCurrentPage(pageNumber);
    };

    return (
        <>
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
                    marginTop: '90px'
                }}
            >
                {currentContents.map((content, index) => (
                    <div key={index}>
                        <h2>{currentArticles[index].name}</h2>
                        <p>{content}</p>
                        <a
                            href={`./articles.html?page=${currentArticles[index].id}`}
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
                            {currentArticles[index].time}
                        </i>
                        <hr />
                    </div>
                ))}
            </div>
            <div className="pagination" style={{ textAlign: 'center' }}>
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        style={{
                            margin: '0 5px',
                            padding: '5px 10px',
                            border: '1px solid #ccc',
                            borderRadius: '3px',
                            background:
                                currentPage === index + 1 ? '#007BFF' : 'white',
                            color: currentPage === index + 1 ? 'white' : 'black'
                        }}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            <Footer />
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(<Home />);
