//定义一个4*4的数组 用来跟方块对应
var array = new Array();
for (let i = 0; i < 4; i++) {
    array[i] = new Array();
    for (let j = 0; j < 4; j++) {
        array[i][j] = { //记录下标
            i: i,
            j: j, //下标
            ismerge: false, //判断是否合并过  如果 合并过就不允许后边相同的方块继续合并 () 2 2 4 8  这种情况  只允许 2跟2合并    完成后会变成 4 4  8 )
            p: "", //当前位置  place
            dom: null, //用来存储 dom
            number: 0 //num 用来相加的
        };
    }
}


var disabledkey = true;
var totalscore = 0;
var moved = false; //用来判断 方块是否移动过


$(function () {
    // init();
    // init();
    createDom(0, 1, 2)
    createDom(0, 2, 4)
    // createDom(2, 3, 4)
    // createDom(3, 3, 8)
})

function opertion(func) {
    disabledkey = false;
    setArrayReset();
    func();
    creatNew();
    end();
    disabledkey = true;

}
$(document).keydown(function (event) {
    var keyNum = event.which; //获取键值
    if (disabledkey) {
        switch (keyNum) { //判断按键
            case 37: //左
                opertion(moveleft)
                break;
            case 38: // 上
                opertion(movetop)

                break;
            case 39: //右
                opertion(moveright)
                break;
            case 40: //下 
                opertion(movedown)
                break;
            default:
                break;
        }
    }
});


//每个回合以后都要重置ismerge
function setArrayReset() {
    moved = false;
    array.forEach(r => r.forEach(x => {
        x.ismerge = false;
    }))
}
//判断是否结束
function end() {
    $("#totalscore").html(totalscore); //  修改分数

    var end = true;
    var existlist = []; //已经存在的方块
    array.forEach(r => r.forEach(item => {
        if (item.dom) {
            existlist.push(item); //把已经存在的数据 存放到 existlist 里
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
        }, 300);

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
        if (moved) { //如果移动过  再产生新的方块  如果没有挪动过 不产生新的方块
            var random = parseInt(Math.random() * 10) % length;
            var item = creatlist[random];
            item.p = "p" + item.i + item.j;
            createDom(item.i, item.j);
        }
    }
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
    $(".panel-body").append(array[i][j].dom)

}

//predom 前一个dom
//dom 当前dom
function merge(preitem, item) {
    if (preitem.number == item.number && preitem.ismerge == false) { //如果值相同 去掉前边的  
        var removeDom = preitem.dom;
        setTimeout(function () {
            removeDom.remove()
        }, 200); //移除之前的dom
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



/*
从第一行第一个  到 第四个  
然后第二行第一个 到第四个
横向判断 从左往右
 
*/
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
                    var newp = "p" + index + j; //新位置
                    if (item.p !== newp) {
                        moved = true;
                    }
                    item.p = newp; //位置改变


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
}

/*
横向  从第四行开始 从左往右
*/

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


                    var newp = "p" + index + j; //新位置
                    if (item.p !== newp) {
                        moved = true;
                    }
                    item.p = newp; //位置改变


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
}


/*
 横向  从第一行开始  从左往右
*/
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


                    var newp = "p" + i + index; //新位置
                    if (item.p !== newp) {
                        moved = true;
                    }
                    item.p = newp; //位置改变

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

/*
 横向  从第一行开始  从右往左
*/
function moveright() {
    console.log(array)
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
                    var newp = "p" + i + index; //新位置
                    if (item.p !== newp) {
                        moved = true;
                    }
                    item.p = newp; //位置改变
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