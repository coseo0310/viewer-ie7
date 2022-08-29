var db_Prescription = null;  //db로부터 받은 처방전 데이터
var view_Prescription = null;  //처방전이 표시될 엘리먼트 아이디
var position = { x:0,y:0,IsMove : false }; //화면 이동 위치정보값
var makeBox = { x:0,y:0,lastX:0,lastY:0,IsMove : false }; //드래그 박스생성 위치정보값
var PageInfo = { //페이징 처리용 데이터
    CurPage : 1,TotalPage : 1,ViewCount : 6,TotalCount : 0, List:null,
    Set:function(arr) {
        this.List = arr;
        this.TotalCount = this.List.length;
        this.TotalPage = parseInt(this.TotalCount / this.ViewCount);
        if ((this.TotalCount % this.ViewCount) > 0) {
            this.TotalPage += 1;
        }
        this.TotalPage = (this.TotalPage < 0) ? 0 : this.TotalPage;
        document.getElementById("TotPage").innerText = this.TotalPage;
    },
    GetList:function() {
        var result = [];
        var st = (this.CurPage <= 1) ? 0 : ((this.CurPage - 1) * this.ViewCount);
        var ed = (st + this.ViewCount) - 1;
        if (ed > this.List.length - 1) { ed = this.List.length - 1 }
        for(var i = st; i <= ed; i++) {
            result.push(this.List[i]);
        }

        return result;
    },
    Add:function(n) {
        this.CurPage += n;
        if (this.CurPage < 1) {
            this.CurPage = 1;
        } else if (this.CurPage > this.TotalPage) {
            this.CurPage = this.TotalPage;
        }
    },
    CurrentPage:function() {
        document.getElementById("CurPage").value = this.CurPage;
    }
}; 
var IsKeyControl = false;

//스캔 데이터를 Ajax로 불러오는 함수 (임시 구현)
function GetScanData(prescriptionId) {
    var result = [];
    
    if (prescriptionId == 1) {
        result = [
            { id:101, prescriptionId : 1, x:60, y:63,width:300,height:23,no:1, title:'보험유형', value:'의료보험' },
            { id:102, prescriptionId : 1, x:578, y:63,width:62,height:23,no:2, title:'요양기관기호', value:'11204605' },
            { id:103, prescriptionId : 1, x:160, y:92,width:62,height:23,no:3, title:'교부년월일', value:'20170529' }
        ];
    } else if (prescriptionId == 2) {
        result = [
            { id:104, prescriptionId : 2, x:40, y:336,width:65,height:18,no:12, title:'처방 의약품의 명칭', value:'645401301' },
            { id:105, prescriptionId : 2, x:40, y:359,width:65,height:18,no:17, title:'처방 의약품의 명칭', value:'656700340' },
            { id:106, prescriptionId : 2, x:40, y:380,width:65,height:18,no:22, title:'처방 의약품의 명칭', value:'657804550' }
        ];
    }

    return result;
};

//페이징 그리는 함수
function fnPaging(targetElementID) {
    if (document.getElementById(targetElementID) != null) {
        var tags = "";

        var arr = PageInfo.GetList();

        for(var i = 0; i < arr.length; i++) {
            tags += fnCreatePrescriptionTag(arr[i]);
        }

        $("#" + targetElementID).html(tags);
    }

    //처방전 태그 생성
    function fnCreatePrescriptionTag(jsonObj) {
        var result = "<tr id=\"PrescriptionID_" + jsonObj.id + "\">";
        result += "<td class=\"PageContentListSeq\">";
        result += "<span>" + jsonObj.id + "</span>";
        result += "</td>";
        result += "<td class=\"PageContentListItem\">";
        result += "<div class=\"thumbnails\"><div class=\"thumbnail_layer\" style=\"width:" + (100 * jsonObj.thumbnail.length) + "%\">";
        for(var i = 0; i < jsonObj.thumbnail.length; i++) {
            result += "<div id=\"pre_item_" + jsonObj.id + "_n" + i + "\" onclick=\"onPrescription('" + jsonObj.id + "',this.id)\" class=\"thumbnail_item\" style=\"width:" + fnRound(100 / jsonObj.thumbnail.length) + "%;\">";
            result += "<div class=\"thumbnail_content\"><img src=\"" +  jsonObj.thumbnail[i] + "\" alt=\"\" /></div></div>";
        }
        result += "</div></div>";
        result += "<p>" + jsonObj.name + "_처방전_" + jsonObj.RegistDate + "</p>";
        result += "<p>(1/" + jsonObj.thumbnail.length + ")</p>";
        result += "<p>&nbsp;</p>";
        result += "</td>";
        result += "</tr>";
        return result;
    }
};

