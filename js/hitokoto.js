const hitokoto = async () => {
    let hitokoto = "加载中...";
    const response = await fetch('https://v1.hitokoto.cn/?c=k&charset=utf-8');
    if (!response.ok) {
        return "谨以此献给学而思最好的那段时光, 以及我们失去的一切。 —— 凌";
    }
    const data = await response.json();
    hitokoto = `${data.hitokoto} —— ${data.from_who}「${data.from}」`;
    return hitokoto;
}
(function() {
    window.hitokoto = hitokoto;
})();