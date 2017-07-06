/**
 * Created by BOT01 on 16/10/22.
 * http://www.jujod.com/race/api/access/login
 * ======= use =========
  var r = new window.HTTPPost() ||  new window.HTTPGet();
 //r.pageSize = 50;
 //r.pageIndex = 0;
  r.interFace = "getUserList";
  r.sender = {age:10,gender:1}
  r.willRequest = function(conn){};
  r.didRequestSucc = function(conn,result){};
  r.didRequestFailed = function(conn,string_err){};
  r.doRequest();
 * ======= use =========
 */


(function () {
    var HttpRequest = {
        pageSize:20,
        page:1,
        sender:null,
        apiPath:"/YiDaiShengShiApi/Api/",
        interFace:null,
        requestType:null,
        getData:null,
        token:null,
        state:0,
        willRequest:function(conn){
            console.log("即将向服务器发起请求。");
        },
        didRequestSucc:function(conn,result){
            console.log("服务器发起请求完成。");
        },
        didRequestFailed:function(conn,result){
            console.log("服务器发起请求失败。");
        },
        doRequest:function(){
            var that = this;

            if(that.state == 1){
                return;
            }

            //锁住请求
            that.state = 1;

            if(typeof that.willRequest == "function"){
                that.willRequest(that)
            }

            /*执行请求*/
            var _requestPath  = this.apiPath+this.interFace;
            var _requestParameter = this.getData();

			console.info(_requestParameter);
            console.log(_requestPath);

            $.ajax({
                type: that.requestType,
                dataType: "json",
                contentType: "application/json",
                data: _requestParameter,
                url: _requestPath,
                headers: { "Token": that.token },
                success: function (data) {
                    /*请求完成,开放请求*/
                    that.state = 0;
                    var result = eval(data);
                    /*执行失败回调 Status*/

                    if (result.ResultId != 0 && typeof that.didRequestFailed == "function") {
                        that.didRequestFailed(that, result);

                    }

                    /*执行成功回调*/
                    else if (result.ResultId == 0 && typeof that.didRequestSucc == "function") {
                        that.didRequestSucc(that, result);//回调
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
					console.log("status:"+XMLHttpRequest.status +"  readyState:"+ XMLHttpRequest.readyState +"  textStatus:"+ textStatus);
                    /*请求完成,开放请求*/
                    that.State = 0;
                    if (typeof that.didRequestFailed == "function") {
                        that.didRequestFailed(that, {Message:XMLHttpRequest.status+' 请求异常'});
                    }
                }
            });

        }
    };


    /*
    * */
    function Post(){
        this.requestType = "POST";
        this.getData = function(){
            var _data = {
               page:this.page,
               pageSize:this.pageSize
            };
            if(this.sender){
                _data = $.extend({},_data,this.sender);
            }
            return JSON.stringify(_data);
        }
    }
    Post.prototype = HttpRequest;


    /*
    * */
    function Get(){
        this.requestType = "GET";
        this.getData = function(){
            var _data = "";
            for(var item in this){
                switch(item){
                    case"sender":{
                        if(this[item]){
                            for(var p in this[item]){
                                _data += p+"="+this[item][p]+"&";
                            }
                        }
                    }break;
                    default:{
                        _data += item+"="+this[item]+"&";
                    }break;
                }
            }
            if(_data.length > 0){
                _data = _data.slice(0,-1);
            }
            return _data;
        }
    }
    Get.prototype = HttpRequest;


    window["HTTPPost"] =  Post;
    window["HTTPGet"]  =  Get;
})();