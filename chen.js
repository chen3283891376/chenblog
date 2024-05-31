var i = 1;
var flag = true;
function fade() {
    var box = document.getElementById('box');
    if (document.all) {
        box.style.filter = "alpha(opacity='+i+')";
    } else {
        box.style.opacity = parseFloat(i / 100);
    }
    if (i < 100 && flag) {
        i += 5;
    }
    else {
        flag = false;
    }
    if (i > 0 && !flag) {
        i -= 5;
    }
    else {
        flag = true;
    }
    setTimeout('fade()', 50);
}
fade();