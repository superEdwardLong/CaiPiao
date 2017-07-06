/**
 * Created by BOT01 on 2017/5/27.
 */
function MakeHtmlHeaderMenuItems(_tokendb){
    var _link = '<a href="#" data-toggle="modal" data-target="#myModal" data-whatever="Feedback">意见反馈</a>';
    _link +='<a href="Market.html">开放市场</a>';
    _link +='<a href="Profile.html">个人中心</a>';
    _link +='<a href="Newscenter.html?Category=1">系统公告</a>';
    _link +='<a href="#">在线客服</a>';
    _link +='<a href="#">联系我们</a>';
    if(_tokendb != null){
        _link +='<a href="#"><img src="img/icon-user.png">玩家：<span id="NickName">'+_tokendb.NickName+'</span></a>';
        _link +='<a href="login.html?act=out">退出</a>';
        _link +='<a href="#"><img src="img/icon-user.png">PK币：<span id="PKCoin">'+_tokendb.PKCoin+'</span></a>';
        _link +='<a href="newscenter.html"> <img src="img/icon-sms.png"> 消息：<span id="NewsCount">'+_tokendb.MessageCount+'</span></a>';
    }
    return _link;
}
function MakeHtmlSegmentMenuItems(){
    var _html = "";
    _html +='<div class="segment-menu-item ">';
    _html +='<a href="index.html"><img src="img/icon-pk.png" />首页</a>';
    _html +='</div>';
    _html +='<div class="segment-menu-item">';
    _html +='<a href="MainQuota.html"><img src="img/icon-drawCash.png" /> 充值提现</a>';
    _html +='</div>';
    _html +='<div class="segment-menu-item">';
    _html +='<a href="LotteryRecord.html?Category=0"><img src="img/icon-record.png" /> 开奖记录</a>';
    _html +='</div>';
    _html +='<div class="segment-menu-item">';
    _html +='<a href="BuyRecord.html"><img src="img/icon-buy-record.png" /> 购买记录</a>';
    _html +='</div>';
    _html +='<div class="segment-menu-item ">';
    _html +='<a href="Team.html"><img src="img/icon-reg.png" /> 代理注册</a>';
    _html +='</div>';
    _html +='<div class="segment-menu-item">';
    _html +='<a  href="#" data-toggle="modal" data-target="#myModal" data-whatever="Course">';
    _html +='<img src="img/icon-course.png" /> 新手教程';
    _html +='</a>';
    _html +='</div>';
    _html +='<div class="segment-menu-item">';
    _html +='<a  href="#" data-toggle="modal" data-target="#myModal" data-whatever="Issue"><img src="img/icon-feedback.png" /> 常见问题</a>';
    _html +='</div>';
    return _html;
}
function MakeHtmlPageNumbers(page,pageCount,isUpdate){
    if(isUpdate){
        $("#turn-page span:last").text("("+page+"/"+pageCount+")");
    }

    var beginPage = (Math.floor(page/10))*10 +1;
    var endPage = Math.min(beginPage+10,pageCount+1);

    var html = "";
    if(isUpdate == false){
        html += "<div class='ui-turnpage' id='turn-page'>";
        html += "<a href='javascript:TurnPage.prev()'>上一页</a>";
        html += "<ul>";
    }

    for(var i=beginPage;i<endPage;i++){
        if(page == i){
            html += "<li class='active'><a href='javascript:TurnPage.go("+i+")'> "+i+" </a></li>";
        }else{
            html += "<li><a href='javascript:TurnPage.go("+i+")'> "+i+" </a></li>";
        }
    }

    if(isUpdate == false){
    html += "</ul>";
    html += "<a href='javascript:TurnPage.next()'>下一页</a><span>("+page+"/"+pageCount+")</span>";
    html += "</div>";
    }

    return html;
}
function MakeHtmlBallRow(title,rowIndex){
    var html = ""
    html += '<div class="ball-row">';
    html += '<div class="ball-row-before">'+title+'</div>';
    html += '<div class="ball-row-content">';
    html += '<label class="ui-ball ui-ball-1 "></label>';

    html += '<label class="ui-ball ui-ball-2" ></label>';

    html += '<label class="ui-ball ui-ball-3 " ></label>';

    html += '<label class="ui-ball ui-ball-4"></label>';

    html += '<label class="ui-ball ui-ball-5"></label>';

    html += '<label class="ui-ball ui-ball-6" ></label>';

    html += '<label class="ui-ball ui-ball-7" ></label>';

    html += '<label class="ui-ball ui-ball-8 " ></label>';

    html += '<label class="ui-ball ui-ball-9" ></label>';

    html += '<label class="ui-ball ui-ball-10"></label>';
    html += '</div>';
    html += '<div class="ball-row-after">';
    html += '<input type="radio" name="ballOption-'+rowIndex+'" value="1" id="option-'+rowIndex+'-1"/>';
    html += '<label for="option-'+rowIndex+'-1" onclick="Do_BetUpdateWithFn('+rowIndex+',1)">大</label>';

    html += '<input type="radio" name="ballOption-'+rowIndex+'" value="2" id="option-'+rowIndex+'-2"/>';
    html += '<label for="option-'+rowIndex+'-2" onclick="Do_BetUpdateWithFn('+rowIndex+',2)">小</label>';

    html += '<input type="radio" name="ballOption-'+rowIndex+'" value="3" id="option-'+rowIndex+'-3"/>';
    html += '<label for="option-'+rowIndex+'-3" onclick="Do_BetUpdateWithFn('+rowIndex+',3)">全</label>';

    html += '<input type="radio" name="ballOption-'+rowIndex+'" value="4" id="option-'+rowIndex+'-4"/>';
    html += '<label for="option-'+rowIndex+'-4" onclick="Do_BetUpdateWithFn('+rowIndex+',4)">单</label>';

    html += '<input type="radio" name="ballOption-'+rowIndex+'" value="5" id="option-'+rowIndex+'-5"/>';
    html += '<label for="option-'+rowIndex+'-5" onclick="Do_BetUpdateWithFn('+rowIndex+',5)">双</label>';

    //html += '<input type="radio" name="ballOption-'+rowIndex+'" value="6" id="option-'+rowIndex+'-6"/>';
    html += '<label for="option-'+rowIndex+'-6" onclick="Do_BetUpdateWithFn('+rowIndex+',6)">清</label>';
    html += '</div>';
    html += '</div>';

    html += '</div>';
    return html;
}
function MakeHtmlBallRows(){
    var rows = ["冠军","亚军","季军","第四","第五","第六","第七","第八","第九","第十"];
    var html = "";
    for(var i=0; i<rows.length; i++){
        html += MakeHtmlBallRow(rows[i],i);
    }
    return html;
}
function MakeHtmlBetItem(OrderType,BetIndex){
    var typeName = ["定胆","冠亚","前三","前四"];
    var sortName = ["冠军","亚军","季军","第四","第五","第六","第七","第八","第九","第十"];

    var html = "";
    html +=' <div class="ui-table-row" data-type="'+OrderType+'" data-index="'+BetIndex+'" enable="1" >';
    html += '<input type="hidden" value="0" name="betSelectedOptionFn"/>'; //你使用选号方法【自定义|大|小|随|单|双】
    html +='<div class="ui-table-cell">';
    html +='<label>'+typeName[OrderType]+'</label><label>'+sortName[BetIndex]+'</label>';
    html +='</div>';
    html +='<div class="ui-table-cell" name="betSelectedNumbers">';
    //html +='<label class="number">2</label>';
    //html +='<label class="number">2</label>';
    //html +='<label class="number">2</label>';
    //html +='<label class="number">2</label>';
    html +='</div>';

    //非定胆模式，不显示 倍数，小计，价格模式
    if(OrderType == 0) {
        html +='<div class="ui-table-cell">';
        html +='<div class="ui-number-input">';
        html +='<div class="ui-number-input-before">-</div>';
        html +='<div class="ui-number-input-content"><input name="betBuyMultiple" type="text" value="1" readonly="readonly" /></div>';
        html +='<div class="ui-number-input-after">+</div>';
        html +='</div>';
        html +='</div>';

        html += '<div class="ui-table-cell">';
        html += '<label name="betItemTotal">2</label>';
        html += '</div>';
        html += '<div class="ui-table-cell">';
        html += '<div class="btn-group">';
        html += '<button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">';
        html += '<label data-model="2" name="betModel">元模式</label>';
        html += '<span class="caret"></span>';
        html += '</button>';
        html += '<ul class="dropdown-menu">';
        html += '<li><a href="javascript:Do_BetModelChanged(2,' + OrderType + ',' + BetIndex + ');">元模式</a></li>';
        html += '<li role="separator" class="divider"></li>';
        html += '<li><a href="javascript:Do_BetModelChanged(0.2,' + OrderType + ',' + BetIndex + ');">角模式</a></li>';
        html += '<li role="separator" class="divider"></li>';
        html += '<li><a href="javascript:Do_BetModelChanged(0.02,' + OrderType + ',' + BetIndex + ');">分模式</a></li>';
        html += '</ul>';
        html += '</div>';
        html += '</div>';
    }
    html +='<div class="ui-table-cell">';
    html +='<a href="javascript:Do_BetUpdateWithFn('+BetIndex+',6);">删除</a>';
    html +='</div>';
    html +='</div>';
    return html;
}
function MakeHtmlUserCenterMenuList(){
    var html = "";
    html += '<ul class="menu-list">';
    html += '<li ><a href="profile.html">个人资料</a></li>';
    html += '<li><a href="bankCardList.html">银行卡</a></li>';
    html += '<li><a href="quota.html">仓位资金</a></li>';
    html += '<li><a href="transferAccounts.html">转账</a></li>';
    html += '</ul>';
    html += '<div class="margin-top-90"></div>';
    html += '<ul class="menu-list">';
    html += '<li><a href="teamMember.html">团队成员</a></li>';
    html += '<li><a href="#" data-toggle="modal" data-target="#myModal" data-whatever="AddTeamMember">添加队员</a></li>';
    html += '<li><a href="pricesDetail.html">仓位明细</a></li>';
    html += '<li><a href="rechargeRecord.html">充值记录</a></li>';
    //html += '<li><a href="buyRecord.html">购买记录</a></li>';
    html += '<li><a href="drawCashRecord.html">提现记录</a></li>';
    //html += '<li><a href="#" data-toggle="modal" data-target="#myModal" data-whatever="Feedback">意见反馈</a></li>';
    //html += '<li><a href="#">在线客服</a></li>';
    //html += '<li><a href="newsCenter.html">消息中心</a></li>';
    html += '</ul>';
    return html;
}
function MakeHtmlNewsItem(db){
    var html="";
    html +='<li>';
    html +='<a href="news.html?id="'+db.Id+'>';
    html +='<div class="news-list-header">';
    html +='<span class="gold-font">提示通知:</span>';
    html +='<span class="gray-font">'+db.MsgTime+'</span>';
    html +='</div>';
    html +='<div class="news-list-content lightGray-font">';
    html += db.MsgText;
    html +='</div>';
    html +='</a>';
    html +='</li>';
    return html;

}
function MakeHtmlBankItem(db){
	var HTML = "";
	HTML += '<div class="ui-collection-cell">';
	HTML += '<ul class="ui-bank-item" data-toggle="modal" data-target="#myModal" data-whatever="BankCardEdit" data-id="'+db.Id+'">';
	HTML += '<li class="ui-bank-name">'+db.BankName+'</li>';
	//HTML += '<li class="ui-bank-subname">深圳蛇口支行</li>';
	HTML += '<li class="ui-bank-user">'+db.BankAccountName+'</li>';
	HTML += '<li class="ui-bank-number">'+db.BankAccountNumber+'</li>';
	HTML += '</ul>';
	HTML += '</div>';
	return HTML;
}
/* ==========================
 *模态视图
 ========================== */
