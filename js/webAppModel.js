/**
 * Created by BOT01 on 2017/5/25.
 */
/*表单序列化 生成 JSON*/
(function($){
    $.fn.extend({
        serializeJSON:function(){
            if(this.length>1){
                return false;
            }
            var arr=this.serializeArray();
            var obj=new Object;
            $.each(arr,function(k,v){
                obj[v.name]=v.value;
            });
            return obj;
        }
    });
})(jQuery);

/*计算模型*/
(function(){
    var _Cal = function(){
        this.count = 0; //投注数
        this.total = 0;//投注金额
        this.subItemTotals = [];//每注的小计，定胆统计的属性
        this.miniItems = 2; //最小数组个数，定胆以外的算法属性
    };

    _Cal.prototype.Static = function(sourceArr){
        if((sourceArr instanceof Array) == false || sourceArr.length == 0){
            return this;
        }

        //@numbers => 每注选的号码  @price => 每注的单价  @times => 每注的倍数
        var item = {numbers:[],price:0,times:1};

        this.count = sourceArr.length;
        this.subItemTotals = [];
        for(var i=0; i<sourceArr.length; i++){
            var _betItem = $.extend(true,{},item,sourceArr[i]);
            var _betItemTotal = _betItem.numbers.length * _betItem.price * _betItem.times;
            this.subItemTotals.push(_betItemTotal);
            this.total += _betItemTotal;
        }

        return this;
    };

    _Cal.prototype.Double = function(sourceArr,price,times){
        if((sourceArr instanceof Array) == false || sourceArr.length < this.miniItems){
            return this;
        }

        /*穷举 闭包*/
        function js(arr1,arr2){
            var arr = Array();
            for(var i=0;i<arr1.length;i++){
                for(var j=0;j<arr2.length;j++){
                    arr.push(arr1[i]+" "+arr2[j]);
                }
            }
            return arr;
        }



        var arr = js(sourceArr[0],sourceArr[1]);
        var b = true;
        var index = 2;
        while(b){
            if(sourceArr[index]){
                arr = js(arr,sourceArr[index]);
                index++;
            }else{
                break;
            }
        };



        for(var i =0;i<arr.length;i++){
            flag = true;
            var temparr = arr[i].split(" ");
            for(var j=0; j< temparr.length; j++){
                if((arr[i].replace(temparr[j],"")).indexOf(temparr[j]) > -1){
                    flag = false;
                    break;
                }
            }

            //计算合法的组合
            if(flag){
                console.log("复式："+ arr[i] +"\n");
                this.count++;
            }
        };

        //总价格 = 单价*投注数*投注倍数
        this.total = price * this.count * times;
        return this;
    };
   window["BetCalculationModel"] = _Cal;
})();

(function(){
    var _NSUSER = function(){
        this.sessionkey = "YiDaiShengShi_User";
        this.getUserToken = function(){
            var _Token = sessionStorage.getItem(this.sessionkey);
            if(_Token != null){
                _Token = JSON.parse(_Token);
            }
            return _Token;
        };
        this.setUserToken = function(token){
            sessionStorage.setItem(this.sessionkey,token);
        };
        this.removeUserToken = function(){
            sessionStorage.removeItem(this.sessionkey);
        }
    };

    var _NSRACE = function(){
        this.sessionkey = "YiDaiShengShi_Race";
        this.getRaceId = function(){
            var _racedb = sessionStorage.getItem(this.sessionkey);
            if(_racedb != null){
                _racedb = JSON.parse(_racedb);
            }
            return _racedb;
        };
        this.setRaceId = function(raceId){
            sessionStorage.setItem(this.sessionkey,raceId);
        };
        this.removeRaceId = function(){
            sessionStorage.removeItem(this.sessionkey);
        }
    };

    var _NSURL = function(){
        this.URLKey = "YiDaiShengShi_Navigation";
        this.DefaultUrl = "profile.html";
    };
    _NSURL.prototype.push = function(url){
        url = url == undefined?window.location.href:url;
        sessionStorage.setItem(this.URLKey,url);
    };
    _NSURL.prototype.go = function(){
        var _url = sessionStorage.getItem(this.URLKey);
        if(_url){
            self.location = _url;
        }else{
            self.location = this.DefaultUrl;
        }
    };

    var _NSTIMER = function(){
        this.timer = null;
        this.endTime = null;
        this.startPlayTime = null;
        this.playStart = false;
        this.timeInterval = 1000.0;
        this.repeats = true;
        this.action = null;
        this.invalidate = function(){
            //销毁
            if(this.timer){
                if(this.repeats){
                    clearInterval(this.timer);
                }else{
                    clearTimeout(this.timer);
                }
            }
        };
        this.fireDate = function(){
            //启动
            var _that = this;
            if(this.repeats && this.timer == null){
                this.timer = setInterval(this.action,this.timeInterval);
            }

            if(this.repeats == false && this.timer == null){
                this.timer = setTimeout(this.action,this.timeInterval);
            }
        }
    };

    var  _DateTimeUnitFormat = function(d){
        return d>9?d:"0"+d;
    };
    var _DateTimeFormat = function(timestamp){
       var _date = new Date(parseInt(timestamp));
        var strDate = _date.getFullYear()+"/"
            +_DateTimeUnitFormat(_date.getMonth()+1)+"/"
            +_DateTimeUnitFormat(_date.getDate())+" "
            +_DateTimeUnitFormat(_date.getHours())+":"
            +_DateTimeUnitFormat(_date.getMinutes());
        return strDate;
    }


    var getUrlParam = function(name){
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); /*构造一个含有目标参数的正则表达式对象*/
        var r = window.location.search.substr(1).match(reg);  /*匹配目标参数*/
        if (r != null) return unescape(r[2]); return null; /*返回参数值*/
    };

    var _DataFormat = function(d){
        var _val = parseFloat(d);
        var _wan = parseInt(_val/10000);

        if(_wan > 0){
            var _count = (_val % 10000).toFixed(2);
            return _wan+"万"+_count;
        }
        else{
            return d.toFixed(2);
        }

    }

    window["NSUser"] = _NSUSER;
    window["NSURL"] = _NSURL;
    window["NSTimer"] = _NSTIMER;
    window["NSRace"] = _NSRACE;
    window["NSDateTimeUnitFormat"] = _DateTimeUnitFormat;
    window["NSDateTimeFormat"] = _DateTimeFormat;
    window["GetURLParam"] = getUrlParam;
    window["NSDataNumberFormat"] = _DataFormat;
})();

function UpdateBalance(val){
    $("#PKCoin").text(val);
    var myself = new NSUser();
    var _db = myself.getUserToken();
    _db.PKCoin = val;
    myself.setUserToken(JSON.stringify(_db));
}

function checkPhoneFormat(phone){
    if(checkMoblieFormat(phone)){
        return true;
    }else{
        var isPhone = /^0\d{2,3}-\d{7,8}(-\d{1,6})?$/;
        if(isPhone.test(phone)){
            //是固话
            return true;
        }else{
            return false;
        }
    }
}

function checkMoblieFormat(phone){
    if((/^1[34578]\d{9}$/.test(phone))){
        //是手机号码
        return true;
    }else{
        return false;
    }
}
var compare = function (x, y) {
//比较函数
    if (x < y) {
        return -1;
    } else if (x > y) {
        return 1;
    } else {
        return 0;
    }
}

function randomArray(source,len){
    var sL = source.length;
    var target= [];     //存储下标

    //检测num是否存在于arr，存在重新添加，不存在直接添加
    function detection(arr, num){
        var repeatFlag = false;
        for(var j = 0; j < arr.length; j++){
            if(arr[j] == num){
                repeatFlag = true;
            }
        }
        if(repeatFlag){
            //递归
            arguments.callee(arr, Math.floor( Math.random() * sL ));
        }else{
            arr.push(num);
        }
    }

    //随机4个数组下标
    for(var i = 0; i < len; i++){
        var rand = Math.floor( Math.random() * sL );
        if(target.length > 0){
            detection(target, rand);
        }else{
            target.push(rand);
        }
    }
    return target;
}

function GetFileNameFromURL(){
    var url = window.location.href;
    var fileName = null;
    if(url.slice(-1,1) == "/"){
        fileName = "index";
    }else{
        fileName = url.replace(/(.*\/)*([^.]+).*/ig,"$2");
        if(fileName.toLowerCase() == "www"){
            fileName = "index";
        }
    }
    return fileName;
}


var TurnPage = null;
function turnPageComponet()
{
    this.next = function(){
        if(this.SEL instanceof HTTPGet || this.SEL instanceof HTTPPost){
            this.SEL.page++;
            this.SEL.doRequest();
            setCurrentPageStyle(this.SEL.page);
        }
    };
    this.prev = function(){
        if(this.SEL instanceof HTTPGet || this.SEL instanceof HTTPPost){
                if(this.SEL.page >1){
                    this.SEL.page--;
                    this.SEL.doRequest();
                    setCurrentPageStyle(this.SEL.page);
                }
        }
    };
    this.go = function(n){
        if(this.SEL instanceof HTTPGet || this.SEL instanceof HTTPPost){
            if(n > 0){
                this.SEL.page = n;
                this.SEL.doRequest();
                setCurrentPageStyle(this.SEL.page);
            }
        }
    };
    this.SEL = null;

    function setCurrentPageStyle(page){
        $("#turn-page ul li").each(function(i,el){
                var _pageIndex = parseInt($(el).children('a').text());
                if(_pageIndex == page){
                    $(el).addClass('active').siblings().removeClass('active');
                }
        });
        var _curr = $("#turn-page span:last").text();
        _curr = _curr.replace(_curr.substring(_curr.indexOf("(")+1,_curr.indexOf("/")),page);
        $("#turn-page span:last").text(_curr);
    }
};


