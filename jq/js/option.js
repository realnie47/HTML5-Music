
// 拖拽方法
function drag(div) {
    div.onmousedown = function(ev) {
        // 鼠标放下时，计算鼠标的坐标值与 oDiv 的坐标值差
        var disX = ev.clientX - div.offsetLeft;
        var disY = ev.clientY - div.offsetTop;
    
        // 鼠标移动时，将 oDiv 的坐标设置为鼠标移动后的坐标
        document.onmousemove = function(ev) {
            var l = ev.clientX - disX;
            var t = ev.clientY - disY;
            div.style.left = l + 'px';
            div.style.top = t + 'px';
        };
    
        // 鼠标抬起时
        document.onmouseup = function() {
            document.onmousemove = null;
            document.onmouseup = null;
        }
    }
}