var ModalDataOption = {
    modalSize:null,
    headerText:null,
    htmlInner:null,
    footerText:null
};

/*个人资料编辑*/
function MakeHtmlModal(){
    var html = "";
    html += '<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel">';
    html += '<div class="modal-dialog" role="document">';
    html += '<div class="modal-content">';
    html += '<div class="modal-header">';
    html += '<a class="btn-close" data-dismiss="modal" aria-label="Close">&nbsp;</a>';
    html += '<h4 class="modal-title" id="myModalLabel">Modal title</h4>';
    html += '</div>';
    html += '<div class="modal-body">';
    html += '<div class="modal-body-inner"></div>'
    html += '</div>';
    html += '<div class="modal-footer">';
    html += '<button type="button" class="btn btn-danger" data-dismiss="modal" onclick="javascript:Do_SaveWithModalType()">确定</button>';
    html += '<h4 class="modal-description" id="myModalDescription">Modal title</h4>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    html += '</div>';
    return html;
}

function MakeHtmlModalAddTeamMember(){
    var _table = "<form id='myForm' name='AddTeamMember'>";
    _table += "<ul  id='AddTeamMemberView'>";
    _table += "<li><label>登录帐号</label> <span><input type='text' name='userName' /></span> </li>";
    _table += "<li><label>登录密码</label> <span><input type='password' name='password' /></span> </li>";
    _table += "<li><label>昵称</label> <span><input type='text' name='nickName' /></span> </li>";
    _table += "<li><label>提成比例</label> <span><input type='text' name='commissionPercentage' /></span> </li>";
    _table += "</ul></form>";

    var _option = {
        modalSize:"modal-lg",
        headerText:"添加队员",
        htmlInner:_table,
        footerText:""
    }
    return _option;
}

