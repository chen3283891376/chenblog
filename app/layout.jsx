import './globals.css';

export const metadata = {
    title: 'Chen Blog',
    description: 'Personal blog of Chen Wang',
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <div className="loader"></div>
                <div id="app">{children}</div>
            </body>
        </html>
    );
}