//처방전 불러오는 함수
function fnLoadPrescription(targetElementID, viewElementID, prescription) {
    this.db_Prescription = prescription;
    view_Prescription = viewElementID;
    PageInfo.Set(db_Prescription);
    fnPaging(targetElementID);
};

//처방전 찾기
function PrescriptionFind(id) {
    var result = null;
    if (db_Prescription != null && db_Prescription.length > 0) {
        for(var i = 0; i < db_Prescription.length; i++) {
            if (db_Prescription[i].id == id) {
                result = db_Prescription[i];
                break;
            }
        }
    }
    return result;
};

//처방전 상세 보기
function onPrescription(prescriptionID, targetID) {
    var target = PrescriptionFind(prescriptionID);

    if (globalConfig.isSelect)
    {
        fnSelectFocus(document.getElementById("selection"));
    }

    $("#PrescriptionID").val(target.id);
    $("#view_data_title").text(target.name + "_처방전_" + target.RegistDate);
    $("#view_data_code").text(target.code);
    $("#view_data_description").text(target.Register + "등록");
    $("#view_data_btnImg").css("display","");

    $(".titleLine").css("visibility","visible");
    $(".thumbnail_content").removeClass("on");
    $("#" + targetID).find(".thumbnail_content").addClass("on");

    $("#" + view_Prescription).html("<div id=\"imgGuard\"></div><img src=\"" + target.images[0] + "\" alt=\"\" />").promise().done(function() {
        var file = $("#" + view_Prescription + " > img");
        var guard = $("#" + view_Prescription + " > #imgGuard");
        $("#" + view_Prescription).css({
            width : file.width() + 200,
            height : file.height()
        });
        guard.css({
            width : file.width(),
            height : file.height(),
            left:100
        });
        var origin = {
            img : target.images[0],
            width : file.width(),
            height : file.height()
        };

        db_PrescriptionLayers = GetScanData(prescriptionID);
        if (db_PrescriptionLayers != null && db_PrescriptionLayers.length > 0) {
            for(var i = 0; i < db_PrescriptionLayers.length; i++) {
                fnColorBox(boxColors.blue,view_Prescription, origin, db_PrescriptionLayers[i]);
            }
        }

        globalConfig.ready = true;
        GlobalBinder();
    });
};

//파일 다운로드 함수
function fnNowFileDownload() {
    if (globalConfig.ready) {
        var prescriptionID = $("#PrescriptionID").val();
        var target = PrescriptionFind(prescriptionID);
        fileDownload(target.images[0]);
    } else {
        alert("처방전을 선택해 주세요.");
    }
};

//셀렉트 박스 생성 함수
function fnCreateSelectBox(obj) {
    obj.find(".optionNow").bind("click", function() {
        if (obj.find(".options").css("display") != "block") {
            obj.find(".options").show("blind", null, 200, function() {
                $(this).css("display", "block");
            });
        } else {
            obj.find(".options").hide("blind", null, 100, function() {
                $(this).css("display", "none");
            }); 
        }
    });
};

