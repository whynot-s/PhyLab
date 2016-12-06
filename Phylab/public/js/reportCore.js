
var labDoc3dot1415926;
var CUR_LAB_GROUP = null;
var CUR_SUBLAB = null;
function lab(index){
    this.index = index;
    this.dbId = getDbId(index);
    this.xmlTxt;
    this.flush = function(){
        this.xmlTxt=SetXMLDoc_lab(index);
    }
    this.getIndex = function(){
        return this.index;
    }
    this.getXML = function(){
        if(this.xmlTxt!=null)return this.xmlTxt;
    }
    this.getDbId = function(){
        return this.dbId;
    }
}
function getDbId(index){
    return $('#back_info a[index='+index+']').attr('db-id');
}
function check(){
    if(browser()=="FF"){
        document.getElementById('firefox_pdf').style.display='block';
    }
    else if(browser()=="IE6"||browser()=="IE7"){
        alert("Please use the above version of IE8 or other browsers");
    }
    else {
        document.getElementById('chrom_pdf').style.display='block';
        cp('./prepare_pdf/phylab_test.pdf');
    }
    $('#lab_collapse').collapse({
        toggle: false
    })
    $('#button-view-preparation').attr("disabled", true);
    $('#button-generate-report').attr("disabled", true);
    $('#collect-report').attr("disabled", true);
}
function eleDisable(){
    SetDisable('importBtn',true);
    SetDisable('collectBtn',true);
    SetDisable('selectBtn',true);
    SetDisable('exportBtn',true);
    SetDisable('InputLabIndex',true);
}
function eleEnable(){
    SetDisable('importBtn',false);
    SetDisable('collectBtn',true);
    SetDisable('exportBtn',true);
}
function eleReset(){
    SetDisable('selectBtn',false);
    SetDisable('importBtn',false);
    SetDisable('InputLabIndex',false);
}
function collectEnable(){
    SetDisable('collectBtn',false);
    document.getElementById('collectIco').setAttribute("class","glyphicon glyphicon-star-empty");
    document.getElementById('collectText').innerHTML = "收藏";
}

function collectLab(ico_id,txt_id){
    var ico = document.getElementById(ico_id);
    var txt = document.getElementById(txt_id);
    var check = txt.innerHTML;
    if(check=="取消收藏"){
        deleteReportStar(ico,txt);
    }
    else if(check=="收藏"){
        createStar(ico,txt);
    }
    else
        alert("Button text can not be [txt] when use this function!Please Use 收藏/取消收藏");
}
function SelectLab(index,ref){
    var lt = document.getElementById(ref);
    if((new RegExp("^10(11|12|21|22|31|41|61|71|81|82|91)$")).test(index)){
        labDoc3dot1415926 = new lab(index);
        lt.innerHTML = '实验' + index + '分组预习报告';
        return true;
    }
    else{
        return false;
    }
}

//USE jquery version 2.1.4, bootstrap.min.js
function inputCheck(){
    var a = $.merge($("input.para"),$("input.var"));
    for(var i = 0; i<a.length; i++) a[i].setAttribute("value",a[i].getAttribute("aria-label"));
}
function selectBtnClick(){
    if(SelectLab($('#InputLabIndex')[0].value,'LabText')){
        $('.alert').hide();
        $('#LabStatus')[0].innerHTML = "预览";
        changePdf('prepare',labDoc3dot1415926.getIndex()+".pdf");
        eleEnable();
    }
    else{
        $('.alert').show();
    }
}
function importBtnClick(){
    $("#lab_table_"+labDoc3dot1415926.getIndex()).modal("toggle");
}
function collectBtnClick(){
    collectLab('collectIco','collectText');
}
function exportBtnClick(){
    eleDisable();
    try{
        $('#lab_collapse').collapse('hide');
        $('#loading-container').fadeIn();
        setTimeout('Post_lab(errorFunction)',1000+Math.random()*2000);
    }catch(e){
        $('#loading-container').fadeOut();
        error();
    }
}

function errorFunction(message){
    alert(message);
}