function MakeHTTPRequest(Model){
    var Request = null;
    if(Model.toUpperCase() == "POST"){
        Request = new HTTPPost();
    }else{
        Request = new HTTPGet();
    }
    Request.willRequest = function(conn){
        var index = layer.load(1, {
            shade: [0.1,'#fff'] //0.1透明度的白色背景
        });
    };
    Request.didRequestFailed = function(conn,result){
        layer.closeAll('loading');
        layer.msg(result.Message);
    };
    return Request;
}


function Ev_Modal(){
    $('#myModal').on('show.bs.modal', function (event) {
        console.info(event);

        var sender = $(event.relatedTarget)
        var recipient = sender.data('whatever');
        var modalData = $.extend(true,{},ModalDataOption,eval("MakeHtmlModal"+recipient+"()"));
        var modal = $(this);
        if(modalData.modalSize){
            modal.find('.modal-dialog').addClass(modalData.modalSize);
        }
        modal.find('.modal-title').text(modalData.headerText);
        modal.find('.modal-body-inner').html(modalData.htmlInner);
        if(modalData.footerText == null){
            modal.find('.modal-footer').remove();
        }else{
            modal.find('#myModalDescription').text(modalData.footerText);
        }
        switch (recipient){
            case "ProfileEdit":{
                $("#myForm input:first").attr("readonly","readonly");
            }break;
            case "DrawCash":{
                $("#myForm input:first").val($("#quota").text());
                Do_GetBankCardList(function (result) {
                    var _html = "";
                    for(var i=0; i<result.Table.length;i++){
                        _html += '<option value="'+result.Table[i].Id+'">'+result.Table[i].BankName +" "+ result.Table[i].BankAccountNumber+'</option>';
                    }
                    $("select[name=bankCardId]").append(_html);
                });
            }break;
            case "Commission":{
                var tds = sender.closest("tr").find("td");
                var _user = tds.eq(0).text();
                var _quota = tds.eq(1).text();
                $("#myForm input:first").val(_user);
                $("#myForm input").eq(1).val(_quota);

            }break;
            case "BankCardEdit":{
            	var _bankId = sender.data("Id");
            	if(_bankId){
            		$("#myForm input").eq(0).val(_bankId);
            		$("#myForm input").eq(1).val(sender.find("li").eq(2).text());
            		$("#myForm input").eq(2).val(sender.find("li").eq(0).text());
            		$("#myForm input").eq(3).val(sender.find("li").eq(1).text());
            	}
            }break;
            case "OrderDetail":{
                var _orderId = sender.data("id");
                var _request = MakeHTTPRequest("POST");
                _request.interFace = "Order/GetOrderDetail";
                _request.sender = {orderId:_orderId};
                _request.didRequestSucc = function(conn,result){
					layer.closeAll();
                    for(var key in result){
                        var span = $("#OrderDetailView span[name="+key+"]");
                        if(span.size() > 0){
                            switch(key){
                                case 'WonAmount':{
                                    if(result[key] == null){
                                        span.text("待开奖");
                                    }else if(result[key] == 0){
                                        span.text("未中奖");
                                    }else{
                                        span.text(result[key]);
                                    }
                                }break;
								case'BuyTime':{
									var timestamp = result.BuyTime.replace(/[^\d]/g,'');
									
									span.text(NSDateTimeFormat(timestamp));
								}break;
                                default:{
                                    span.text(result[key]);
                                }break;
                            }

                        }
                    }

                };
                _request.doRequest();
            }break;
        }

    });

    //$('#myModal').on('hidden.bs.modal', function (e) {
    //
    //});
}

function Do_GetBankCardList(callback) {
    var _request = MakeHTTPRequest('POST');
    _request.interFace = "BankCard/GetBankCardList";
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        if(typeof (callback) == "function" ){
            callback(result);
        }
    }
    _request.doRequest();
}

function Do_SaveWithModalType(){
    var _type = $("#myForm").attr("name");
    eval("Do_Submit_"+_type+"()");
}

function Do_GetQuestionList(){
    var _request = MakeHTTPRequest("POST");
    _request.interFace = "access/GetQuestionList";
    _request.didRequestSucc = function(conn,result){
        console.info(result);
        layer.closeAll();
        var HTML = "";
        for(var i=0; i<result.Table.length; i++){
         HTML += '<li><a href="javascript:Do_QuestionSelected('+result.Table[i].Id+',&quot;'+result.Table[i].QuestionText+'&quot;)">'+result.Table[i].QuestionText+'</a></li>';
		 if(i < result.Table.length-1){
		 	HTML += '<li role="separator" class="divider"></li>';
		 }
        }
        $(".dropdown-menu").empty().html(HTML);
    };
    _request.doRequest();
}

function Do_QuestionSelected(QuestionId,QuestionText){
	$("input[name=QuestionId]").val(QuestionId);
	$(".dropdown-toggle").text(QuestionText);
	
}

function Ev_Forget(){
    $(".reg-form-header").on('click',function(e){
        location.href = "index.html";
    });

	$("#btn_forget").on("click",function(e){

		var _data = $("#myForm").serializeJSON();
        if(_data.userName.length ==0){
            layer.msg('请填写用户名');return;
        }

        if(_data.questionId.length ==0){
            layer.msg('请选择密保问题');return;
        }

        if(_data.answer.length ==0){
            layer.msg('请输入密保答案');return;
        }

        if(_data.newPassword.length ==0){
            layer.msg('请输入新密码');return;
        }
        e.stopPropagation();
        e.preventDefault();

		var _request = MakeHTTPRequest("POST");
		    _request.interFace = "_access/forgotpassword";
		    _request.sender = _data;
		    _request.didRequestSucc = function(conn,result){
		    	layer.closeAll();
		    	layer.msg(result.Message);
		    };
		    _request.doRequest();
	});
}

//提交新队员
function Do_Submit_AddTeamMember(){
    var _data = $("#myForm").serializeJSON();
    if(_data.userName.length == 0){
        layer.msg("请填写队员帐号");
        return;
    }
    if(_data.password.length == 0){
        layer.msg("请填写队员帐号密码");
        return;
    }

    if(_data.commissionPercentage.length == 0){
        layer.msg("请填写提成点");
        return;
    }

    var _request = MakeHTTPRequest("POST");
    _request.sender = _data;
    _request.interFace = "Team/AddMember";
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        layer.msg(result.Message);
        if($("title").text() == "团队成员"){
            Do_GetTeamMemberList();
        }
        $('#myModal').modal('hide');
    };
    _request.doRequest();
}
//提交反馈
function Do_Submit_Feedback(){
    var _data = $("#myForm").serializeJSON();
    var _request = MakeHTTPRequest("POST");
    _request.sender = _data;
    _request.interFace = "Feedback/AddFeedback";
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        layer.msg(result.Message);
        $('#myModal').modal('hide');
    };
    _request.doRequest();
}
//提交个人资料
function Do_Submit_ProfileEdit(){
    var _sender = {nickName:"",phone:"",QQ:"",email:""};
    $("#myForm input").each(function(i,el){
        switch (i){
            case 1:{
                _sender.nickName = $(el).val();
            }break;
            case 2:{
                _sender.phone = $(el).val();
            }break;
            case 3:{
                _sender.email = $(el).val();
            }break;
            case 4:{
                _sender.QQ = $(el).val();
            }break;
        }
    });
    if(_sender.nickName.length == 0){
        layer.msg("请填写昵称");
        return;
    }
    if(_sender.phone.length == 0){
        layer.msg("请填写电话或手机");
        return;
    }else{
        if(checkPhoneFormat(_sender.phone) == false){
            layer.msg("电话或手机格式不正确");
            return;
        }
    }
    if(_sender.email.length == 0){
        layer.msg("请填写邮箱");
        return;
    }else{
        var myreg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
        if(!myreg.test(_sender.email)){
            layer.msg("邮箱格式不正确");
            return ;
         }
    }

    if(_sender.QQ.length == 0){
        layer.msg("请填写昵称");
        return;
    }

    var _request = MakeHTTPRequest("POST");
    _request.interFace = "Member/ModifyMemberInfo";
    _request.sender = _sender;
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        layer.msg(result.Message);
        $("#ProfileInfoList li").each(function(i,el){
            switch (i){
                case 1:{$(el).find("span").text(conn.sender.nickName);}break;
                case 2:{$(el).find("span").text(conn.sender.phone);}break;
                case 3:{$(el).find("span").text(conn.sender.email);}break;
                case 4:{$(el).find("span").text(conn.sender.QQ);}break;
            }

        });
        $('#myModal').modal('hide');

    }
    _request.doRequest();

}
function Do_GetSelfInfo(){
    var _request = MakeHTTPRequest("POST");
    _request.interFace = "Member/GetSelfInfo";
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        var _phone = result.Phone==null?"000-00000000":result.Phone;
        var _email= result.Email==null?"**@**.COM":result.Email;
        var _qq= result.QQ==null?"未定义":result.QQ;
        var _NickName = result.NickName == null?"未定义":result.NickName;
        var _UserName = result.UserName == null?"未定义":result.UserName;

        var _itemHTML = "";
        _itemHTML +='<li><label>用户</label> <span>'+_UserName+' </span> </li>';
        _itemHTML +='<li><label>昵称</label> <span>'+_NickName+'</span> </li>';
        _itemHTML +='<li><label>电话</label> <span>'+_phone+' </span> </li>';
        _itemHTML +='<li><label>邮箱</label> <span>'+_email+'</span> </li>';
        _itemHTML +='<li><label>QQ号</label> <span>'+_qq+'</span> </li>';
        $("#ProfileInfoList").html(_itemHTML);
    }
    _request.doRequest();
}

function Do_BankCardList(){
    Do_GetBankCardList(function (result) {
        var html = "";
        for(var i=0; i<result.Table.length;i++){
            html += MakeHtmlBankItem(result.Table[i]);
        }
        $(".ui-collection").prepend(html);
    })
}