//셀렉트박스 변경값 적용 함수
function fnChangeValue(targetID, obj) {
    var targetValue = String($(obj).attr("value"));

    if (targetValue == "+5%") {
        globalConfig.magnifier = Number(globalConfig.magnifier) + 0.05;
        if (globalConfig.magnifier > 3) {
            globalConfig.magnifier = 3;
        }

        $("#" + targetID).attr("value", parseInt(globalConfig.magnifier * 100) + "%");
        $("#" + targetID + "_Value").text(parseInt(globalConfig.magnifier * 100) + "%");
    } else if (targetValue == "-5%") {
        globalConfig.magnifier = Number(globalConfig.magnifier) - 0.05;
        if (globalConfig.magnifier < 0.1) {
            globalConfig.magnifier = 0.1;
        }

        $("#" + targetID).attr("value", parseInt(globalConfig.magnifier * 100) + "%");
        $("#" + targetID + "_Value").text(parseInt(globalConfig.magnifier * 100) + "%");
    } else {
        globalConfig.magnifier = Number(targetValue.replace("%","")) / 100;
        $("#" + targetID).attr("value", targetValue);
        $("#" + targetID + "_Value").text(targetValue);
    }

    $("#" + targetID).find(".options").hide("blind", null, 100, function() {
        $(this).css("display", "none");
    }).promise().done(function() {
        GlobalBinder();
    });
};

//회전값 적용 함수
function fnRotate(targetID, n) {
    if (globalConfig.ready) {
        var v = Number($("#" + targetID).val());

        if (n == null) {
            switch(event.keyCode) {
                case 38: //up
                    v = (v < 360) ? v + 1 : 0; 
                    break;
                case 40: //down
                    v = (v > 0) ? v - 1 : 360; 
                    break;
            }
        } else {
            switch(n) {
                case 38: //up
                    v = (v < 360) ? v + 1 : 0; 
                    break;
                case 40: //down
                    v = (v > 0) ? v - 1 : 360; 
                    break;
            }
        }

        globalConfig.rotate = v;
        $("#" + targetID).val(v);
        GlobalBinder();
    } else {
        alert("처방전을 선택해 주세요.");
    }
};

//회전 이벤트
function fnRotateValue(targetID, val) {
    if (globalConfig.ready) {
        globalConfig.rotate += Number(val);
        if (globalConfig.rotate > 360) {
            globalConfig.rotate = 0;
        } else if (globalConfig.rotate < 0) {
            globalConfig.rotate = 360;
        }
        $("#" + targetID).val(globalConfig.rotate);
        GlobalBinder();
    } else {
        alert("처방전을 선택해 주세요.");
    }
};

//선택확대 클릭시 이미지 변경 처리
function fnSelectFocus(obj) {
    if (globalConfig.ready) {
        globalConfig.isSelect = !globalConfig.isSelect;

        var afterSrc = $(obj).attr("onsrc");
        var nowSrc = $(obj).attr("src");
        $(obj).attr("onsrc", nowSrc);
        $(obj).attr("src", afterSrc);

        if (globalConfig.isSelect)
        {
            $("#ui_tooltip_01").show();
        }
        else
        {
            $("#ui_tooltip_01").css("display", "none");
        }
    } else {
        alert("처방전을 선택해 주세요.");
    }
};

//가로맞춤, 세로맞춤
function fnAutoSize(mode) {
    if (globalConfig.ready) {
        var target = $("#prescriptionView");
        var img = $(target.find("img")[0]);
        var persent = 0;
        var result = 0;

        var width = $(window).width();
        var height = $(window).height() - globalConfig.topMenu.height;

        //console.log(width, height);
        //console.log(img.width(), img.height());

        switch (String(mode).toLowerCase()) {
            case "width":
                persent = parseInt((img.width() * 100) / width);
                result = fnRound(((100 * 100) / persent) / 100) / 1.2;
                console.log(result);
                globalConfig.magnifier = result;
                GlobalBinder();
                break;
            case "height":
                persent = parseInt((img.height() * 100) / height);
                result = fnRound(((100 * 100) / persent) / 100);
                console.log(result);
                globalConfig.magnifier = result;
                GlobalBinder();
                break;
        }
    } else {
        alert("처방전을 선택해 주세요.");
    }
};

//초기화 버튼 이벤트
function fnReset() {
    if (globalConfig.ready) {
        globalConfig.rotate = 0;
        globalConfig.magnifier = 1.0;
        GlobalBinder();

        $("#prescriptionView").css({
            "top":"0px",
            "left":"0px"
        });
    } else {
        alert("처방전을 선택해 주세요.");
    }
};