$("#InputLabIndex").bind("keypress",function(){
    if(event.keyCode==13) {
        if(SelectLab($('#InputLabIndex')[0].value,'LabText')){
            $('.alert').hide();
            $('#LabStatus')[0].innerHTML = "预览";
            changePdf('prepare',labDoc3dot1415926.getIndex()+".pdf");
            eleEnable();
            return false;
        }
        else $('.alert').show();
        return false;
    }
    else return true;
})
$('a.lab_title').bind('click',function(){
    //USE reportCore.js, bootstrap.min.js
    if($('#InputLabIndex').attr("disabled")=="disabled")return;
    if(SelectLab(this.title,'LabText')){
        $('.alert').hide();
        $('#LabStatus')[0].innerHTML = "预览";
        changePdf('prepare',labDoc3dot1415926.getIndex()+".pdf");
        eleEnable();
    }
    else $('.alert').show();
});
$('a.lab_index').bind('click',function(){
    //USE reportCore.js, bootstrap.min.js
    if($('#InputLabIndex').attr("disabled")=="disabled")return;
    if(SelectLab(this.innerHTML,'LabText')){
        $('.alert').hide();
        $('#LabStatus')[0].innerHTML = "预览";
        changePdf('prepare',labDoc3dot1415926.getIndex()+".pdf");
        eleEnable();
    }
    else $('.alert').show();
});
$('input.para').bind('keyup',function(){
    if((new RegExp("^\\d+(.\\d+)?$")).test(this.value)==false) $(this).addClass("wrong-input");
    else $(this).removeClass("wrong-input")
})
$('input.var').bind('keyup',function(){
    if((new RegExp("(^\\d+(.\\d+)?$)|(^$)")).test(this.value)==false) $(this).addClass("wrong-input");
    else $(this).removeClass("wrong-input")
})
$('button.btn-Save').bind('click',function(){
    var index = labDoc3dot1415926.getIndex();
    var paraArray,varArray;
    var labStr = "", wrong_count = 0, i = 1, ErrType = 1;
    while((tp=document.getElementById("check_"+index+"_"+i))!=null){
        if(tp.checked)labStr += "input.para"+"."+index+"_"+i+",";
        i++;
    }
    //get selected sublab
    if(labStr==""){
        document.getElementById("ErrorText_"+index).innerHTML = "请先选择需要保存数据的子实验（￣▽￣）~*　)";
        setShowHide("btnError_"+index,"btnSave_"+index,3000);
    }
    else{
        labStr = labStr.substring(0,labStr.lastIndexOf(','));
        paraArray = $(labStr);
        labStr = labStr.replace(new RegExp("para","gm"),"var");
        varArray = $(labStr);
        //get data form input, para can't be null
        paraArray.each(function(){
            if($(this).hasClass("wrong-input")) wrong_count++;
            else if(this.value==""){
                wrong_count++;
                $(this).addClass("wrong-input");
            }
            //else if((new RegExp("(^\\d+(.\\d+)?$)")).test(this.value)==false){error();return false;}
        })
        varArray.each(function(){
            if($(this).hasClass("wrong-input")) wrong_count++;
            //else if((new RegExp("(^\\d+(.\\d+)?$)|(^$)")).test(this.value)==false){error();return false;}
        })
        //check data
        if(wrong_count==0){
            $("#lab_table_"+index).modal('toggle');
            if(labStr!=""){
                SetDisable('exportBtn',false);
                labDoc3dot1415926.flush();
            }//when no selected sublab exist, just close modal
        }
        else{
            document.getElementById("ErrorText_"+index).innerHTML = "有"+wrong_count+"处输入不合法，请检查标红输入框";
            setShowHide("btnError_"+index,"btnSave_"+index,3000);
        }
    }
})