/*订单详情*/
function MakeHtmlModalOrderDetail(){
    var _table = "";
    _table += "<table width='100%' align='center' id='OrderDetailView'>";
    _table += "<tr><td>会员名</td> <td><span name='UserName'></span></td> <td>状态</td> <td><span name='Status'></span></td></tr>";
    _table += "<tr><td>期号</td> <td><span name='RaceNumber'></span></td> <td>投注时间</td> <td><span name='BuyTime'></span></td></tr>";
    //_table += "<tr><td>游戏名称</td> <td><span></span></td> <td>动态奖金返点</td> <td><span></span></td></tr>";
   // _table += "<tr><td>期号</td> <td><span></span></td> <td>注单数</td> <td><span></span></td></tr>";
    _table += "<tr><td>定胆选号</td> <td colspan='3' ><span name='BetPlace'></span></td> </tr>";
    _table += "<tr><td>选号明细</td> <td colspan='3' ><span name='Bet'></span></td> </tr>";
    _table += "<tr><td>模式</td> <td><span name='Unit'></span></td> <td>倍数</td> <td><span name='BetCount'></span></td></tr>";
    _table += "<tr><td>下注金额</td> <td><span name='BetAmount'></span></td> <td>开奖号码</td> <td><span name='Place'></span></td></tr>";
    _table += "<tr><td>奖金</td> <td colspan='3'><span name='WonAmount'></span></td></tr>";
    _table += "</table>";

    var _option = {
        modalSize:"modal-lg",
        headerText:"订单详情",
        htmlInner:_table
    }
    return _option;
}