//提交密码重设
function Do_Submit_PasswordReset(){
    //access/ChangeLoginPassword
    var _data = $("#myForm").serializeJSON();
    if(_data.oldPassword.length == 0){
        layer.msg("请输入原密码");
        return;
    }
    if(_data.newPassword.length == 0){
        layer.msg("请输入新密码");
        return;
    }
    if(_data.newPassword.length != _data.confirmPassword.length){
        layer.msg("两次输入的密码不一致");
        return;
    }

    var _request = MakeHTTPRequest("POST");
    _request.interFace = "access/ChangeLoginPassword";
    _request.sender = _data;
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        layer.msg(result.Message);
        $('#myModal').modal('hide');
    }
    _request.doRequest();
}
//提交银行卡
function Do_Submit_BankCardEdit(){
	var _data = $("#myForm").serializeJSON();
	if(_data.bankAccountName.length == 0){
        layer.msg("请输入银行账户名");
        return;
    }
    if(_data.bankAccountNumber.length == 0){
        layer.msg("请输入银行账号");
        return;
    }
    if(_data.bankName.length == 0){
        layer.msg("请输入银行名");
        return;
    }
    
    var _interFace;
    if(_data.bankCardId == 0){
    	_interFace = "BankCard/AddBankCard";
    }else{
    	_interFace = "BankCard/UpdateBankCard";
    }
    var _request = MakeHTTPRequest("POST");
    _request.interFace = _interFace;
    _request.sender = _data;
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        layer.msg(result.Message);
        Do_BankCardList();
        $('#myModal').modal('hide');
    };
    _request.doRequest();
    
}
//提交提现密码
function Do_Submit_DrawCashPasswordReset(){
//access/ChangeMoneyPassword
    var _data = $("#myForm").serializeJSON();
    if(_data.newPassword.length == 0){
        layer.msg("请输入支付密码");
        return;
    }
    if(_data.newPassword.length != _data.confirmPassword.length){
        layer.msg("两次输入的密码不一致");
        return;
    }
    var _request = MakeHTTPRequest("POST");
    _request.interFace = "access/ChangeMoneyPassword";
    _request.sender = _data;
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        layer.msg(result.Message);
        $('#myModal').modal('hide');
    };
    _request.doRequest();

}
//提交提现申请
function Do_Submit_DrawCash(){
    var _data = $("#myForm").serializeJSON();
    if(_data.amount.length == 0){
        layer.msg("请填写提现金额");
        return;
    }
    if(_data.moneyPassword.length == 0){
        layer.msg("请输入提现密码");
        return;
    }

    var _request = MakeHTTPRequest("POST");
    _request.interFace = "AccountChange/Withdraw";
    _request.sender = _data;
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        layer.msg(result.Message);
        UpdateBalance(result.Balance);
        $("#quota").text(result.Balance);
        $('#myModal').modal('hide');
    };
    _request.doRequest();
}

function Do_GetQuota() {
    var _request = MakeHTTPRequest("POST");
    _request.interFace = "Member/GetBalance";
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        $("#quota").text(result.Balance);
        $("#PKCoin").text(result.Balance);
        UpdateBalance(result.Balance);
    };
    _request.doRequest();
}
//提交提成点设置
function Do_Submit_Commission(){
    var _data = $("#myForm").serializeJSON();
    _data.commissionPercentage = parseFloat(_data.commissionPercentage);
    console.info(_data);

    var _request = MakeHTTPRequest('post');
    _request.interFace = "Team/SetCommissionPercentage";
    _request.sender = _data;
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        layer.msg(result.Message);
        $('#myModal').modal('hide');
    };
    _request.doRequest();
}
function Do_CheckCommissionPercent(el){
    var nubmer = el.value.replace(/[^\d+(\.\d+)?$]/g,'');///^\d+(\.\d+)?$/
    if(nubmer > 3){
        el.value = 3;
    }else{
        el.value = nubmer;
    }
}
function Do_CheckBetBuyMultiple(el){
    var nubmer = el.value.replace(/[^\d]/g,'');
    if(nubmer < 1){
        el.value = 1;
    }else{
        el.value = nubmer;
    }


    var _OrderType = $("#OrderType .active").index();
    Do_BetDataReload(_OrderType);
}
///通过选号 单选模式
function Ev_Ball(){
    $(".ball-rows").on("click",".ui-ball",function(e){
        var _Numbers = [];
        _Numbers.push($(this).index());
        var _OrderType = $("#OrderType .active").index();
        var _SortIndex = $(this).closest(".ball-row").index();
        var _UpdateType;

        if($(this).hasClass("active")){
            //取消这个号码
            $(this).removeClass("active");
            _UpdateType = 0;
        }else{
            //追加这个号码
            $(this).addClass("active");
            _UpdateType = 1;
        }

        $(this).closest(".ball-row").find(":radio").attr("checked",false);

        Do_BetUpdate(_Numbers,_OrderType,_SortIndex,0,_UpdateType);
        e.stopPropagation();
        e.preventDefault();
    });
}

///通过功能按钮 多选模式
function Do_BetUpdateWithFn(SortIndex,fnId){
    var _OrderType = $("#OrderType").find(".active:first").index();
    var _balls = $("#ball-rows > .ball-row").eq(SortIndex).find(".ui-ball");
    switch (fnId){
        case 1:{
            _balls.slice(0,5).removeClass('active');
            _balls.slice(-5).addClass('active');
            Do_BetUpdate([0,1,2,3,4],_OrderType,SortIndex,fnId,0);
            Do_BetUpdate([5,6,7,8,9],_OrderType,SortIndex,fnId,1);
        }break;
        case 2:{
            _balls.slice(-5).removeClass('active');
            _balls.slice(0,5).addClass('active');
            Do_BetUpdate([0,1,2,3,4],_OrderType,SortIndex,fnId,1);
            Do_BetUpdate([5,6,7,8,9],_OrderType,SortIndex,fnId,0);
        }break;
        case 3:{
            var _source = [0,1,2,3,4,5,6,7,8,9];
            _balls.addClass('active');
            Do_BetUpdate(_source,_OrderType,SortIndex,fnId,1);

        }break;
        case 4:{
            $("#ball-rows > .ball-row").eq(SortIndex).find(".ui-ball:odd").removeClass('active');//偶数
            $("#ball-rows > .ball-row").eq(SortIndex).find(".ui-ball:even").addClass('active');//奇数

            Do_BetUpdate([1,3,5,7,9],_OrderType,SortIndex,fnId,0);
            Do_BetUpdate([0,2,4,6,8],_OrderType,SortIndex,fnId,1);
        }break;
        case 5:{
            $("#ball-rows > .ball-row").eq(SortIndex).find(".ui-ball:even").removeClass('active');//奇数
            $("#ball-rows > .ball-row").eq(SortIndex).find(".ui-ball:odd").addClass('active');//偶数

            Do_BetUpdate([1,3,5,7,9],_OrderType,SortIndex,fnId,1);
            Do_BetUpdate([0,2,4,6,8],_OrderType,SortIndex,fnId,0);
        }break;
        case 6:{
            _balls.removeClass('active');
            $("#ball-rows > .ball-row").eq(SortIndex).find(":radio").attr("checked",false);
            Do_BetUpdate([0,1,2,3,4,5,6,7,8,9],_OrderType,SortIndex,fnId,0);
        }break;
    }
}
/*
* @Numbers : 选号数组,
* @OrderType : 订单类,
* @SortIndex : 排名,
* @SelectNumberFunctionId : 选号方法Id
* @UpdateType : 更新类型 1 =>添加选号   0 =>取消选号
* */
function Do_BetUpdate(Numbers,OrderType,SortIndex,SelectNumberFunctionId,UpdateType){
    var _betRow = $("#bet-rows .ui-table-row[data-type="+OrderType+"][data-index="+SortIndex+"]");
    var _betRowSize = _betRow.size();
    if(UpdateType == 0){
        //取消选号
        if(_betRowSize == 0) return;
        _betRow.find(".number").each(function(i,el){
            for(var j=0; j<Numbers.length;j++){
                if(Numbers[j]+1 == parseInt($(el).text())){
                    $(el).remove();
                    break;
                }
            }
        });

        var _betNumbers = _betRow.find(".number").size();

        if(_betNumbers == 0){
            _betRow.remove();
        }

    }else{
        //更新选号
        if(_betRowSize == 0){
            var _done = false;
            $("#bet-rows .ui-table-row[data-type="+OrderType+"]").each(function(i,el){
                var _sort = parseInt($(el).attr("data-index"));
                if(_sort > SortIndex){
                    $(el).before(MakeHtmlBetItem(OrderType,SortIndex));
                    _done = true;
                    return false;
                }
            });
            if(_done == false){
                $("#bet-rows").append(MakeHtmlBetItem(OrderType,SortIndex));
            }
            _betRow = $("#bet-rows .ui-table-row[data-type="+OrderType+"][data-index="+SortIndex+"]");
        }

        _betRow.find(".number").each(function(){
            var _distinct = true;
            var _val = parseInt($(this).text()) -1;
           for(var j=0; j<Numbers.length;j++){
               if(_val == Numbers[j]){
                   _distinct = false;
                   break;
               }
           }
            if(_distinct){
                Numbers.push(_val);
            }
        });
        Numbers.sort(compare);

        var _itemHtml = "";
        for(var i=0; i< Numbers.length; i++){
            _itemHtml += "<label class='number'>"+(Numbers[i] + 1)+"</label>";
        }
        _betRow.find("div[name=betSelectedNumbers]").html(_itemHtml);
    }
    _betRow.find("input[name=betSelectedOptionFn]").val(SelectNumberFunctionId);

    Do_BetDataReload(OrderType);
}

