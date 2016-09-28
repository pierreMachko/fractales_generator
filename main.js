var canvas = document.getElementById('canvas');
var context = canvas.getContext('2d');
var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;


var rules = [];
var rulesCount = 0;
var timeout;


var x = Math.random();
var y = Math.random();


function initHtml () {
    $('#add_rule').on('click', function () {
        addRule();
    })

    $('#remove_rule').on('click', function () {
        removeRule();
    })

    $('#reset').on('click', function () {
        clearTimeout(timeout);
        context.clearRect(-width * 4, -height * 4, width * 20, height * 20);
    })
}


function addRule () {
    var id = 'rule_box' + rulesCount;
    $('#box_container').append('<div class="box" id="' + id + '"></div>');
    $('#' + id).append('<p>Rule ' + rulesCount + '</p>')
                .append(slider({
                    name: 'a',
                    min:  -3,
                    max:  3
                }))
                .append(slider({
                    name: 'b',
                    min:  -3,
                    max:  3
                }))
                .append(slider({
                    name: 'c',
                    min:  -3,
                    max:  3
                }))
                .append(slider({
                    name: 'd',
                    min:  -3,
                    max:  3
                }))
                .append(slider({
                    name: 'tx',
                    min:  -3,
                    max:  3
                }))
                .append(slider({
                    name: 'ty',
                    min:  -3,
                    max:  3
                }))
                .append(slider({
                    name: 'weight',
                    min:  0,
                    max:  1
                }))
                .css({
                    left: (150 * (rulesCount + 1)) + 'px'
                });
    rulesCount++;
    createBlankRule();
    clearAll();
}


function slider (params) {
    return '<span>' + params.name + ' :<a>0</a><input class="slider" type="range" value="0" min="' + params.min + '" max="' + params.max + '" step="0.01" oninput="onChangeValue(this, this.value)"></input></span>';
}


function removeRule () {
    if (rulesCount > 0) {
        var id = 'rule_box' + (rulesCount - 1);
        $('#' + id).remove();
        rulesCount--;
        rules[rulesCount] = null;
        clearAll();
    }
}


function clearAll () {
    clearTimeout(timeout);
    context.clearRect(-width * 4, -height * 4, width * 20, height * 20);
    x = Math.random();
    y = Math.random();
    iterate();
}


function onChangeValue (slider, value) {
    $(slider).parent().find('a').text(value);
    var ruleProperty = $(slider).parent().text().split(' :')[0];
    var ruleNumber = $(slider).parent().parent().attr('id').split('rule_box')[1];

    rules[ruleNumber][ruleProperty] = parseFloat(value);
    clearAll();
}


function createBlankRule() {
    rules.push({
        a: 0,
        b: 0,
        c: 0,
        d: 0,
        tx: 0,
        ty: 0,
        weight: 0
    })
}


function iterate () {
    var count = 0;
    for (var i = 0; i < 800; i++) {
        count = 0;
        var rule = getRule();
        while(rule === undefined) {
            rule = getRule();
            if (++count >= 10000) {
                return;
            }
        }
        var x1 = x * rule.a + y * rule.b + rule.tx;
        var y1 = x * rule.c + y * rule.d + rule.ty;
        x = x1;
        y = y1;
        plot(x, y);
    }
    timeout = setTimeout(iterate, 16);
}


function getRule () {
    var rand = Math.random();
    for (var i = 0; i < rules.length; i++) {
        var rule = rules[i];
        if (rand < rule.weight) {
            return rule;
        }
        rand -= rule.weight;
    }
}


function plot(x, y) {
    context.fillRect(x * 50, -y * 50, 1, 1);
}






$(function () {
    context.translate(width / 2, height / 1.5);
    initHtml();
})