/*新手教程*/
function MakeHtmlModalCourse(e){
    var _option = {
        modalSize:"modal-lg",
        headerText:"新手教程",
        htmlInner:'<p align="center">这里是新手教程</p>'
    }
    return _option;
}
/*常见问题*/
function MakeHtmlModalIssue(e){
    var _option = {
        modalSize:"modal-lg",
        headerText:"常见问题",
        htmlInner:'<p align="center">这里是常见问题</p>'
    }
    return _option;
}
/*意见反馈*/
function MakeHtmlModalFeedback(e){
    var _option = {
        modalSize:"modal-lg",
        headerText:"意见反馈",
        htmlInner:'<form id="myForm" name="Feedback"><textarea id="FieldFeedback" placeholder="请输入您宝贵的意见" name="feedbackText"></textarea></form>',
        footerText:"您的宝贵意见，我们将会第一时间处理",
    }
    return _option;
}
/*个人资料编辑*/
function MakeHtmlModalProfileEdit(e){
    var _list = ($("#ProfileInfoList").html()).replace(/<span>(.*?)<\/span>/g,"<span><input type='text' value='$1' /></span>");
    var _form = "";
    _form += '<form id="myForm" name="ProfileEdit">';
    _form += '<ul>';
    _form += _list;
    _form += '</ul>';
    _form +='</form>';

    var _option = {
        headerText:"编辑个人信息",
        htmlInner:_form,
        footerText:""
    }
    return _option;
}
/*密码编辑*/
function MakeHtmlModalPasswordReset(e){
    var _form = "";
    _form += '<form id="myForm" name="PasswordReset">';
    _form += '<ul>';
    _form += '<li><label>原密码</label><span><input name="oldPassword" type="password" value="" placeholder="请输入原密码"/></span></li>';
    _form += '<li><label>新密码</label><span><input name="newPassword" type="password" value="" placeholder="请输入新密码"/></span></li>';
    _form += '<li><label>确认密码</label><span><input name="confirmPassword" type="password" value="" placeholder="请再次输入新密码"/></span></li>';
    _form += '</ul>';
    _form +='</form>';
    var _option = {
        headerText:"重置个人密码",
        htmlInner:_form,
        footerText:""
    }
    return _option;
}
/*银行卡编辑*/
function MakeHtmlModalBankCardEdit(e){
    var _form = "";
    _form += '<form id="myForm" name="BankCardEdit"><input type="hidden" value="0" name="bankCardId"/>';
    _form += '<ul>';
    _form += '<li><label>*卡号</label><span><input name="bankAccountNumber" type="text" value="" placeholder="请输入银行卡号"/></span></li>';
    _form += '<li><label>*开户行</label><span><input name="bankName" type="text" value="" placeholder="请输入开户行"/></span></li>';
    //_form += '<li><label>&nbsp;支&nbsp;&nbsp;&nbsp;&nbsp;行</label><span><input type="text" value="" placeholder="请输入开户行支行"/></span></li>';
    _form += '<li><label>*账户名</label><span><input name="bankAccountName" type="text" value="" placeholder="请输入帐户名"/></span></li>';
    _form += '</ul>';
    _form +='</form>';
    var _option = {
        headerText:"编辑银行卡",
        htmlInner:_form,
        footerText:"*项为必填"
    }
    return _option;
}
/*提现密码修改*/
function MakeHtmlModalDrawCashPasswordReset(e){
    var _form = "";
    _form += '<form id="myForm" name="DrawCashPasswordReset">';
    _form += '<ul>';
    _form += '<li><label>原有密码</label><span><input name="oldPassword" type="password" value="" placeholder="请输入原支付密码,初次设置可不填"/></span></li>';
    _form += '<li><label>支付密码</label><span><input name="newPassword" type="password" value="" placeholder="请输入支付密码"/></span></li>';
    _form += '<li><label>确认密码</label><span><input name="confirmPassword" type="password" value="" placeholder="请再次输入支付密码"/></span></li>';
    _form += '</ul>';
    _form +='</form>';
    var _option = {
        headerText:"重置支付密码",
        htmlInner:_form,
        footerText:"初次设置，填支付密码和确认密码即可"
    }
    return _option;
}

