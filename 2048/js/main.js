//定义一个4*4的数组 用来跟方块对应
var array = new Array();
for (let i = 0; i < 4; i++) {
    array[i] = new Array();
    for (let j = 0; j < 4; j++) {
        array[i][j] = { //记录下标
            i: i,
            j: j, //下边
            ismerge: false, //判断是否合并过  如果 合并过就不允许后边相同的方块继续合并
            p: "", //位置
            oldp: "", // 上一次的位置  用来判断  如果所有的方块都没有挪动过 就不生成新的方块
            dom: null, //用来存储 dom
            number: 0 //num 用来相加的
        };
    }
}


var disabledkey = true;
var totalscore = 0;


$(function () {
    init();
    init();
    // createDom(0, 0, 2)
    // createDom(0, 1, 2)
    // createDom(0, 2, 4)
    // createDom(0, 3, 8)
})
$(document).keydown(function (event) {
    var keyNum = event.which; //获取键值
    if (disabledkey) {
        switch (keyNum) { //判断按键
            case 37: //左
                setMergeFalse();
                moveleft();
                creatNew();
                end();
                disabledkey = false;

                break;
            case 38: // 上
                setMergeFalse();
                movetop();
                creatNew();
                end();
                disabledkey = false;
                break;
            case 39: //右
                setMergeFalse();
                moveright();
                creatNew();
                end();
                disabledkey = false;
                break;
            case 40: //下 
                setMergeFalse();
                movedown();
                creatNew();
                end();
                disabledkey = false;
                break;
            default:
                break;
        }
    }

    setTimeout(() => {
        disabledkey = true;
    }, 400);


});


//每个回合以后都要重置ismerge
function setMergeFalse() {
    array.forEach(r => r.forEach(x => {
        x.ismerge = false;
    }))
}
//判断是否结束
function end() {
    $("#totalscore").html(totalscore);
    var end = true;
    var existlist = []; //已经存在的方块
    array.forEach(r => r.forEach(item => {
        if (item.dom) {
            existlist.push(item);
        }
    }))
    if (existlist.length == 16) //所有的格子都有方块
    {
        for (let i = 0; i < array.length; i++) { //横向判断是否有相同方块
            for (let j = 0; j < array.length - 1; j++) {
                if (array[i][j].number == array[i][j + 1].number) {
                    end = false;
                    break;
                }
            }
        }
        for (let j = 0; j < array.length; j++) { //纵向判断 是否有相同方块
            for (let i = 0; i < array.length - 1 /*最后一行不用判断*/ ; i++) {
                if (array[i][j].number == array[i + 1][j].number) {
                    end = false;
                    break;
                }
            }
        }
    } else {
        end = false;
    }
    if (end) {
        setTimeout(function () {
            alert("game over!");
        }, 500);

    }
}


function creatNew() {
    var creatlist = []; //需要创建的方块
    var existlist = []; //已经存在的方块
    array.forEach(r => {
        r.forEach(item => {
            if (item.dom) {
                existlist.push(item);

            } else {
                creatlist.push(item);
            }
        })
    }) //把不存在方块的数组放到list里
    var length = creatlist.length;
    //在余下的块中  生成一个新的dom(2048的方块)
    if (length > 0) {
        if (checkIsMove(existlist)) { //如果移动过  再产生新的方块  如果没有挪动过 不产生新的方块
            var random = parseInt(Math.random() * 10) % length;
            var item = creatlist[random];
            item.p = "p" + item.i + item.j;
            createDom(item.i, item.j);
        }
    }
}

function checkIsMove(existlist) {
    var ismove = false;
    existlist.forEach(r => {
        if (r.p !== r.oldp) {
            ismove = true;
        }
    })
    return ismove;
}



//产生小于4的随机数
function randomless4() {
    return parseInt(Math.random() * 10) % 4;
}
//初始化
function init() {
    var i = randomless4();
    var j = randomless4();
    createDom(i, j);
}
//生成一个新的dom
function createDom(i, j, custom) {
    array[i][j].p = "p" + i + j;
    array[i][j].oldp = "p" + i + j;
    array[i][j].dom = $(`
                    <div class="panel-body-square-parent">
                        <div class="panel-body-square">
                            <span>2</span>
                        </div>
                    </div>`).addClass(array[i][j].p);
    var num = 4;
    if (Math.random() > 0.5) {
        num = 2;
    }
    if (custom) { //自定义num
        num = custom;
    }
    array[i][j].number = num;
    array[i][j].dom.find(".panel-body-square").addClass("n" + num);
    array[i][j].dom.find(".panel-body-square").find("span").html(num)

    setTimeout(function () {
        $(".panel-body").append(array[i][j].dom)
    }, 300);

}

//predom 前一个dom
//dom 当前dom
function merge(preitem, item) {
    if (preitem.number == item.number && (preitem.ismerge == false || preitem.ismerge == undefined)) { //如果值相同 去掉前边的  
        var removeDom = preitem.dom;
        setTimeout(function () {
            removeDom.remove()
        }, 500); //移除之前的dom
        //新的dom 添加样式以及改变文字
        item.dom.find(".panel-body-square").removeClass("n" + item.number).addClass("n" + item.number * 2).find("span").html(item.number * 2);
        totalscore += item.number * 2;
        item.number = item.number * 2;
        item.ismerge = true; //当前场合已经合并过
        preitem = {
            i: preitem.i,
            j: preitem.j
        };
        return true;
    }
    return false;
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
                            if (!merge(array[index][j], item)) { //如果不能合并   index 要返回一个数字   如果可以合并   替换掉之前的方块
                                index++;
                            }
                            break;
                        }
                    }
                    item.dom.removeClass(item.p);
                    item.oldp = item.p; //以前的位置
                    item.p = "p" + index + j;
                    item.dom.addClass(item.p);

                    array[i][j] = {
                        i: i,
                        j: j
                    };
                    array[index][j] = item;
                }
            }
        }
    }
    console.log(array);
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
                            if (!merge(array[index][j], item)) {
                                index--;
                            }
                            break;
                        }
                    }
                    item.dom.removeClass(item.p);
                    item.oldp = item.p; //以前的位置
                    item.p = "p" + index + j;
                    item.dom.addClass(item.p);
                    array[i][j] = {
                        i: i,
                        j: j
                    };
                    array[index][j] = item;
                }
            }
        }
    }



    console.log(array);
}

function moveleft() {
    for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
            var item = array[i][j];
            if (item.dom) {
                if (j > 0) {
                    let index = j;
                    while (index > 0) {
                        index--;
                        if (array[i][index].dom) { //如果存在
                            if (!merge(array[i][index], item)) {
                                index++;
                            }
                            break;
                        }
                    }
                    item.dom.removeClass(item.p);
                    item.oldp = item.p; //以前的位置
                    item.p = "p" + i + index;
                    item.dom.addClass(item.p);
                    array[i][j] = {
                        i: i,
                        j: j
                    };
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
                            if (!merge(array[i][index], item)) {
                                index--;
                            }
                            break;
                        }
                    }
                    item.dom.removeClass(item.p);
                    item.oldp = item.p; //以前的位置
                    item.p = "p" + i + index; //位置改变
                    item.dom.addClass(item.p);
                    array[i][j] = {
                        i: i,
                        j: j
                    };
                    array[i][index] = item;
                }
            }
        }
    }
}