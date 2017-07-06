
$(function(){
	var pageId = $(".container").attr("id");
	var isNeedLogin = $(".container").attr("data-login");
	var myself = new NSUser();
	var URL = new NSURL();
	var _tokendb = myself.getUserToken();

	if(eval(isNeedLogin)){
		if(_tokendb == null){
			URL.push();
			self.location = "login.html";
		}
	}
	var _contentView = $(".flex-tabbar .flex-tabbar-item:last");
	_contentView.html(MakeHtmlHeaderMenuItems(_tokendb));

	eval(pageId+"Init()");

	$("body").append(MakeHtmlModal());
	Ev_Modal();
});

$("body").resize(function(e){
	var winHeight = $(window).height();
	var bodyHeight = $(document.body).height();
	if(bodyHeight > winHeight){
		$("body").addClass('OverSize');

	}else{
		$("body").removeClass('OverSize');

	}

});

$(window).resize(function() {
	Do_CheckScreenSize();
});

function Do_CheckScreenSize(){
	if($("#ui-table-footer").size() == 0) return;
	var top = $("#ui-table-footer").offset().top;
	var clientHeight = document.documentElement.clientHeight;
	if(top > clientHeight){
		$("#ui-table-footer").css({
			position: "fixed",
			bottom: 0,
			left: $(".ui-table").offset().left,
			width:$(".ui-table").width(),
			zIndex:99,
			backgroundColor:"rgba(0,0,0,.55)"
		});
	}else{
		$("#ui-table-footer").css({
			position: "static",
			width:"100%"
		});
	}
}

function PageIndexInit(){
	Do_GetCurrentRaceInfo();
	$(".segment-menu").html(MakeHtmlSegmentMenuItems());
	Do_SetDocumentTitleWithHref($(".segment-menu"));
	UINumberInit();
	Ev_RaceType();
	Ev_OrderType();
	$(".ball-rows").html(MakeHtmlBallRows());
	Ev_Ball();
	Do_CheckScreenSize();
}
function PageBuyRecordInit(){
	$(".segment-menu").html(MakeHtmlSegmentMenuItems());
	Do_SetDocumentTitleWithHref($(".segment-menu"));
	Do_GetOrderList();
	Ev_OrderSearch();
}
function PageLotteryRecordInit(){
	$(".segment-menu").html(MakeHtmlSegmentMenuItems());
	Do_SetDocumentTitleWithHref($(".segment-menu"));
	$("#LotteryType").on("click","button",function(e){
		e.stopPropagation();
		e.preventDefault();

		if($(this).hasClass("ui-button-red")){
			return;
		}
		$(this).addClass("ui-button-red").removeClass('gray-font').siblings().removeClass('ui-button-red').addClass('gray-font');

		var _type = $(this).index();
		Do_GetRaceResultList(_type);
	});

	var _Category = GetURLParam("Category") || 0;
	_Category = parseInt(_Category);
	$("#LotteryType button").eq(_Category).trigger('click');
}
function PageTeamInit(){
	$(".segment-menu").html(MakeHtmlSegmentMenuItems());
	Do_SetDocumentTitleWithHref($(".segment-menu"));

	$("#date-picker").fdatepicker();
	$("#date-picker2").fdatepicker();

	Do_LoadTeamSummary();
	Ev_Team();
	$("#BetCountDetail").trigger("click");
}

/*注册，忘记密码，登录*/
function PageRegInit(){

}
function PageForgetInit(){
	Do_GetQuestionList();
	Ev_Forget();
}
function PageLoginInit(){
	var act = GetURLParam("act");
	if(act == "out"){
		var myself = new NSUser();
		myself.removeUserToken();
	}

	$("#btn-submit").on('click',function(e){
		var _data = $(".login-form").serializeJSON();
		$(".ui-err").empty();
		if(_data.userName.length == 0){
			$(".ui-err").append("<li>请输入用户名</li>");
		}
		if(_data.password.length == 0){
			$(".ui-err").append("<li>请输入密码</li>");
		}

		var _request = MakeHTTPRequest('POST');
		_request.interFace = "Access/login";
		_request.sender = _data;
		_request.didRequestSucc = function(conn,result){
			delete result.ResultId;
			delete result.Message;

			console.info(result);
			var USER = new NSUser();
			USER.setUserToken(JSON.stringify(result));

			var URL = new NSURL();
			URL.go();
		}
		_request.doRequest()

	});
}

function PageMarketInit(){

}
function PageMainQuotaInit(){
	Do_SetDocumentTitleWithHref($(".segment-menu"));
	Do_GetQuota();
}

function PageTransferAccountsInit(){
	Do_SetDocumentTitleWithHref();
	//Do_GetMyUnderMemberList();
	Ev_TransferAccount();
}

/*用户中心 */
function PageProfileInit(){
	Do_SetDocumentTitleWithHref();
	//$("body").append(MakeHtmlModal());
	//Ev_Modal();

	Do_GetSelfInfo();
}

function PageBankCardListInit(){
	Do_SetDocumentTitleWithHref();
	//$("body").append(MakeHtmlModal());
	//Ev_Modal();
	Do_BankCardList();
	
}

function PagePriceDetailInit(){
	Do_SetDocumentTitleWithHref();
	//$("body").append(MakeHtmlModal());
	//Ev_Modal();
	Do_GetPricesDetail();
	Do_GetQuota();
	$("#date-picker").fdatepicker();
}

function PageQuotaInit(){
	Do_SetDocumentTitleWithHref();
	//$("body").append(MakeHtmlModal());
	//Ev_Modal();
	Do_GetQuota();

}

function PageRechargeRecordInit(){
	Do_SetDocumentTitleWithHref();
	Do_GetRechargeRecord();
	//$("body").append(MakeHtmlModal());
	//Ev_Modal();
	$("#date-picker").fdatepicker();
}

function PageDrawCashRecordInit(){
	Do_SetDocumentTitleWithHref();
	Do_GetDrawCashRecord();
	//$("body").append(MakeHtmlModal());
	//Ev_Modal();
	$("#date-picker").fdatepicker();
}

function PageTeamMemberInit(){
	Do_SetDocumentTitleWithHref();
	//$("body").append(MakeHtmlModal());
	//Ev_Modal();
	Ev_TeamMember();
	Do_GetTeamMemberList();
}

function PageNewsInit(){
	Do_SetDocumentTitleWithHref();
	$(".menu-list:last li:last").addClass("active");
	Do_GetMessage();
	//$("body").append(MakeHtmlModal());
	//Ev_Modal();
}

function PageNewsCenterInit(){
	Do_SetDocumentTitleWithHref();
	Do_GetMessageList();
	Ev_Message();
	//$("body").append(MakeHtmlModal());
	//Ev_Modal();
}