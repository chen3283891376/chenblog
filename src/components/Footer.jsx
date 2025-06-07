import React from 'react';
import hitokoto from '@/js/hitokoto';

const Footer = () => {
    const [hitokoto_text, setHitokotoText] = React.useState('');
    React.useEffect(() => {
        let ignore = false;
        const func = async () => {
            setHitokotoText(await hitokoto());
        }
        if (!ignore) func().then();
        return () => {
            ignore = true;
        };
    }, []);
    return (
        <footer>
            <p className="hitokoto">{hitokoto_text}</p>
        </footer>
    );
};

export default Footer;
