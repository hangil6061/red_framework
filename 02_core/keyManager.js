var Red = Red || {};

Red.KeyManager = (function ()
{
    function KeyManager()
    {
        this.isDown = [];
        this.downCall = [];
        this.upCall = [];
        this.wheelCall = [];
        this.mouseDownCall = [];
        this.mouseUpCall = [];
    }

    KeyManager.prototype = {
        onKeyDown : function (e)
        {
            this.isDown[e.keyCode] = true;
            if(this.downCall.length > 0)
            {
                var arr = this.downCall;
                for( var i = 0; i < arr.length; i++ )
                {
                    arr[i](e);
                }
            }
        },
        
        onKeyUp : function (e)
        {
            this.isDown[e.keyCode] = false;
            if(this.upCall.length > 0)
            {
                var arr = this.upCall;
                for( var i = 0; i < arr.length; i++ )
                {
                    arr[i](e);
                }
            }
        },

        onWheel : function (e)
        {
            var arr = this.wheelCall;
            for( var i = 0; i < arr.length; i++ )
            {
                arr[i](e);
            }
        },

        addKeyDownCall : function (call)
        {
            this.downCall.push( call );
        },

        removeKeyDownCall : function (call)
        {
            var idx = this.downCall.indexOf( call );
            if( idx > -1 )
            {
                this.downCall.splice( idx,1 );
            }
        },

        onMouseDown : function (e)
        {
            var arr = this.mouseDownCall;
            for( var i = 0; i < arr.length; i++ )
            {
                arr[i](e);
            }
        },

        addMouseDownCall : function (call)
        {
            this.mouseDownCall.push( call );
        },

        removeMouseDownCall : function (call)
        {
            var idx = this.mouseDownCall.indexOf( call );
            if( idx > -1 )
            {
                this.mouseDownCall.splice( idx,1 );
            }
        },

        onMouseUp : function (e)
        {
            var arr = this.mouseUpCall;
            for( var i = 0; i < arr.length; i++ )
            {
                arr[i](e);
            }
        },

        addMouseUpCall : function (call)
        {
            this.mouseUpCall.push( call );
        },

        removeMouseUpCall : function (call)
        {
            var idx = this.mouseUpCall.indexOf( call );
            if( idx > -1 )
            {
                this.mouseUpCall.splice( idx,1 );
            }
        },

        addKeyUpCall : function (call)
        {
            this.upCall.push( call );
        },

        removeKeyUpCall : function (call)
        {
            var idx = this.upCall.indexOf( call );
            if( idx > -1 )
            {
                this.upCall.splice( idx,1 );
            }
        },

        addWheelCall : function (call)
        {
            this.wheelCall.push(call);
        },

        removeWheelCall : function (call)
        {
            var idx = this.wheelCall.indexOf( call );
            if( idx > -1 )
            {
                this.wheelCall.splice( idx,1 );
            }
        },

        isKeyDown : function (keyCode)
        {
            return !!this.isDown[ keyCode ];
        }
    };

    return KeyManager;
})();