//선택확대
function fnLayerResizing(resize) {
    var target_width = $($("#prescriptionView").find("img")[0]).width();
    var target_height = $($("#prescriptionView").find("img")[0]).height();
    var eventLayerHeight = $("#prescriptionViewEvent").height();
    var persent = 0;
    var top = (resize.y * 100) / eventLayerHeight;

    if (target_width > resize.width) {
        persent = parseInt(resize.width * 100 / target_width);
    } else if (target_width < resize.width) {
        persent = parseInt(target_width * 100 / resize.width);
    }

    var result = fnRound(((100 * 100) / persent) / 100);
    globalConfig.magnifier = result;
    GlobalBinder();

    var total = parseInt(eventLayerHeight * globalConfig.magnifier);
    var h_result = parseInt(total * (top / 100));

    $("#prescriptionView").css({
        "left": parseInt(-400 - resize.x) + "px",
        "top" : "-" + h_result + "px"
    });

    var afterSrc = $("#selection").attr("onsrc");
    var nowSrc = $("#selection").attr("src");
    $("#selection").attr("onsrc", nowSrc);
    $("#selection").attr("src", afterSrc);
};

//표시항목 설정값 변경 (버튼 이벤트)
function fnOverlay(obj, mode) {
    var chk = true;

    if ($(obj).hasClass("on")) {
        $(obj).addClass("off");
        $(obj).removeClass("on");
        $($(obj).find("span")[0]).text("OFF");
        chk = false;
    } else {
        $(obj).addClass("on");
        $(obj).removeClass("off");
        $($(obj).find("span")[0]).text("ON");
        chk = true;
    }

    globalConfig.viewType[mode] = chk;
    GlobalBinder();
};

//초기 마우스 이벤트
function onBodyEvent() {
    $("#prescriptionViewEvent").on({
        "mousedown": function(e) {
            e.preventDefault(); 
            var pos = { xVal : 0,yVal : 0 };

            if (globalConfig.isDrag) {
                position = { x : e.clientX, y : e.clientY, IsMove:true };
                $("#prescriptionViewEvent").css("cursor", "hand");
            } else if (globalConfig.isSelect) {
                makeBox.x = e.clientX;
                makeBox.y = e.clientY;
                makeBox.IsMove = true;
                $("#prescriptionViewEvent").css("cursor", "Crosshair");
                if (document.getElementById("observer") != null) {
                    $("#observer").remove();
                }
                pos.xVal = parseInt(String($("#prescriptionView").css("left")).replace("px",""));
                pos.yVal = parseInt(String($("#prescriptionView").css("top")).replace("px",""));

                $("#imgGuard").append("<div id=\"observer\" style=\"top:" + (makeBox.y - (150 + pos.yVal)) + "px;left:" + (makeBox.x - (650 + pos.xVal)) + "px;width:1px;height:0px;\"></div>");
            }
        },
        "mousemove": function(e) {
            e.preventDefault(); 
            var pos = { xVal : 0,yVal : 0,lastX : 0,lastY : 0 };

            if (globalConfig.isDrag && position.IsMove) {
                pos.xVal = parseInt(String($("#prescriptionView").css("left")).replace("px",""));
                pos.yVal = parseInt(String($("#prescriptionView").css("top")).replace("px",""));
                pos.lastX = position.x - e.clientX; 
                pos.lastY = position.y - e.clientY;
                position.x = e.clientX;
                position.y = e.clientY;

                $("#prescriptionView").css({
                    "left":parseInt(pos.xVal - pos.lastX) + "px",
                    "top":parseInt(pos.yVal - pos.lastY) + "px"
                });
            } else if (globalConfig.isSelect && makeBox.IsMove) {
                makeBox.lastX = e.clientX;
                makeBox.lastY = e.clientY;
                $("#observer").width(makeBox.lastX - makeBox.x - 20);
                $("#observer").height(makeBox.lastY - makeBox.y - 5);
            }
        },
        "mouseup":function(e) {
            e.preventDefault(); 
            if (globalConfig.isDrag) {
                position.IsMove = false;
                $("#prescriptionViewEvent").css("cursor", "");
            } else if (globalConfig.isSelect) {
                makeBox.IsMove = false;
                $("#prescriptionViewEvent").css("cursor", "");
                if (document.getElementById("observer") != null) {
                    var focusLayer = {
                        x : Number($("#observer").css("left").replace("px","")),
                        y : Number($("#observer").css("top").replace("px","")),
                        width : Number($("#observer").css("width").replace("px","")),
                        height : Number($("#observer").css("height").replace("px",""))
                    };

                    fnLayerResizing(focusLayer);
                    $("#observer").remove();
                }

                globalConfig.isSelect = false;
                makeBox.IsMove = false;
            }
        }
    });

    $("body").keydown(function(e) {
        console.log(e.keyCode);
        switch(e.keyCode) {
            case 17:
            case 25:
                IsKeyControl = true;
                break;
            case 16:
                globalConfig.isDrag = true;
                break;
            case 27:
                if (globalConfig.isSelect)
                {
                    fnSelectFocus(document.getElementById("selection"));
                }
                break;
            case 49: //1
                if (IsKeyControl) {
                    fnOverlay(document.getElementById("btnOver1"), "number");
                }
                break;
            case 50: //2
                if (IsKeyControl) {
                    fnOverlay(document.getElementById("btnOver3"), "item");
                }
                break;
            case 51: //3
                if (IsKeyControl) {
                    fnOverlay(document.getElementById("btnOver2"), "area");
                }
                break;
            case 52: //4
                if (IsKeyControl) {
                    fnOverlay(document.getElementById("btnOver4"), "result");
                }
                break;
            default:
                console.log(e.keyCode);
                break;

        }
    });
    $("body").keyup(function(e) {
        //e.preventDefault(); 
        switch(e.keyCode) {
            case 17:
            case 25:
                IsKeyControl = false;
                break;
            case 16:
                globalConfig.isDrag = false;
                break;
        }
    });
};

