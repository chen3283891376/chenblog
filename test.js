// import hljs from 'https://fastly.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/highlight.min.js';
if (location.search.split("?")[1]==undefined) location.search="?1"
vm = Vue.createApp({
    data:function(){
        var a;
        const marked = window.markdownit();
        var list = null;
        // 创建XMLHttpRequest对象用于请求article.json
        var xhr1 = new XMLHttpRequest();
        xhr1.open('GET', './article.json', false); // 第三个参数设置为false表示同步请求
        xhr1.send();
        if (xhr1.status === 200) {
            list = JSON.parse(xhr1.responseText);
            console.log(list.length);
            
            var param = Number(location.search.split("?")[1])-1;
            if (list[param]!= undefined) {
                var xhr2 = new XMLHttpRequest();
                xhr2.open('GET', `./article/${list[param]["file"]}`, false);
                xhr2.send();
                if (xhr2.status === 200) {
                    a = marked.render(xhr2.responseText);
                    var title = "Article:"+list[param]["name"];
                } else {
                    a = `<h1 style="text-align: center;">404</h1><p style="text-align: center;">你来到了没有知识的荒原 🙊</p>`;
                }
            } else {
                var title = "Error";
                a = `<h1 style="text-align: center;">404</h1><p style="text-align: center;">你来到了没有知识的荒原 🙊</p>`;
            }
            
            
        } else {
            console.error('请求article.json失败');
        }
        return{
            text: a,
            word: title,
            page: param+1,
            showright: true,
            showleft: true,
            list: list
        }
    },
    methods:{
        lastpage: function(){
            var page = this.page-1;
            list = this.list
            len = list.length;
            if (page<1) this.showleft=false;
            else{
                location.search = "?"+String(page);
            }
        },
        nextpage: function(){
            var page = this.page+1;
            list = this.list
            len = list.length;
            if (page>len) this.showleft=false;
            else{
                location.search = "?"+String(page);
            }
        }
    }
})。mount("#content")

window.onload = ()=>{
    var page = Number(location.search.split("?")[1]);
    var xhr1 = new XMLHttpRequest();
    xhr1.open('GET', './article.json', false); // 第三个参数设置为false表示同步请求
    xhr1.send();
    len = JSON.parse(xhr1.responseText).length;
    if (page==len) vm.showright=false;
    else if(page==1) vm.showleft=false;
    else if (page<1 || page>len){
        vm.showleft=false;
        vm.showright=false;
    }
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
}
