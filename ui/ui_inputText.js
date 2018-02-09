var Red = Red || {};

Red.InputText = (function ()
{
    function InputText(game)
    {
        this.game = game;
        this.input = null;
        this.onInputCall = null;
        this.parent = null;

        this.localPos = {};
        this.size = {};

        this.fontSize = 10;

        this.isActive = true;
    }


    InputText.prototype = {
        create : function (x, y, width, height, size, par, scrollStyleID, type)
        {
            this.localPos.x = x;
            this.localPos.y = y;
            this.size.x = width;
            this.size.y = height;
            this.fontSize = size;

            this.parent = par;
            type = type || "textarea";

            this.input = document.createElement( type );
            document.body.appendChild( this.input );

            //screenRate = (실제화면/게임뷰)
            //게임뷰 * screenRate  = 실제화면
            //실제화면 / screenRate  = 게임뷰

            if(scrollStyleID)
            {
                this.input.id = scrollStyleID;
            }

            this.input.style.position = 'absolute';
            this.input.style.border = "0px";
            this.input.style.color = "#ffffff";
            this.input.style["background-color"] = "transparent";
            this.input.style["font-size"] = this.fontSize + "px";
            this.input.style["resize"] = "none";
            //this.input.style["outline"] = "#00FF00 dotted thick";
            //this.input.style["outline-style"] = "dotted";
            this.input.style["outline-color"] = "#000000";
            this.input.style["outline-width"] = "0px";
            this.input.oninput = (function ()
            {
                this.onInputCall && this.onInputCall( this.input.value );
            }).bind(this);

            //console.log( this.input.style );

            //this.input.style["overflow"] = "hidden";
            //this.input.style["text-align"]  = "left";
            //this.input.style["vertical-align"]  = "top";
            //this.input.style["word-wrap"] = "break-word";

            this.bindResize = this.onResize.bind(this);
            this.game.signalManager.getSignal( Red.SYSTEMEVENT.OnWindowResize ).add( this.bindResize );
            this.onResize();

            this.game.actionsManager.addAfterRenderFunc( this.onResize.bind(this) );
        },

        destroy : function ()
        {
            this.game.signalManager.getSignal( Red.SYSTEMEVENT.OnWindowResize ).remove( this.bindResize );
            this.bindResize = null;
            document.body.removeChild( this.input );
            this.game = null;
            this.input = null;
            this.parent = null;
        },

        setPlaceholder : function (text)
        {
            this.input.placeholder = text;
        },

        setPassword : function ()
        {
            this.input.type = "password";
        },

        clear : function ()
        {
            this.input.value = "";
        },

        isClear : function ()
        {
            return this.input.value === "";
        },

        setText : function (text)
        {
            this.input.value = text;
        },

        getText : function ()
        {
            return this.input.value;
        },

        setColor : function (color)
        {
            this.input.style.color = color;
        },

        setActive : function (isActive)
        {
            //if(isActive === this.isActive) return;

            this.isActive = isActive;

            if( this.isActive )
            {
                this.input.style.display = "";
                this.game.actionsManager.addAfterRenderFunc( this.onResize.bind(this) );
            }
            else
            {
                this.input.style.display = "none";
            }
        },

        onResize : function ()
        {
            var rate = this.game.getScreenRate();

            this.input.style.left = ((this.parent.transform.worldTransform.tx + this.localPos.x) *  rate) + "px";
            this.input.style.top = ((this.parent.transform.worldTransform.ty + this.localPos.y) *  rate) + "px";
            this.input.style.width = (this.size.x * rate) + "px";
            this.input.style.height = (this.size.y * rate) + "px";
            this.input.style["font-size"] = (this.fontSize * rate) + "px";
        },
    };

    return InputText;
})();