//초기 마우스 클릭 이벤트 효과 처리
function onButtonEvent() {
    $(".btnImageOn").on({
        "mousedown":function() {
            var afterSrc = $(this).attr("onsrc");
            var nowSrc = $(this).attr("src");
            $(this).attr("onsrc", nowSrc);
            $(this).attr("src", afterSrc);
        },
        "mouseup":function() {
            var afterSrc = $(this).attr("onsrc");
            var nowSrc = $(this).attr("src");
            $(this).attr("onsrc", nowSrc);
            $(this).attr("src", afterSrc);
        }
    });
};

//처방전 목록, 이전 페이지로
function fnAgoPage() {
    PageInfo.Add(-1);
    fnPaging("PageContentList");
    PageInfo.CurrentPage();
};

//처방전 목록, 다음 페이지로
function fnNextPage() {
    PageInfo.Add(1);
    fnPaging("PageContentList");
    PageInfo.CurrentPage();
};

//처방전 목록, 특정 페이지로
function fnGotoPage(n) {
    var regex = /[0-9]{1,}/gi;

    if (regex.test(n)) {
        PageInfo.CurPage = n;
        fnPaging("PageContentList");
        PageInfo.CurrentPage();
    } else {
        alert("숫자만 입력하세요.");
        document.getElementById("CurPage").value = PageInfo.CurPage;
    }
};

function gotoPage() {
    try {
        var curpage = document.getElementById("CurPage").value;
        fnGotoPage(Number(curpage));
    } catch (e) {
        console.log(e.message);
        document.getElementById("CurPage").value = PageInfo.CurPage;
    } finally {
        return false;
    }
};

function fnDisplay(targetID, isShow) {
    if (document.getElementById(targetID) != null) {
        if (isShow) {
            $("#" + targetID).css("display", "block");
        } else {
            $("#" + targetID).css("display", "none");
        }
    }
};

//페이지 초기화
$(document).ready(function() {
    fnCreateSelectBox($("#magnifier"));
    GlobalBinder();
    onBodyEvent();
    onButtonEvent();
});