/*提现*/
function MakeHtmlModalDrawCash(e){
    var _form = "";
    _form += '<form id="myForm" name="DrawCash">';
    _form += '<ul>';
    _form += '<li><label>仓位资金</label><span><input name="quota" type="text" value="" readonly="readonly"/></span></li>';
    _form += '<li><label>提现资金</label><span><input name="amount" type="text" value="" placeholder="请输入提现金额"/></span></li>';
    _form += '<li><label>提现密码</label><span><input name="moneyPassword" type="text" value="" placeholder="请输入提现密码"/></span></li>';
    _form += '<li><label>收款卡号</label><span><select name="bankCardId">';

   // _form += '<option value="">JOHN 建设银行 6227***389</option>';
    //_form += '<option value="">JOHN 建设银行 6227***389</option>';

    _form += '</select></span></li></ul>';
    _form +='</form>';
    var _option = {
        headerText:"提现",
        htmlInner:_form,
        footerText:""
    }
    return _option;
}

/*提成*/
function MakeHtmlModalCommission(e){

    var _form = "";
    _form += '<form id="myForm" name="Commission">';
    _form += '<ul>';
    _form += '<li><label>下线用户</label><span><input type="text" value="" readonly="readonly" name="targetUserName"/></span></li>';
    _form += '<li><label>可用额度</label><span><input type="text" value="" placeholder="最大提成额度" name="maxQuota"/></span></li>';
    _form += '<li><label>提成额度</label><span><input type="text" value="" placeholder="请输入提成额度" name="commissionPercentage"/></span></li>';
    _form += '</ul>';
    _form +='</form>';
    var _option = {
        headerText:"提成点",
        htmlInner:_form,
        footerText:""
    }
    return _option;
}