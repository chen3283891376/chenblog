// import renderMathInElement from 'katex/dist/contrib/auto-render';

const render_katex = () => {
    renderMathInElement(document.body, {
        delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
    });
};

(function (){
    window.render_katex = render_katex;
})();