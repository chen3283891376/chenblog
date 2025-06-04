import React from "react";
import hitokoto from "../js/hitokoto.js"

const Footer = () => {
    const hitokoto_text = hitokoto();
    return (
        <footer>
            <p className="hitokoto">{hitokoto_text}</p>
        </footer>
    );
};

// (function () {
//     window.Footer = Footer;
// })();
export default Footer;