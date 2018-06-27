//定义一个4*4的数组 用来跟方块对应
var array = new Array();
for (let i = 0; i < 4; i++) {
    array[i] = new Array();
    for (let j = 0; j < 4; j++) {
        array[i][j] = {};
    }
}

$(function () {
    
})

$(document).keydown(function (event) {
    var keyNum = event.which; //获取键值
    switch (keyNum) { //判断按键
        case 37: //左
            alert(1)
            break;
        case 38: // 上
            alert(12)
            break;
        case 39: //右
            alert(13)
            break;
        case 40: //下
            alert(14)
            break;
        default:
            break;

    }
});


function randomless4() {
    return parseInt(Math.random() * 10) % 4;
}

function init() {
    var i = randomless4();
    var j = randomless4();
    array[i][j].dom = createDom("p2");
    
}

function moveleft() {

}


function createDom(place) {
    return $(`
<div class="panel-body-square-parent">
    <div class="panel-body-square n2">
        <span>2</span>
    </div>
</div>`).addClass(place);
}