import './globals.css';

export const metadata = {
    title: 'Chen Blog',
    description: 'Personal blog of Chen Wang',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div id="app">
                    <main className="main-wrapper">
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
