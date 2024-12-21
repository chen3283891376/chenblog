// const marked = window.markdownit({
//     highlight: function (str, lang) {
//         if (lang && hljs.getLanguage(lang)) {
//         try {
//             return hljs.highlight(lang, str).value;
//         } catch (__) {}
//         }
        
//         return ''; // 使用额外的默认转义
//     }
// });
const marked = window.markdownit();
list = null
$.get(`./article.json`, function(response, status, xhr){
    list = response
    if (list[location.href.split("?")[1]] != undefined){
        $.get(`./article/${location.href.split("?")[1]}.md`, function(response, status, xhr){
            $("#content").html(marked.render(response));
            renderMathInElement(document.body, {
                // customised options
                // • auto-render specific keys, e.g.:
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                // • rendering keys, e.g.:
                throwOnError : false
              });
            hljs.highlightAll();
        });
    }else{
        $("#content").html(`<h1 style="text-align: center;">404</h1><p style="text-align: center;">你来到了没有知识的荒原 🙊</p>`)
    }
    
    title = document.getElementById("title");
    title.innerHTML = "Article:"+list[location.href.split("?")[1]]
});