function Ev_RaceType(){
    $(".tab-category").on("click","li",function(e){
        e.stopPropagation();
        e.preventDefault();
        if($(this).hasClass("active")){
            return;
        }else{
            $(this).addClass("active").siblings().removeClass("active");
            var _targetLink = $(".segment-menu .segment-menu-item").eq(2).find("a");
            var _link = _targetLink.attr("href");
            var _Newlink =  _link.slice(0,-1);
            _Newlink += $(this).index();
            _targetLink.attr("href",_Newlink);

            if($(this).index() == 0){
                $("#gameLink").attr("href","game/index3.html");
            }else{
                $("#gameLink").attr("href","game/index.html");
            }
        }
        var _Race = new NSRace();
        _Race.removeRaceId();
        Do_GetCurrentRaceInfo();
    });
}

function Ev_OrderType(){

    $("#OrderType").on('click','button',function(e){
        //如果点击的是 已经是激活状态的自己
        if($(this).hasClass('active')){
            return;
        }
        //隐藏非当前模式的下注数据
        var _prevType = $(this).siblings('.active:first').index();
        $(".ui-table-row[data-type="+_prevType+"]").attr("enable","0").hide();

        //显示当前模式的下注数据
        var _type = $(this).index();
        var _tableHeaderItems = $("#bet-rows").prev().find("li");
        var _tableFooterItems = $("#bet-rows").next().find("li");

        if(_type == 0){
            _tableHeaderItems.eq(2).show();
            _tableHeaderItems.eq(3).show();
            _tableHeaderItems.eq(4).show();
            _tableFooterItems.eq(0).hide();
            _tableFooterItems.eq(1).hide();
        }else{
            _tableHeaderItems.eq(2).hide();
            _tableHeaderItems.eq(3).hide();
            _tableHeaderItems.eq(4).hide();
            _tableFooterItems.eq(0).show();
            _tableFooterItems.eq(1).show();
        }

        $(this).addClass('active').siblings().removeClass('active');
        var _showIndexEnd;
        switch (_type){
            case 1:{
                //冠亚
                _showIndexEnd = 2;
            }break;
            case 2:{
                //前三
                _showIndexEnd = 3;
            }break;
            case 3:{
                //前四
                _showIndexEnd = 4;
            }break;
            default:{
                //定胆
                $("#ball-rows > .ball-row").each(function(i,el){
                    $(el).show().find(".ui-ball").removeClass("active");
                    $(el).find(".ball-row-after").children("input[type=radio]").attr("checked",false);
                });
            }break;
        }
        if(_type >0){
            $("#ball-rows > .ball-row").each(function(i,el){
                $(el).find(".ball-row-after").children("input[type=radio]").attr("checked",false);

                if(i >= _showIndexEnd){
                    $(el).hide();
                }else{
                    $(el).show();
                }

                $(el).find(".ui-ball").removeClass("active");
            });
        }


        //重新呈现相关数据
        $(".ui-table-row[data-type="+_type+"]").attr("enable","1").show();
        Do_BetDataReload(_type,true);
    });
}

/*@OrderType: 定胆|冠亚|精选前三|精选前四*/
function Do_BetDataReload(OrderType){
    var _rows = $("#bet-rows .ui-table-row[data-type="+OrderType+"]");
    var _betArr = [];
    var _betObj = new BetCalculationModel();
    if(OrderType == 0){
        _rows.each(function(i,el){
            var _numbers = [];
            $(el).find(".number").each(function(){
                _numbers.push(parseInt($(this).text())-1);
            });
            var _price = parseFloat($(el).find("label[name=betModel]").attr("data-model"));
            var _items = parseInt($(el).find("input[name=betBuyMultiple]").val());
            var _itemTotal = (_price * _numbers.length * _items).toFixed(2);
            _betArr.push({numbers:_numbers,price:_price,times:_items});
            $(el).find("label[name=betItemTotal]").text(_itemTotal);

            //重置选号行样式
            if(arguments.length > 1){
                ReSetBallRowStyle($(el));
            }
        });
        _betObj.Static(_betArr);



    }else{
        _rows.each(function(i,el){
            var _numbers = [];
            $(el).find(".number").each(function(){
                _numbers.push(parseInt($(this).text())-1);
            });
            _betArr.push(_numbers);

            //重置选号行样式
            if(arguments.length > 1){
                ReSetBallRowStyle($(el));
            }

        });
         var _price = $("#bet-rows").next("#ui-table-footer").find("label[name=betModel]").attr("data-model");
        _price = parseFloat(_price);
        var _times = $("#bet-rows").next("#ui-table-footer").find("input[name=betBuyMultiple]").val();
        _times = parseInt(_times);
        _betObj.miniItems = OrderType+1;
        _betObj.Double(_betArr,_price,_times);
    }

    $("#bet-count").text(_betObj.count);
    $("#bet-total").text(_betObj.total.toFixed(2));

    //重置选号行样式闭包
    function ReSetBallRowStyle(JQBetRow){
        var _selectedRowIndex = parseInt(JQBetRow.attr("data-index"));//选号行索引
        var _selectedFnIndex = JQBetRow.find("input[name=betSelectedOptionFn]").val(); //选号方法
        var _ballRow = $("#ball-rows .ball-row").eq(_selectedRowIndex);
        if(0< parseInt(_selectedFnIndex) && parseInt(_selectedFnIndex) < 6){
            _ballRow.find(".ball-row-after").children("input[type=radio][value="+_selectedFnIndex+"]").trigger('click');
        }
        var _balls = _ballRow.find(".ui-ball");
        _balls.removeClass('active');
        JQBetRow.find("div[name=betSelectedNumbers]").children().each(function(i,el){
            var _ballIndex = parseInt($(el).text()) -1;
            _balls.eq(_ballIndex).addClass('active');
        });
    }
}


/*
* 下注模式变更
*  @modelVal => 模式价值,
*  @OrderType => 订单类型,
*  @BetIndex => 当前下注行索引
*  */
function Do_BetModelChanged(modelVal,OrderType,BetIndex){
    var _modelName;
    switch (modelVal){
        case 2:{
            _modelName = "元模式";
        }break;
        case 0.2:{
            _modelName = "角模式";
        }break;

        case 0.02:{
            _modelName = "分模式";
        }break;

    };
    var _label;
    if(OrderType == undefined){
        OrderType = $("#OrderType .active").index();

    }

    if(OrderType != undefined && BetIndex != undefined){
        var _row = $(".ui-table-row[data-type="+OrderType+"][data-index="+BetIndex+"]");
        _label = _row.find(".ui-table-cell").eq(4).find("label[name=betModel]");
    }else{
        _label = $("#bet-rows").next(".ui-table-footer").find("label[name=betModel]");
    }
    _label.text(_modelName).attr("data-model",modelVal);

    Do_BetDataReload(OrderType);
}

/*
* 倍数变化
*
*
* */
function UINumberInit(){
    $("#bet-rows,.ui-table-footer").on("click",".ui-number-input-before,.ui-number-input-after",function(e){
        var input = $(e.target).closest(".ui-number-input").find("input");
        var _val = input.val();

        if($(e.target).hasClass("ui-number-input-before")){
            if(_val == 1) return;
            _val--;
            input.val(_val);

        }
        else if($(e.target).hasClass("ui-number-input-after")){
            _val++;
            input.val(_val);

        }

        var _OrderType = $("#OrderType .active").index();
        Do_BetDataReload(_OrderType);

        e.stopPropagation();
        e.preventDefault();
    });
}

var _Timer = null;
function Do_TimerCountDown(timestamp,startTimestamp){
    if(_Timer){
        _Timer.invalidate();
        _Timer = null;
    }
    _Timer = new NSTimer();
    _Timer.endTime = timestamp;
    _Timer.startPlayTime = startTimestamp;
    _Timer.playStart = false;
    _Timer.repeats = true;
    _Timer.action = function(){
        var dieLine =  (_Timer.endTime - (new Date()).getTime())/1000;
        var playDieLine  = (_Timer.startPlayTime - (new Date()).getTime())/1000;
        if((playDieLine > 0 && playDieLine < 5) && _Timer.playStart == false){
            Do_ShowTimerCountDown();
        }

        if(playDieLine < 0 && _Timer.playStart == false){
            $("#ShowTimerCountDown").remove();
            //已经到了截至日期
            _Timer.playStart = true;
            Do_GetRactResult();
        }
        if(dieLine < 0){
            Do_GetLastRaceWinnerList();
            _Timer.invalidate();
            _Timer = null;
            //已开奖读取下一场的信息
            Do_GetCurrentRaceInfo();
        }else{
            var day = Math.floor(dieLine/(60*60*24));
            var hour = Math.floor((dieLine-day*24*60*60)/3600);
            hour = hour < 10 ?"0"+hour:hour;
            var minute = Math.floor((dieLine-day*24*60*60-hour*3600)/60);
            minute = minute < 10 ?"0"+minute:minute;
            var second = Math.floor(dieLine-day*24*60*60-hour*3600-minute*60);
            second = second < 10 ?"0"+second:second;

            //console.log("开奖倒计时："+day+"天"+hour+"小时"+minute+"分"+second+"秒");
            $(".ui-panel-timedown > .ui-panel-content").text(hour+":"+minute+":"+second);
        }
    };
    _Timer.fireDate();
}
function Do_ShowTimerCountDown(){
    var div = $("#ShowTimerCountDown");
    if(div.size() == 0){
        $("<div id='ShowTimerCountDown'>已到截止时间，停止下单</div>").appendTo('body').css({
            position:"absolute ",
            top:"50%",left:"50%",
            margin:"-30px 0 0 -30px",
            color:"#ffffff",
            fontSize:"20px",
            width:280,height:60,
            lineHeight:"60px",
            textAlign:"center",
            backgroundColor:"#212121",
            borderRadius:30
        });
    }
}
function Do_GetRactResult(){
    var _Race = (new NSRace()).getRaceId();
    var _RaceNumber = _Race.RaceNumber;
    var _request = MakeHTTPRequest("POST");
    _request.interFace = "Race/GetRaceResult";
    _request.sender = {raceId:_Race.Id};
    _request.willRequest = null;
    _request.didRequestSucc = function(conn,result){
        console.info(result);
        var dieLine =  (_Race.EndRaceTime - (new Date()).getTime())/1000;
        if(conn.sender.raceId == _Race.Id){
            if(result.Message == "比赛尚未有结果"){
                if(dieLine < 0){
                    //已过开奖时间
                    alert("网络异常");
                }else{
                    conn.doRequest();
                }

            }else{
                $("#LastRaceNo1").text(_RaceNumber);
                Do_Play_Race(result,_Race.EndRaceTime);
            }
        }
    }
    _request.doRequest();

}

