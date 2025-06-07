import React from 'react';
import hitokoto from '@/js/hitokoto';

const Footer = () => {
    const hitokoto_text = hitokoto();
    return (
        <footer>
            <p className="hitokoto">{hitokoto_text}</p>
        </footer>
    );
};

export default Footer;
