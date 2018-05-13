var Red = Red || {};

Red.Client = (function ()
{
    function Client(game)
    {
        this.game = game;
        this.ws = null;
        this.isConnected = false;
        this.address = "";

        this.onOpenCall = null;
        this.onMessageCall = null;
        this.onCloseCall = null;
    }

    Client.prototype = {
        create : function (address, messageCall, openCall, closeCall)
        {
            this.isConnected = false;

            this.address = address;
            this.onMessageCall = messageCall;
            this.onOpenCall = openCall || null;
            this.onCloseCall = closeCall || null;
        },

        connect : function ()
        {
            if(!this.isConnected)
            {
                this.ws = new WebSocket(this.address);
                this.ws.onmessage = this.onMessage.bind(this);
                this.ws.onerror = this.onError.bind(this);
                this.ws.onopen = this.onOpen.bind(this);
                this.ws.onclose = this.onClose.bind(this);
            }
        },

        onOpen : function ()
        {
            this.isConnected = true;
            this.onOpenCall && this.onOpenCall();
        },

        onError : function ()
        {
            console.log('Websocketerror: ' + err);
        },

        onClose : function ()
        {
            console.log('disconnected');
            this.isConnected = false;
            this.onCloseCall && this.onCloseCall();
            this.ws = null;
        },

        onMessage : function (message)
        {
            this.onMessageCall( message );
        },

        sendMessage : function (message)
        {
            if( this.isConnected )
            {
                this.ws.send(message);
            }
        },
    };

    return Client;
})();