function Do_Play_Race(result,EndRaceTime) {
    var _arr = [];
    for(var key in result){
        if(key.indexOf("Place") > -1){
            _arr.push(result[key]);
        }
    }
    var dieLine =  (parseInt(EndRaceTime) - (new Date()).getTime())/1000;
    if(dieLine < 0){
        //直接开奖
        var _numberHTML = "";
        for(var kye in result){
            if(key.indexOf("Place") > -1){
                _numberHTML += '<span class="number">'+NSDateTimeUnitFormat(result[key])+'</span>';
            }
        }
        $("#LastRaceWinNumbers").empty().html(_numberHTML);
    }else{
        RacePlay(_arr,EndRaceTime);
    }
}
var _PlayTimer = null;
function RacePlay(ResultArr,EndRaceTime){
    _PlayTimer = setInterval(function () {
        var dieLine =  (parseInt(EndRaceTime) - (new Date()).getTime())/1000;
        if(dieLine < 0 ){
            clearInterval(_PlayTimer);
            _PlayTimer = null;

            var _html = "";
            for(var i=0;i<ResultArr.length;i++){
                _html += '<span class="number">'+NSDateTimeUnitFormat(ResultArr[i])+'</span>'
            }
            $("#LastRaceWinNumbers").empty().html(_html);
        }else{

            var StartArr = ResultArr.slice(0);
            StartArr.sort(function(){ return 0.5 - Math.random() })
            //展示过程
            var _html = "";
            for(var i=0;i<StartArr.length;i++){
                _html += '<span class="number">'+NSDateTimeUnitFormat(StartArr[i])+'</span>'
            }
            $("#LastRaceWinNumbers").empty().html(_html);
        }
    },1000);
}



function Do_GetCurrentRaceInfo(){
    Do_GetLastRaceWinnerList();

    if(_PlayTimer){
        clearInterval(_PlayTimer);
        _PlayTimer = null;
    }

    var _RaceType =  $(".tab-category > .active").index();
    var _RaceTypeName = _RaceType == 0?"3分":"1分";


    //判断是否超出截止时间
    /*
    var _Race = new NSRace();
    var _RaceId = _Race.getRaceId();
    if(_RaceId && _RaceId.raceType == _RaceTypeName){
        var dieLine =  (parseInt(_RaceId.EndRaceTime) - (new Date()).getTime())/1000;
        var buyDieLine = (parseInt(_RaceId.EndBuyTime) - (new Date()).getTime())/1000;
        if(buyDieLine < 0){
            Do_GetRactResult();
        }
        if(dieLine > 0){
            //倒数开奖
            $(".ui-panel-timedown > .ui-panel-title > b").text(_RaceId.RaceNumber);
            Do_TimerCountDown(parseInt(_RaceId.EndRaceTime),parseInt(_RaceId.EndBuyTime));
            return;
        }
    }
*/
    //超出截止时间 重新获取
    var _RaceType =  $(".tab-category > .active").index();
    var _RaceTypeName = _RaceType == 0?"3分":"1分";
    var _Request = MakeHTTPRequest('POST');
    _Request.interFace = "Race/GetCurrentRaceInfo";
    _Request.sender = {raceType:_RaceTypeName};
    _RaceType.willRequest = function(conn){
        if(_Timer){
            _Race.removeRaceId();
            _Timer.invalidate();
            $(".ui-panel-timedown > .ui-panel-content").text("00:00:00");
        }
    };
    _Request.didRequestSucc = function(conn,result){

        layer.closeAll("loading");
        delete result.Message;
        delete result.ResultId;
        result = $.extend(result,conn.sender);
        result.EndBuyTime = result.EndBuyTime.replace(/[^\d]/g,'');
        result.EndRaceTime = result.EndRaceTime.replace(/[^\d]/g,'');

        var _Race = (new NSRace()).setRaceId(JSON.stringify(result));
       // _Race.setRaceId(JSON.stringify(result));

        $("#LastRaceNo1").text(result.LastRaceNumber);
        var _lastNumbers = result.LastRaceResult.split(" ");
        var _lastNumberHTML = ""
        for(var i=0; i<_lastNumbers.length;i++){
            _lastNumberHTML +=  '<span class="number">'+ NSDateTimeUnitFormat(_lastNumbers[i])+'</span>';
        }
        $("#LastRaceWinNumbers").empty().html(_lastNumberHTML);

        $(".ui-panel-timedown > .ui-panel-title > b").text(result.RaceNumber.slice(9));
        Do_TimerCountDown(parseInt(result.EndRaceTime),parseInt(result.EndBuyTime));
    }
    _Request.doRequest();
}

function Do_BetClear(){
    $("#bet-rows").empty();
    $("#bet-count").text(0);
    $("#bet-total").text(0);
    $("#ball-rows .ui-ball").removeClass("active");
    $("#ball-rows :radio").attr("checked",false);
}

//下注

function Do_BetOrderAdd(){
    var _Race = new NSRace();
    var _RaceId = _Race.getRaceId();

    if(_RaceId == null){
        layer.msg('比赛参数丢失');
        return;
    }else{
        var dieLine =  (parseInt(_RaceId.EndBuyTime) - (new Date()).getTime())/1000;
        if(dieLine < 0){
            layer.msg('已过投注截至时间');
            return;
        }
    }

    var _betCount = parseInt($("#bet-count").text());
    if(_betCount == 0){
        layer.msg('投注数不能为 0');
        return;
    }


    var _orderType = $("#OrderType .active").index();
    var _request = MakeHTTPRequest("POST");
    if(_orderType == 0){
        var _ListSinglePlaceOrder = Do_GetBetStaticData();
        _request.interFace = "Order/AddSinglePlaceOrder";
        _request.sender = {raceId:_RaceId.Id,orderType:"定胆",ListSinglePlaceOrder:_ListSinglePlaceOrder};
    }else{
        var _listMultiPlaceOrder = Do_GetBeDoubletData();
        var _orderTypeName;
        switch (_orderType){
            case 1:{_orderTypeName = "冠亚"}break;
            case 2:{_orderTypeName = "精准前三"}break;
            case 3:{_orderTypeName = "精准前四"}break;
        }
        var _footer = $("#ui-table-footer");
        var _betCount = _footer.find("input[name=betBuyMultiple]").val();
        var _unit = (_footer.find("label[name=betModel]").text()).substr(0,1);
        _request.interFace = "Order/AddMultiPlaceOrder";
        _request.sender = {raceId:_RaceId.Id, orderType:_orderTypeName, unit:_unit, betCount :parseInt(_betCount),listMultiPlaceOrder:_listMultiPlaceOrder};
    }
    _request.didRequestSucc = function(conn,result){
        layer.closeAll("loading");
        layer.msg("下注成功!");
        if(result.hasOwnProperty("Balance")){
            UpdateBalance(result.Balance);
        }
        Do_BetClear();
    }
    _request.doRequest();
}
//获取定胆静态数据
function Do_GetBetStaticData(){
    var _arr = [];
    $("#bet-rows .ui-table-row[enable=1]").each(function(i,el){
       var _unit = ($(el).find("label[name=betModel]").text()).substr(0,1);
        var _betCount = parseInt($(el).find("input[name=betBuyMultiple]").val());
        var _betPlace = parseInt($(el).attr("data-index"))+1;
        var _bets = [];
        $(el).find(".number").each(function(){
            _bets.push(parseInt($(this).text()));
        });
        _arr.push({unit:_unit, betCount:_betCount, betPlace:_betPlace, bets:_bets});
    });
    return _arr;
}

//获取复式动态数据
function Do_GetBeDoubletData(){
    var _arr = [];
    $("#bet-rows .ui-table-row[enable=1]").each(function(i,el){
        var _bets = [];
        $(el).find(".number").each(function(){
            _bets.push(parseInt($(this).text()));
        });
        var _betPlace = parseInt($(el).attr("data-index"))+1;
        _arr.push({betPlace:_betPlace,bets:_bets});
    });
    return _arr;
}

function Do_SetDocumentTitleWithHref(selector){
    var fileName = GetFileNameFromURL();
    fileName = fileName == null?null:fileName.toLocaleLowerCase();
    if(selector == undefined){
        selector = $("#menuRect");
        selector.html(MakeHtmlUserCenterMenuList());
    }
    if(selector.length > 0){
        selector.find("a").each(function(){
    	    var targetName = ($(this).attr("href")).toLocaleLowerCase();
    		targetName = targetName.replace(/(.*\/)*([^.]+).*/ig,"$2");
    		if(targetName == fileName){
                var img = $(this).children("img");
                if(img.size() >0){
                    var imgPath = img.attr('src');
                    imgPath = Do_StringInsert(imgPath,"-selected",imgPath.indexOf("."));
                    img.attr('src',imgPath);
                }
    		    $(this).parent().addClass("active");
    			return false;
    		}
        });
    }
}
/*
 参数说明：str表示原字符串变量，flg表示要插入的字符串，sn表示要插入的位置
* */
function Do_StringInsert(str,flg,sn){
    var newstr= str.slice(0,sn);
    newstr += flg;
    newstr += str.slice(sn);
    return newstr;
}

