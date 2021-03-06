var Red = Red || {};

Red.HttpManager = (function ()
{
    function HttpRequest()
    {
        this.httpRequest = null;
        // this.returnCall = null;
        this.sendTime = 0;
        this.requestCall = null;
        this.errorCall = null;

        this.key = undefined;

        if (window.XMLHttpRequest)
        { // 모질라, 사파리등 그외 브라우저, ...
            this.httpRequest = new XMLHttpRequest();
        }
        else if (window.ActiveXObject)
        { // IE 8 이상
            this.httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
        }

        this.httpRequest.onreadystatechange = this._onReadyStateChange.bind(this);
    }

    HttpRequest.prototype = {

        /**
         *
         * @param url
         * @param async true 비동기, false 동기
         * @param user
         * @param password
         * @param call
         * @private
         */
        _get : function ( url, async, user, password, call, errorCall, withCredentials)
        {
            if( typeof async === "function" )
            {
                call = async;
            }
            else if( typeof user === "function" )
            {
                call = user;
            }

            if(!async && typeof async !== "boolean" )
            {
                async = false;
            }


            if( call )
            {
                this.requestCall = call;
            }

            if( errorCall )
            {
                this.errorCall = errorCall;
            }

            this.httpRequest.open('GET', url, async, user, password );
            this.httpRequest.withCredentials = withCredentials || false;
            this.sendTime = Date.now();
            this.httpRequest.send(null);
        },

        _onReadyStateChange : function ()
        {
            if (this.httpRequest.readyState === 4)
            {
                var tt = Date.now() - this.sendTime;
                console.log("응답 시간 : " + tt + " ms");
                if (this.httpRequest.status === 200)
                {
                    this.requestCall && this.requestCall( this.httpRequest.responseText, this );
                    this.requestCall = null;
                }
                else
                {
                    console.log('There was a problem with the request.');
                    this.errorCall && this.errorCall( this );
                    this.errorCall = null;
                }
                //this.returnCall(this);
            }
        },
    };


    function HttpManager()
    {
        // this.pool = [];
        this.useObject = [];
        this.requests = {};
        this.allRequestComplateCall = null;     //인자로 this.requests 넘겨줌.
        this.allRequestComplateErrorCall = null;
    }

    HttpManager.prototype = {
        clear : function()
        {
            this.requests = {};
        },

        //개별적으로 리퀘스트 요청
        getRequest : function (url, async, user, password, call, errorCall, withCredentials)
        {
            var request = new HttpRequest();
            request._get( url, async, user, password, call, errorCall, withCredentials );
        },

        //리퀘스트를 추가만하고 요청은 안함.
        addRequest : function (key, url, user, password, withCredentials)
        {
            this.requests[key] = ( { url:url, async: true, user:user, password:password, text:undefined, withCredentials : withCredentials } );
        },


        //addRequest 함수로 추가했던 모든 리퀘스트를 동시에 요청. 끝나면 call 호출함.
        startRequest : function (call, errorCall)
        {
            this.allRequestComplateCall = call;
            this.allRequestComplateErrorCall = errorCall;

            var self = this;
            Object.keys(this.requests).forEach(function (key) {

                var data =  self.requests[key];
                var request = new HttpRequest();
                request.requestCall = self._returnRequest_all.bind(self);
                request.errorCall = self._returnError_all.bind(self);

                request.key = key;
                request._get( data.url, data.async, data.user, data.password, undefined, undefined, data.withCredentials );
                self.useObject.push( request );
            });
        },

        _returnRequest_all : function (text, request)
        {
            this.useObject.splice( this.useObject.indexOf(request), 1 );
            this.requests[ request.key ].text = text;
            if( this.useObject.length <= 0 )
            {
                this.allRequestComplateCall && this.allRequestComplateCall(this.requests);
            }
        },

        _returnError_all : function ( request )
        {
            this.useObject.splice( this.useObject.indexOf(request), 1 );
            if( this.useObject.length <= 0 )
            {
                this.allRequestComplateErrorCall && this.allRequestComplateErrorCall(this.requests);
            }
        }
    };

    return HttpManager;
})();
