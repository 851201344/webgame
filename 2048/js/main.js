//定义一个4*4的数组 用来跟方块对应
var array = new Array();
for (let i = 0; i < 4; i++) {
    array[i] = new Array();
    for (let j = 0; j < 4; j++) {
        array[i][j] = {};
    }
}

$(function () {
    init();
    init();
})

$(document).keydown(function (event) {
    var keyNum = event.which; //获取键值
    switch (keyNum) { //判断按键
        case 37: //左
            moveleft();
            console.log(array)
            break;
        case 38: // 上
            movetop();
            break;
        case 39: //右
            moveright();
            console.log(array)
            break;
        case 40: //下
            movedown();
            break;
        default:
            break;

    }
});


function randomless4() {
    return parseInt(Math.random() * 10) % 4;
}

//初始化
function init() {
    var i = randomless4();
    var j = randomless4();
    array[i][j].p = "p" + i + j;
    array[i][j].dom = createDom("p" + i + j);

    var num = 4;
    if (Math.random() > 0.5) {
        num = 2;
    }
    array[i][j].number = num;
    array[i][j].dom.find(".panel-body-square").addClass("n" + num);
    array[i][j].dom.find(".panel-body-square").find("span").html(num)
    $(".panel-body").append(array[i][j].dom)
}

//predom 前一个dom
//dom 当前dom
function eat(preitem, item) {

    console.log(preitem)
    console.log(item)
    if (preitem.number == item.number) { //如果值相同

    } else { //如果值不相同
        return false;
    }
}


function movetop() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            if (i > 0) //跳过第一行
            {
                var item = array[i][j];
                if (item.dom) {
                    let index = i;
                    while (index > 0) {
                        index--;
                        if (array[index][j].dom) { //如果存在
                            if (!eat(array[index][j], item)) {
                                index++;
                                break;
                            }
                        }
                    }
                    item.dom.removeClass(item.p);
                    item.p = "p" + index + j;
                    item.dom.addClass(item.p);
                    array[i][j] = {};
                    array[index][j] = item;
                }
            }
        }
    }
}



function movedown() {
    for (let i = 3; i >= 0; i--) {
        for (let j = 0; j < 4; j++) {
            if (i < 3) { //跳过第一行
                var item = array[i][j];
                if (item.dom) {
                    let index = i;
                    while (index < 3) {
                        index++;
                        if (array[index][j].dom) { //如果存在
                            if (!eat(array[index][j], item)) {
                                index--;
                                break;
                            }
                        }
                    }
                    item.dom.removeClass(item.p);
                    item.p = "p" + index + j;
                    item.dom.addClass(item.p);
                    array[i][j] = {};
                    array[index][j] = item;
                }
            }
        }
    }
}

function moveleft() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            var item = array[i][j];
            console.log(item, i, j);
            if (item.dom) {
                if (j > 0) {
                    let index = j;
                    while (index > 0) {
                        index--;
                        if (array[i][index].dom) { //如果存在
                            if (!eat(array[i][index], item)) {
                                index++;
                                break;
                            }
                        }
                    }
                    item.dom.removeClass(item.p);
                    item.p = "p" + i + index;
                    item.dom.addClass(item.p);
                    array[i][j] = {};
                    array[i][index] = item;
                }
            }
        }
    }
}


function moveright() {
    for (let i = 0; i < 4; i++) {
        for (let j = 3; j >= 0; j--) {
            var item = array[i][j];
            if (item.dom) {
                if (j < 3) {
                    let index = j;
                    while (index < 3) {
                        index++;
                        if (array[i][index].dom) { //如果存在
                            if (!eat(array[i][index], item)) {
                                index--;
                                break;
                            }
                        }
                    }
                    item.dom.removeClass(item.p);
                    item.p = "p" + i + index;
                    item.dom.addClass(item.p);
                    array[i][j] = {};
                    array[i][index] = item;
                }
            }
        }
    }
}


function createDom(place) {

    return $(`
<div class="panel-body-square-parent">
    <div class="panel-body-square">
        <span>2</span>
    </div>
</div>`).addClass(place);
}