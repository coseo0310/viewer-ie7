var btnImgFirstClick = false;  //다운로드 초기 이벤트 캐치 변수
var lastIndexNum = 100;  //창클릭시 선택된 창을 맨위로 올려주기 위한 값
//전역 환경 변수
var globalConfig = {
    rotate : 0,
    magnifier : 1.0,
    ready : false,
    isDrag : false,
    isSelect : false,
    topMenu : {
        height:128
    },
    viewType : {
        number : true,
        item : true,
        area : true,
        result : true
    }
};
var boxColors = {
    blue : "blue",
    orange : "orange",
    pink : "pink"
}

//파란색 레이어박스 띄우기
function fnColorBox(color, targetElementID, origin, obj) {
    if (document.getElementById(targetElementID) != null) {
        var tags = "";
        var y = Number(obj.y) - 22;
        var x = Number(obj.x) + 100;
        tags += '<div class="box" style="top:' + y + 'px;left:' + x + 'px;">';
        tags += '<table class="' + color + '">';
        tags += '<tr><td style="text-align:left;">';
        tags += '<table class="view_box">';
        tags += '<tr>';
        tags += '<td class="col1"></td>';
        tags += '<td class="col2"></td>';
        tags += '<td class="col3"></td>';
        tags += '<td class="col4"></td>';
        tags += '</tr>';
        tags += '<tr>';
        tags += '<td class="col5"></td>';
        tags += '<td class="col6"><span class="view_number">' + obj.no + '.</span><span class="view_item">' + obj.title + '</span></td>';
        tags += '<td class="col7"><span class="view_result">' + obj.value + '</span></td>';
        tags += '<td class="col8"></td>';
        tags += '</tr>';
        tags += '</table>';
        tags += '</td></tr>';
        tags += '<tr class="view_area"><td style="text-align:left;"><div class="boxValue" style="width:' + obj.width + 'px;height:' + obj.height + 'px;';
        tags += 'background:url(' + origin.img + ') no-repeat;background-position:-' + obj.x + 'px -' + (obj.y + 8) + 'px;">';
        tags += '</div></td></tr>';
        tags += '</table>';
        tags += '</div>';
        $("#" + targetElementID).append(tags).promise().done(function() {
            $(".box").on({
                "mousedown":function(e) {
                    e.stopPropagation();
                    console.log($(e.currentTarget).css("z-index", lastIndexNum++));
                }
            });

            if (obj.callback != null && typeof obj.callback == "function") {
                obj.callback();
            }
        });
    }
};

//파일 다운로드
function fileDownload(path) {
    try {
        console.log("fileDownload:" + path);
        var _window = window.open(path, "hiddenLayer");
        var filename = path.substring(path.lastIndexOf("/") + 1).split("?")[0];
        //_window.document.close();
        _window.document.execCommand('SaveAs', true, filename || url);
        //_window.close();
        if (!btnImgFirstClick) {
            setTimeout(function() {
                btnImgFirstClick = true;
                fileDownload(path);
            }, 1000);
        }
    } catch (e) {
        console.log(e.message);
    }
};

//해당되는 태그를 찾아서 배열 형태로 반환
function fnFindTag(tags, tag) {
    var result = [];

    tag = String(tag).toLowerCase();
    var html = String(tags).toLowerCase();
    var st = 0;
    var ed = 0;
    var tmp = "</"+tag+">";
    var item = "";

    while (html.indexOf("<"+tag) > -1) {
        st = html.indexOf("<"+tag);
        ed = html.indexOf(tmp) + tmp.length;
        item = html.substring(st, ed);
        html = html.substring(ed, html.length);
        result.push(item);
    }
    return result;
};

//전역 설정 적용 함수
function GlobalBinder() {
    globalConfig.magnifier = fnRound(globalConfig.magnifier);
    console.log(globalConfig);

    if (globalConfig.magnifier > 3) {
        globalConfig.magnifier = 3;
    } else if (globalConfig.magnifier < 0.1) {
        globalConfig.magnifier = 0.1;
    }

    $("#prescriptionView").css({
        'transform':'scale(' + globalConfig.magnifier + ')',
        'zoom':globalConfig.magnifier
    });
    
    if (Number(globalConfig.rotate) > 0) {
        $("#prescriptionView").rotate(globalConfig.rotate);
    }

    $("#magnifier_Value").text(parseInt(globalConfig.magnifier * 100) + "%");

    if (globalConfig.magnifier > 1)
    {
        var width = $(window).width();
        var height = $(window).height();
        var target_width = $($("#prescriptionView").find("img")[0]).width();
        var target_height = $($("#prescriptionView").find("img")[0]).height();
    
        $("#prescriptionView").css({
            "top":parseInt((fnMax(target_height,height) - fnMin(target_height,height)) + 130) + "px",
            "left": parseInt(fnRound(fnMin(target_width,width) - fnMax(target_width,width)) / 5) + "px"
        });
        
        //console.log($("#prescriptionView").css("top"));
        //console.log($("#prescriptionView").css("left"));
    }
    else
    {
        $("#prescriptionView").css({
            "top":"0px",
            "left": "0px"
        });
    }

    if (globalConfig.viewType.area) {
        $(".view_area").css({ "display" : "block" });
    } else {
        $(".view_area").css({ "display" : "none" });
    }

    if (globalConfig.viewType.result) {
        $(".view_result").css({ "visibility" : "visible" });
    } else {
        $(".view_result").css({ "visibility" : "hidden" });
    }

    if (globalConfig.viewType.item) {
        $(".view_item").css({ "visibility" : "visible" });
    } else {
        $(".view_item").css({ "visibility" : "hidden" });
    }

    if (globalConfig.viewType.number) {
        $(".view_number").css({ "visibility" : "visible" });
    } else {
        $(".view_number").css({ "visibility" : "hidden" });
    }

    if (!globalConfig.viewType.area && !globalConfig.viewType.result && !globalConfig.viewType.item && !globalConfig.viewType.number) {
        $(".box").css({ "display" : "none" });
    } else {
        $(".box").css({ "display" : "block" });
    }

    if (!globalConfig.viewType.result && !globalConfig.viewType.item && !globalConfig.viewType.number) {
        $(".view_box").css({ "visibility" : "hidden" });
    } else {
        $(".view_box").css({ "visibility" : "visible" });
    }

    if (!globalConfig.isSelect)
    {
        $("#ui_tooltip_01").css("display", "none");
    }
};

function fnRound(num) {
    return (Math.floor(num * 100) / 100).toFixed(2);
};

function fnMax(a, b) {
    if (Number(a) > Number(b)) {
        return Number(a);
    } else {
        return Number(b);
    }
};

function fnMin(a, b) {
    if (Number(a) < Number(b)) {
        return Number(a);
    } else {
        return Number(b);
    }
};