function Do_CommonTurnPage_Request(interFace,sender,jsAction,nilAction){

    var _beginTime = null,_endTime = null;
    if(sender.hasOwnProperty("endTime")){
        var _endDate;
        if(sender.endTime){
            _endDate = new Date(parseInt(sender.endTime));
        }else{
            _endDate = new Date();
        }
        _endTime = _endDate.getFullYear() + "-" + (_endDate.getMonth()+1)+"-" + _endDate.getDate();

        var _beginDate;
        if(sender.hasOwnProperty('beginTime') && sender.beginTime != null){
            _beginDate = new Date(parseInt(sender.beginTime));
        }else{
            _beginDate = new Date(_endDate.getTime() - 30*24*3600*1000);
        }
        _beginTime = _beginDate.getFullYear() + "-" + (_beginDate.getMonth()+1)+"-" + _beginDate.getDate();

        sender.beginTime =  _beginTime;
        sender.endTime = _endTime;
    }


    var _request = MakeHTTPRequest('POST');
    _request.interFace = interFace;
    if(sender){
        _request.sender = sender;
    }
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();

        //创建页码
        if(result.PageCount > 1){
            if(conn.page == 1){
                if($("#turn-page").size() ==0){
                    $(".goldline-table").after(MakeHtmlPageNumbers(1,result.PageCount,false));
                }else{
                    $("#turn-page ul").html(MakeHtmlPageNumbers(conn.page,result.PageCount,true));
                }

            }else if(Math.floor(conn.page/10)*10+1 == conn.page && conn.page >1){
                $("#turn-page ul").html(MakeHtmlPageNumbers(conn.page,result.PageCount,true));
            }
        }else{
            $("#turn-page").remove();
        }

        if(result.Table.length > 0){
            jsAction(result.Table);
        }else{
            if(conn.page == 1){
                nilAction();
            }
        }


    }
    _request.doRequest();

    if(TurnPage == null){
        TurnPage = new turnPageComponet();
    }
    TurnPage.SEL = _request;
}

//充值列表
function Do_GetRechargeRecord(){
    var _beginTime = $("#date-picker1").val();
    var _endTime = $("#date-picker2").val();

    if(_endTime.length == 0){
        _endTime = null;
    }
    if(_beginTime.length == 0){
        _beginTime = null;
    }
    Do_CommonTurnPage_Request("AccountChange/GetRechargeList",
        {beginTime:_beginTime,endTime:_endTime},
        function(arr){
            var _tr = "";
            for(var i=0; i< arr.length;i++){
                var timestamp = parseInt(arr[i].EventTime.replace(/[^\d]/g,''));
                _tr += '<tr> ';
                _tr += '<td>微信</td> ';
                _tr += '<td class="red-font">'+arr[i].Amount+'</td> ';
                _tr += '<td>'+arr[i].Balance+'</td>';
                _tr += '<td>'+arr[i].Status+'</td>';
                _tr += '<td class="gray-font">'+NSDateTimeFormat(timestamp)+'</td>';
                _tr += '</tr>';
            }
            $(".goldline-table tbody").html(_tr);
    },function(){
        $(".goldline-table tbody").html("<tr><td colspan='5'>暂无充值记录</td></tr>");
    });
}

//提现记录
function Do_GetDrawCashRecord(){
    var _beginTime = $("#date-picker1").val();
    var _endTime = $("#date-picker2").val();

    if(_endTime.length == 0){
        _endTime = null;
    }
    if(_beginTime.length == 0){
        _beginTime = null;
    }
    Do_CommonTurnPage_Request("AccountChange/GetWithdrawList",
        {beginTime:_beginTime,endTime:_endTime},
        function(arr){
            var _tr = "";
            for(var i=0; i< arr.length;i++){
                 var timestamp = parseInt(arr[i].EventTime.replace(/[^\d]/g,''));

                _tr += '<tr> ';
                _tr += '<td>仓位</td> ';
                _tr += '<td class="red-font">'+arr[i].Amount+'</td> ';
                _tr += '<td>'+arr[i].Balance+'</td>';
                _tr += '<td>'+arr[i].Status+'</td>';
                _tr += '<td class="gray-font">'+NSDateTimeFormat(timestamp)+'</td>';
                _tr += '</tr>';
            };
            $(".goldline-table tbody").html(_tr);
    },function(){
        $(".goldline-table tbody").html("<tr><td colspan='5'>暂无提现记录</td></tr>");
    });
}

//仓位明细
function Do_GetPricesDetail(){
    var _beginTime = $("#date-picker1").val();
    var _endTime = $("#date-picker2").val();
    if(_beginTime.length == 0){
        _beginTime = null;
    }
    if(_endTime.length == 0){
        _endTime = null;
    }
    //var arg = [];
    //$(".btn-group").each(function(i,el){
    //    arg.push($(el).find('label[name=DrawCashType]').text());
    //});

    var _type = $(".btn-group:first").find('label[name=DrawCashType]').text();
    var _status = $(".btn-group:last").find('label[name=DrawCashType]').text();

    _type = _type=="全部"?"":_type;
    _status = _status == "全部"?"":_status;

    Do_CommonTurnPage_Request("AccountChange/GetAccountChangeList",
        {
            endTime:_endTime,
            beginTime:_beginTime,
            accountChangeType:_type,
            status:_status
        },
        function(arr){
        var _tr = "";
        for(var i=0; i< arr.length;i++){
            var timestamp = parseInt(arr[i].EventTime.replace(/[^\d]/g,''));
            _tr += '<tr>';
            _tr += '<td>'+arr[i].AccountChangeType+'</td>';
            _tr += '<td>'+arr[i].Amount+'</td>';
            _tr += '<td>'+arr[i].Balance+'</td>';
            _tr += '<td>'+arr[i].Status+'</td>';
            _tr += '<td>'+NSDateTimeFormat(timestamp)+'</td>';
            _tr += '</tr>';
        };
        $(".goldline-table tbody").html(_tr);
    },function(){
        $(".goldline-table tbody").html("<tr><td colspan='5'>暂无仓位明细</td></tr>");
    });
}

function Do_DrawCashTypeChanged(btnGroupIndex,val){
    $(".btn-group").eq(btnGroupIndex).find('label[name=DrawCashType]').text(val);
    Do_GetPricesDetail();
}


//比赛结果列表

function Do_GetRaceResultList(PKType){
    var _PKName = PKType == 0?"3分":"1分";
    var _request = MakeHTTPRequest('POST');
    _request.interFace = "Race/GetRaceResultList";
    _request.sender = {raceType:_PKName}
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        if(result.PageCount > 1){
            if(conn.page == 1){
                if($("#turn-page").size() == 0){
                    $(".goldline-table").after(MakeHtmlPageNumbers(1,result.PageCount,false));
                }else{
                    $("#turn-page ul").html(MakeHtmlPageNumbers(conn.page,result.PageCount,true));
                }

            }else if(Math.floor(conn.page/10)*10+1 == conn.page){
                $("#turn-page ul").html(MakeHtmlPageNumbers(conn.page,result.PageCount,true));
            }
        }
        var _Now = new Date();
        if(result.Table.length > 0){

            var _tr = "";
            for(var i=0; i< result.Table.length;i++){
                var numbers = (result.Table[i].Place).split(' ');
                var endRaceTime = new Date(parseInt(result.Table[i].EndRaceTime.replace(/[^\d]/g,'')));
                if(_Now.getTime() < endRaceTime){
                    continue;
                }
                _tr +='<tr>';
                _tr +='<td>'+result.Table[i].RaceNumber+'</td>';
                for(var j=0; j<numbers.length; j++){
                _tr +='<td>';
                    _tr +='<span class="number">'+numbers[j]+'</span>';
                _tr +='</td>';
                }
                _tr +='<td>'+endRaceTime.getFullYear()+'/'
                    +NSDateTimeUnitFormat(endRaceTime.getMonth()+1)
                    +'/'+NSDateTimeUnitFormat(endRaceTime.getDate())
                    +'  '+NSDateTimeUnitFormat(endRaceTime.getHours())+':'
                    +NSDateTimeUnitFormat(endRaceTime.getMinutes())+ '</td>';
                _tr +='</tr>';
            };
            $(".goldline-table tbody").html(_tr);
        }else{
            if(conn.page == 1){
                $(".goldline-table tbody").html("<tr><td colspan='3'>暂无开奖记录</td></tr>");
            }
        }
    }
    _request.doRequest();
    if(TurnPage == null){
        TurnPage = new turnPageComponet();
    }
    TurnPage.SEL = _request;
}


