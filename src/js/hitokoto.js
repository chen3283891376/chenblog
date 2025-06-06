const Hitokoto = [
    '谨以此献给学而思最好的那段时光, 以及我们失去的一切。 —— 凌',
    '大雨之后，是漫长的潮湿。',
    '生命中曾经有过的所有灿烂，原来终究，都需要用寂寞来偿还。 —— 《百年孤独》',
    '生命如同寓言，其价值不在于长短，而在于内容。 —— 塞涅卡',
    '但此刻，天上地下，只剩下他一人。鸦已栖定。落日已灭亡。 —— 余光中',
    '我们终此一生，就是要摆脱他人的期待，找到真正的自己。 —— 《无声告白》',
    '世界上只有一种真正的英雄主义，那就是在认清生活的真相后依然热爱生活。 —— 罗曼·罗兰',
    '人是为了活着本身而活着，而不是为了活着之外的任何事物而活着。 —— 余华《活着》',
    '时间决定你会在生命中遇见谁，你的心决定你想要谁出现在你的生命里，而你的行为决定最后谁能留下。 —— 梭罗',
    '且视他人之疑目如盏盏鬼火，大胆去走你的夜路。 —— 史铁生',
    '人永远都无法知道自己该要什么，因为人只能活一次，既不能拿它跟前世相比，也不能在来生加以修正。 —— 米兰·昆德拉《不能承受的生命之轻》',
    '在隆冬，我终于知道，我身上有一个不可战胜的夏天。 —— 加缪',
    '万物皆有裂痕，那是光照进来的地方。 —— 莱昂纳德·科恩',
    '人生如逆旅，我亦是行人。 —— 苏轼《临江仙·送钱穆父》',
    '满地都是六便士，他却抬头看见了月亮。 —— 毛姆《月亮与六便士》',
    '如果你因失去了太阳而流泪，那么你也将失去群星了。 —— 泰戈尔《飞鸟集》',
    '所有随风而逝的都属于昨天，所有历经风雨留下来的才是面向未来的。 —— 玛格丽特·米切尔《飘》',
    '当夏季死时，所有的莲都殉情。 —— 余光中《诀》',
    '今晨我坐在窗前，世界像位过客，驻足片时，向我点头，走了。 —— 泰戈尔《飞鸟集》',
    '如果自己不想积极认真地生活，不管得到什么样的回答都没用。 —— 东野圭吾《解忧杂货店》',
    '虽然人生在世有种种不如意，但你仍可以在幸福与不幸中做选择。 —— 王小波',
    '童年啊，是梦中的真，是真中的梦，是回忆时含泪的微笑。 —— 冰心《繁星·春水》',
    '我们把世界看错，反说它欺骗了我们。 —— 泰戈尔《飞鸟集》',
    '每个不曾起舞的日子，都是对生命的辜负。 —— 尼采',
    '世界以痛吻我，要我报之以歌。 —— 泰戈尔',
    '所有的大人都曾经是小孩，虽然只有少数人记得。 —— 《小王子》',
    '世间所有的相遇，都是久别重逢。 —— 《一代宗师》',
    '黑夜给了我黑色的眼睛，我却用它寻找光明。 —— 顾城',
    '死亡不是失去生命，而是走出了时间。 —— 余华《在细雨中呼喊》',
    '我曾踏月而来，只因你在山中。 —— 席慕蓉《山月》',
    '我明白你会来，所以我等。 —— 沈从文《雨后》',
    '天空没有翅膀的痕迹，而我已飞过。 —— 泰戈尔'
];

const hitokoto = async () => {
    if (Math.random() < 0.5) return Hitokoto[Math.floor(Math.random() * Hitokoto.length)];
    try {
        const response = await fetch('https://v1.hitokoto.cn/?c=k');
        const responseData = await response.json();
        if (!responseData.from_who &&!responseData.from) return (responseData.hitokoto);
        else if (!responseData.from_who) return `${responseData.hitokoto} —— 「${responseData.from}」`
        else if (!responseData.from) return `${responseData.hitokoto} —— ${responseData.from_who}`
        else return `${responseData.hitokoto} —— ${responseData.from_who}「${responseData.from}」`
    } catch (error) {
        console.log('hitokoto api error');
        console.error(error);
    }
    return Hitokoto[Math.floor(Math.random() * Hitokoto.length)];
};

export default hitokoto;