function changePdf(type,pdfName){
    var path = ""
    if(type=="prepare"){
        path = "./prepare_pdf/";
    }
    else if(type=="tmp"){
        path = "./pdf_tmp/";
    }
    else if(type=="star"){
        path = "./star_pdf/"
    }
    $("#pdf_object").attr("data",path+pdfName);
    $('#pdf_embed').attr("src",path+pdfName);
    cp(path+pdfName);
}
function Post_lab(postErrorFunc){
    var xmlString = labDoc3dot1415926.getXML();
    var dbId = labDoc3dot1415926.getDbId();
    var postData = "xml="+encodeURI(xmlString)+"&id="+dbId;
    PostAjax("./report",postData,function(){
        if (this.readyState==4 && this.status==200){
            var jsonText = eval("(" + this.responseText + ")");
            //alert(this.responseText);
            //alert(jsonText["status"]);
            if(jsonText["status"]=='success'){
                changePdf('tmp',jsonText['link']);
                $('#collectBtn').attr('link',jsonText['link']);
                $('#loading-container').fadeOut();
                eleReset();
                $('#LabStatus')[0].innerHTML = "数据";
                collectEnable();
            }
            else{
                postErrorFunc(jsonText["message"]);
                $('#loading-container').fadeOut();
                eleReset();
            }
        }
        else if(this.readyState==4 && this.status!=200){
            postErrorFunc("生成报告失败");
            $('#loading-container').fadeOut();
            eleReset();
        }
    });
}

//PhyLab2.0新增脚本
$('#lab-select-modal .list-group li').click(function () {
    CUR_SUBLAB = /lab-(\d{7})/.exec(this.id)[1];
    CUR_LAB_GROUP = /lab-(\d{4})-collapse/.exec($(this).parent()[0].id)[1];
    $('#lab-select button').text($(this).children().text()).append('<span class="caret"></span>');
    $('#lab-name').text($(this).text());
    $('#lab-select-modal').modal('hide');
    changePdf('prepare',CUR_LAB_GROUP + ".pdf");
    $('#lab-status').text('实验组' + CUR_LAB_GROUP + '预习报告');
    {
        $.ajax('./table', {
            data: {'id': CUR_SUBLAB},
        }).done(function (data) {
            $('#button-view-preparation').removeAttr("disabled");
            $('#button-generate-report').removeAttr("disabled");
            $('#collect-report').attr("disabled", true);
            $('#labdoc').html(data);

            var temp_inputs = {};
            $('#labdoc table input').each(function () {
                temp_inputs[this.id] = $(this).val();
            })
            alert(sessionStorage.setItem(CUR_SUBLAB + '-table', JSON.stringify(all_input_val)));
            $('#labdoc table input').change(function () {
                alert('test');
                var temp_inputs;
                temp_inputs = JSON.parse(sessionStorage.getItem(CUR_SUBLAB + '-table'));
                temp_inputs[this.id] = $(this).val()
                sessionStorage.setItem(CUR_SUBLAB + '-table', JSON.stringify(temp_inputs));
            })
        }).fail(function (xhr, status) {
            alert('失败: ' + xhr.status + ', 原因: ' + status);
        });
    }
});

$('#button-view-preparation').click(function () {
    changePdf('prepare',CUR_LAB_GROUP + ".pdf");
    $('#lab-status').text('实验组' + CUR_LAB_GROUP + '预习报告');
});

$('#button-generate-report').click(function () {
    var xmlString = SetXMLDoc_lab(CUR_SUBLAB);
    if (xmlString === null)
        return;
    var postData = 'id=' + CUR_SUBLAB + '&' + 'xml=' + xmlString;
    PostAjax("./report",postData,function(){
        if (this.readyState==4 && this.status==200){
            var jsonText = eval("(" + this.responseText + ")");
            //alert(this.responseText);
            //alert(jsonText["status"]);
            if(jsonText["status"]=='success') {
                changePdf('tmp',jsonText['link']);
                $('#lab-status').text('子实验' + CUR_SUBLAB + '数据报告');
                $('#collect-report').attr('link',jsonText['link']);
                $('#collect-report').removeAttr("disabled");
            }
            else
                errorFunction(jsonText["message"]);
        }
        else if(this.readyState==4 && this.status!=200)
            errorFunction("生成报告失败");
    });
});

$('#collect-report').click(function () {
    if($(this).children('.sr-only').text()=='y'){
        deleteReportStar();
    }
    else {
        createStar();
    }
})