//订单列表
function Ev_OrderSearch(){
    $(".ui-search-bar").on('click','button',function(e){
        e.stopPropagation();
        e.preventDefault();
        var _RaceNumber = $(e.target).prev('input').val();
        if(_RaceNumber.length == 0){
            layer.msg("请输入购买期号");
            return;
        }
        Do_GetOrderList({raceNumber:_RaceNumber});
    });
}
function Do_GetOrderList(){
    var sender = {};
    if(arguments.length >0){
        sender = arguments[0];
    }
    Do_CommonTurnPage_Request("Order/GetOrderList",sender,function(arr){
        var _tr = "";
        var _betBalls,_buyBalls,endRaceTime,WonAmount;


        for(var i=0; i<arr.length; i++){
            WonAmount = arr[i].WonAmount==null?"0.00":arr[i].WonAmount;
            endRaceTime = new Date(parseInt(arr[i].EndRaceTime.replace(/[^\d]/g,'')));
            _betBalls = (arr[i].Place).split(" ");
            _buyBalls = (arr[i].Bet).split(" ");
        _tr +='<tr>';
        _tr +='<td>'+arr[i].RaceNumber+'期</td>';
        _tr +='<td >';
        for(var j=0; j<_betBalls.length; j++){
            _tr +='<span class="number">'+_betBalls[j]+'</span>';
        }


        _tr +='</td>';
           /*
        _tr +='<td>';
            for(var n=0; n<_buyBalls.length; n++){
                if(parseInt(_buyBalls[n]) > 0){
                    _tr +='<span class="number">'+_buyBalls[n]+'</span>';
                }
            }
        _tr +='</td>';
           */
        _tr +='<td>';
            _tr += arr[i].Status;
        _tr +='</td>';
        _tr +='<td>';
        _tr +='<span class="number">'+WonAmount+'</span>';
        _tr +='</td>';
        _tr +='<td>'+arr[i].OrderType+'</td>';
        _tr +='<td>'+parseFloat(arr[i].BetAmount).toFixed(2)+'</td>';
        _tr +='<td>'+arr[i].RaceType+'PK</td>';
        _tr +='<td>'+endRaceTime.getFullYear()
            +'/'+NSDateTimeUnitFormat(endRaceTime.getMonth()+1)
            +'/'+NSDateTimeUnitFormat(endRaceTime.getDate())
            +'  '+NSDateTimeUnitFormat(endRaceTime.getHours())
            +':'+NSDateTimeUnitFormat(endRaceTime.getMinutes())+ '</td>';
        _tr +='<td>';
        _tr +='<a href="#" data-toggle="modal" data-target="#myModal" data-whatever="OrderDetail" data-id="'+arr[i].Id+'">查看</a>';
        _tr +='</td>';
        _tr +='</tr>';
        }
        $(".goldline-table tbody").html(_tr);
    },function(){
        $(".goldline-table tbody").html("<tr><td colspan='9'>暂无购买记录</td></tr>");
    });
}

function Do_GetOrderListWithRaceType(val){
    $("#RectTypeGroup  label[name=RaceType]").text(val);
    var sender = {};
    switch (val){
        case"3分":
        case"1分":{
             sender = {raceType:val};
        }break;
        case"中奖":{
            sender = {won:true};
        }break;
        case"未中奖":{
            sender = {won:false};
        }break;
    }
    $(".goldline-table tbody").html("<tr><td colspan='9'>暂无"+val+"记录</td></tr>");
    Do_GetOrderList(sender);
}

function Do_GetLastRaceWinnerList(){
    var _RaceType =  $(".tab-category > .active").index();
    var _PKName = _RaceType == 0?"3分":"1分";
    var _request = MakeHTTPRequest('POST');
    _request.interFace = "Race/GetRaceResultList";
    _request.sender = {raceType:_PKName}
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        if(result.Table.length > 0){
            var _count = Math.min(6,result.Table.length);
            var _tr = "";
            for(var i=0; i< _count;i++){
                var numbers = (result.Table[i].Place).split(' ');
                _tr +='<tr><td>'+ result.Table[i].RaceNumber.slice(9)+'</td><td>';
                for(var j=0; j<numbers.length; j++){
                    if(j == numbers.length-1){
                        _tr +='<span >'+numbers[j]+'</span>';
                    }else{
                        _tr +='<span >'+numbers[j]+',</span>';
                    }
                    //_tr +='<span >'+numbers[j]+'</span>';

                }
                _tr +='</td></tr>';
            };
            $("#LastRaceWinnerList").html(_tr);
        }else{
            if(conn.page == 1){
                $("#LastRaceWinnerList").html("<tr><td>暂无开奖记录</td></tr>");
            }
        }
    }
    _request.doRequest();

}
function Ev_TeamMember(){
    $(".ui-tool-bar input[type=button]").on("click",function(e){
        var _data = $("#search-form").serializeJSON();
        Do_GetTeamMemberList(_data);
    });
}

function Do_GetTeamMemberList(){
    var _request = MakeHTTPRequest('POST');
    _request.interFace = "Team/GetTeamMemberList";
    if(arguments.length > 0){
        _request.sender = arguments[0];
    }
    _request.didRequestSucc = function(conn,result){
        if(result.PageCount > 1){
            if(conn.page == 1){
                if($("#turn-page").size() == 0){
                    $(".goldline-table").after(MakeHtmlPageNumbers(1,result.PageCount,false));
                }else{
                    $("#turn-page ul").html(MakeHtmlPageNumbers(conn.page,result.PageCount,true));
                }

            }else if(Math.floor(conn.page/10)*10+1 == conn.page){
                $("#turn-page ul").html(MakeHtmlPageNumbers(conn.page,result.PageCount,true));
            }
        }

        if(result.Table.length > 0){
            var _tr = "";
            for(var i=0; i< result.Table.length;i++){
                _tr+='<tr>';
                _tr+='<td>'+result.Table[i].UserName+'</td>';
                _tr+='<td class="red-font">'+result.Table[i].Balance+'</td>';
                _tr+='<td>'+result.Table[i].CommissionPercentage+'%</td>';
                _tr+='<td class="gray-font">'+NSDateTimeFormat(parseInt(result.Table[i].LastOnlineTime.replace(/[^\d]/g,'')))+'</td>';
                _tr+='<td>';
                _tr+='<button class="ui-button-goldline" data-toggle="modal" data-target="#myModal" data-whatever="Commission">返点比例</button>';
                _tr+='</td>';
                _tr+='</tr>';
            };
            $(".goldline-table tbody").html(_tr);
        }else{
            if(conn.page == 1){
                $(".goldline-table tbody").html("<tr><td colspan='5'>暂无队员记录</td></tr>");
            }
        }


        layer.closeAll();
    }
    _request.doRequest();
    if(TurnPage == null){
        TurnPage = new turnPageComponet();
    }
    TurnPage.SEL = _request;
}

function Do_GetMessageList(sender){
    var _request = MakeHTTPRequest("POST");
    _request.interFace = "Message/GetMessageList";
    if(sender){
        _request.sender = sender;
    }
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        if(result.PageCount > 1){
            if(conn.page == 1){
                if($("#turn-page").size() == 0){
                    $("#PageTableView").after(MakeHtmlPageNumbers(1,result.PageCount,false));
                }else{
                    $("#turn-page ul").html(MakeHtmlPageNumbers(conn.page,result.PageCount,true));
                }

            }else if(Math.floor(conn.page/10)*10+1 == conn.page){
                $("#turn-page ul").html(MakeHtmlPageNumbers(conn.page,result.PageCount,true));
            }
        };
        if(result.Table.length >0){
            var _tr = "";
            for(var i=0; i< result.Table.length; i++){
                _tr += MakeHtmlNewsItem(result.Table[i]);
            }
            $("#PageTableView").html(_tr);
        }else{
            if(conn.page == 1){
                $("#PageTableView").html("<li><p align='center'>暂无消息</p></li>")
            }
        }
    }
    _request.doRequest();

    if(TurnPage == null){
        TurnPage = new turnPageComponet();
    }
    TurnPage.SEL = _request;

}

function Do_NewsSetReadAll(){
    var _ids = [];
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); /*构造一个含有目标参数的正则表达式对象*/
    $("#PageTableView a").each(function(){
        var _link = $(this).attr("href");
        var r = _link.match(reg);  /*匹配目标参数*/
        _ids.push(unescape(r[2]));
    });

    if(_ids.length == 0)return;

    var _request = MakeHTTPRequest('POST');
    _request.interFace = "Message/MarkAsRead";
    _request.sender = {msgId:_ids[0]};
    _request.didRequestSucc = function(conn,result){
        _ids.shift();
        if(_ids.length > 0){
            conn.sender = {msgId:_ids[0]};
            conn.doRequest();
        }else{
            layer.closeAll();
        }
    };
    _request.doRequest();
}

function Do_NewsRemoveAll(){
    var _request = MakeHTTPRequest('POST');
    _request.interFace = "Message/DeleteAllMsg";
    _request.didRequestSucc = function(conn,result){
        $("#PageTableView").empty();
        $("#turn-page").remove();
        layer.closeAll();
    };
    _request.doRequest();
}

function Ev_Message(){
    $("#Btn_Search").on('click',function(e){
        var _keyword = $(e.target).prev("input").text();
        if(_keyword.length == 0){
            layer.msg("请输入关键字");
            return;
        }
        var _NewsCategory = GetURLParam("Category");
        var _sender = {keyword:_keyword};
        if(_NewsCategory != null){
            _sender = {keyword:_keyword,newsType:1};
        }
        Do_GetMessageList(_sender);
    });

    $("#buttons").on('click','button',function(e){
        var _index = $(this).index();
        switch (_index){
            case 0:{
                Do_NewsSetReadAll();
            }break;
            case 1:{
                Do_NewsRemoveAll();
            }break;
        }
    });
}

function Do_GetMessage(){
    var _msgId = GetURLParam("id") || "0";
    var _request = MakeHTTPRequest('POST');
    _request.interFace = "Message/GetMessage";
    _request.sender = {msgId:_msgId};
    _request.didRequestSucc = function(conn,result){
        $("#news-time").text(result.MsgTime);
        $("#news-content").text(result.MsgText);
        layer.closeAll();
    };
    _request.doRequest();
}

