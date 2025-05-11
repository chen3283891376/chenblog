const hitokoto = async () => {
    const response = await fetch('https://v1.hitokoto.cn/?c=k&charset=utf-8');
    const data = await response.json();
    const hitokoto = `${data.hitokoto} —— ${data.from_who}「${data.from}」`;
}
(function() {
    window.hitokoto = hitokoto;
})();