function Do_GetMyUnderMemberList(UserName,el){
    if(UserName.length == 0) return;
    var _request = MakeHTTPRequest('POST');
    _request.interFace = "AccountChange/SearchMember";
    _request.sender = {userName:UserName};
    _request.willRequest = function(conn,result){
        var _count =  el.find(".popMenuView").length;
        if(_count == 0){
            var _html = "<div class='popMenuView'>" +
                //"<div class='popMenuViewHeader'><span>点击加载上一页</span> </div>" +
                "<div class='popMenuViewContent'></div>" +
                //"<div class='popMenuViewFooter'><span>点击加载下一页</span> </div>" +
                "</div>";
            $("#targetUserList").append(_html);
        }else{
            el.find(".popMenuView").fadeIn('fast');
        }
    }
    _request.didRequestSucc = function(conn,result){
        var _html = "";
        if(result.Table.length > 0){
            for(var i=0; i<result.Table.length; i++){
                _html +="<div class='popMenuViewCell'>";
                _html += result.Table[i];
                _html += "</div>";
            }

        }else{
            if(conn.page == 1){
                _html +="<div class='popMenuViewCell'> 你暂无下级用户";
                _html += "</div>";
            }else{
                _html +="<div class='popMenuViewCell'> 没有更多用户了";
                _html += "</div>";
            }
        }
        el.find(".popMenuViewContent").html(_html);

    };
    _request.doRequest();

    //if(TurnPage == null){
    //    TurnPage = new turnPageComponet();
    //}
    //TurnPage.SEL = _request;

};
function Ev_TransferAccount(){
    $("body").on('click',function(e){
       if($(e.target).closest('#targetUserList').length == 0){
           //关闭下拉菜单
           $("#targetUserList .popMenuView").fadeOut('fast');
       }else if($(e.target).closest('.popMenuViewContent').length > 0){
           //赋值
           var _val = $(e.target).text();
           $("#targetUserList input[name=targetUserName]").val(_val);
           $("#targetUserList .popMenuView").fadeOut('fast');
       }else if($(e.target).closest('.popMenuViewHeader').length > 0){
           //上一页
           TurnPage.prev();
       }else if($(e.target).closest('.popMenuViewFooter').length > 0){
           //下一页
           TurnPage.next();
       }
    });

    $("#myForm2 input[name=targetUserName]").on("keyup",function(e){
            var _keyword = $(this).val();
            var _el = $("#targetUserList");
            Do_GetMyUnderMemberList(_keyword,_el);
    });

    $("#btn_reset").on('click',function(e){
        $("#myForm2 input").val('');
    });
    $("#btn_submit").on('click',function(e){
       var _data =  $("#myForm2").serializeJSON();
        if(_data.targetUserName.length == 0){
            layer.msg("请输入对方用户名");
            return;
        }
        if(_data.amount.length == 0){
            layer.msg("请输入转账金额");
            return;
        }
        if(_data.moneyPassword.length == 0){
            layer.msg("请输入支付密码");
            return;
        }
        var _request = MakeHTTPRequest('POST');
        _request.interFace = "AccountChange/Transfer";
        _request.sender = _data;
        _request.didRequestSucc = function(conn,result){
            layer.closeAll();
            layer.msg(result.Message);
            UpdateBalance(result.Balance);
        };
        _request.doRequest();
    });
};

/*团队*/
function  Do_LoadTeamSummary(){
    var _beginTime = $("#date-picker").val();
    var _endTime = $("#date-picker2").val();

    var _request = MakeHTTPRequest('POST');
    _request.interFace = "Team/GetTeamSummary";
    //_request.sender = {beginTime:_beginTime,endTime:_endTime};
    _request.didRequestSucc = function(conn,result){
        for(var key in result){
            if($("#"+key).size() >0){
                if(typeof(result[key]) == "number"){
                    var _wan = parseInt(result[key] / 10000);
                    var _val = "";
                    if(_wan > 0){
                        _val += _wan+"万";
                    }
                    _val += result[key] % 10000;
                    $("#"+key).text(_val);
                }else{
                    $("#"+key).text(result[key])
                }
            }
        }
    };
    _request.doRequest();
}

function Do_GetTeamDataWith(interFace,jsAction,NilAction){
    var _beginTime = $("#date-picker").val();
    var _endTime = $("#date-picker2").val();
    var _request = MakeHTTPRequest('POST');
    _request.interFace = interFace;
    _request.sender = {beginTime:_beginTime,endTime:_endTime};
    _request.didRequestSucc = function(conn,result){
        layer.closeAll();
        if(result.PageCount > 0){
            if(conn.page == 1){
                if($("#turn-page").size() ==0){
                    $(".goldline-table").after(MakeHtmlPageNumbers(1,result.PageCount,false));
                }else{
                    $("#turn-page ul").html(MakeHtmlPageNumbers(conn.page,result.PageCount,true));
                }

            }else if(Math.floor(conn.page/10)*10+1 == conn.page && conn.page >1){
                $("#turn-page ul").html(MakeHtmlPageNumbers(conn.page,result.PageCount,true));
            }

            jsAction(result.Table);
        }else{
            $("#turn-page").remove();
            NilAction();
        }
    };
    _request.doRequest();

    TurnPage = new turnPageComponet();
    TurnPage.SEL = _request;
}

function Do_LoadTeamOrderList(){
    var _view = "";
    _view +='<table id="PageTableView" class="goldline-table">';
    _view +='<thead>';
    _view +='<tr>';
    _view +='<td>期数</td>';
    _view +='<td>购买金额</td>';
    _view +='<td>中奖金额</td>';
    _view +='<td>购买人数</td>';
    _view +='<td width="20%">开奖时间</td>';
    _view +='</tr>';
    _view +='</thead>';
    _view +='<tbody>';
    _view +='</tbody>';
    _view +='</table>';
    $("#TeamDataView").html(_view);

    Do_GetTeamDataWith("Team/GetTeamOrderList",function(arr){
        var _view = "";
        for(var i=0; i<arr.length; i++){
            var timestamp = arr[i].RaceTime.replace(/[^\d]/g,'');
            _view +='<tr>';
            _view +='<td>'+arr[i].RaceId+'</td>';
            _view +='<td class="red-font">'+NSDataNumberFormat(arr[i].BetAmount)+'</td>';
            _view +='<td>'+NSDataNumberFormat(arr[i].WonAmount)+'</td>';
            _view +='<td>'+arr[i].CountMember+'</td>';
            _view +='<td class="gray-font">'+NSDateTimeFormat(timestamp)+'</td>';
            _view +='</tr>';
        }
        $("#PageTableView tbody").html(_view);
    },function(){
        $("#PageTableView tbody").html("<tr><td colspan='5'>暂无数据</td></tr>");
    });

}

function Do_TeamRechargeList(){
    var _view = "";
    _view +='<table id="PageTableView" class="goldline-table">';
    _view +='<thead>';
    _view +='<tr>';
    _view +='<td>用户</td>';
    _view +='<td>充值金额</td>';
    _view +='<td>仓位</td>';
    _view +='<td width="20%">充值时间</td>';
    _view +='</tr>';
    _view +='</thead>';
    _view +='<tbody>';
    _view +='</tbody>';
    _view +='</table>';
    $("#TeamDataView").html(_view);
    Do_GetTeamDataWith("Team/GetTeamRechargeList",function(arr){
        var _view = "";
        for(var i=0; i<arr.length; i++){
            var timestamp = arr[i].EventTime.replace(/[^\d]/g,'');
            _view +='<tr>';
            _view +='<td>'+arr[i].UserName+'</td>';
            _view +='<td class="red-font">'+NSDataNumberFormat(arr[i].Amount)+'</td>';
            _view +='<td>'+NSDataNumberFormat(arr[i].Balance)+'</td>';
            _view +='<td class="gray-font">'+NSDateTimeFormat(timestamp)+'</td>';
            _view +='</tr>';
        }
        $("#PageTableView tbody").html(_view);
    },function(){
        $("#PageTableView tbody").html("<tr><td colspan='4'>暂无数据</td></tr>");
    });
}

function Do_TeamWithdrawList(){
    var _view = "";
    _view +='<table id="PageTableView" class="goldline-table">';
    _view +='<thead>';
    _view +='<tr>';
    _view +='<td>用户</td>';
    _view +='<td>提现金额</td>';
    _view +='<td>仓位</td>';
    _view +='<td width="20%">提现时间</td>';
    _view +='</tr>';
    _view +='</thead>';
    _view +='<tbody>';
    _view +='</tbody>';
    _view +='</table>';
    $("#TeamDataView").html(_view);
    Do_GetTeamDataWith("Team/GetTeamWithdrawList",function(arr){
        var _view = "";
        for(var i=0; i<arr.length; i++){
            var timestamp = arr[i].EventTime.replace(/[^\d]/g,'');
            _view +='<tr>';
            _view +='<td>'+arr[i].UserName+'</td>';
            _view +='<td class="red-font">'+NSDataNumberFormat(arr[i].Amount)+'</td>';
            _view +='<td>'+NSDataNumberFormat(arr[i].Balance)+'</td>';
            _view +='<td class="gray-font">'+NSDateTimeFormat(timestamp)+'</td>';
            _view +='</tr>';
        }
        $("#PageTableView tbody").html(_view);
    },function(){
        $("#PageTableView tbody").html("<tr><td colspan='4'>暂无数据</td></tr>");
    });
}


function Ev_Team(){
    $(".info-list:last span").on("click",function(e){
        if($(this).hasClass("active")){
            return;
        }
        $(this).addClass("active").removeClass('mark-red')
        var _id = $(this).attr("id");
        switch (_id){
            case "BetCountDetail":{
                $("#DrawDetail,#ReChangeDetail").removeClass('active').addClass('mark-red');
                Do_LoadTeamOrderList();
            }break;
            case "DrawDetail":{
                $("#BetCountDetail,#ReChangeDetail").removeClass('active').addClass('mark-red');
                Do_TeamWithdrawList();
            }break;
            case "ReChangeDetail":{
                $("#BetCountDetail,#DrawDetail").removeClass('active').addClass('mark-red');
                Do_TeamRechargeList();
            }break;
        }
    });

    $("#btn-search").on("click",function(e){
        var _id =  $(".info-list:last .active").attr("id");
        switch (_id){
            case "BetCountDetail":{
                Do_LoadTeamOrderList();
            }break;
            case "DrawDetail":{
                Do_TeamWithdrawList();
            }break;
            case "ReChangeDetail":{
                Do_TeamRechargeList();
            }break;
        }
    });
};