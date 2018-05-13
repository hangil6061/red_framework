var Red = Red || {};

Red.NetworkManager = (function ()
{
    function NetworkManager(game)
    {
        this.game = game;
        this.client = null;
        this.isConnected = false;

        this.onConnectCall = null;
        this.onDisconnectCall = null;
        this.onMessageCall = null;

        // // 로직을 제어하는 메세지는 우선 대기 시킴.
        // this.waitMessageQueue = [];
    }

    NetworkManager.prototype =
    {
        create : function ( address )
        {
            this.client = new Red.Client( this.game );
            this.client.create( address, this.onMessage.bind(this), this.onConnect.bind(this), this.onClose.bind(this) );
        },

        tryConnect : function ()
        {
            if( !this.isConnected )
            {
                this.client.connect();
            }
            else
            {
                this.onConnectCall && this.onConnectCall();
            }
        },

        onConnect : function ()
        {
            this.isConnected = true;
            console.log("서버에 연결되었습니다.");
            this.onConnectCall && this.onConnectCall();
            this.onConnectCall = null;
            //this.sendMessage( {type : MESSAGE_TYPE.CS_loadData} );
        },

        onClose : function ()
        {
            this.isConnected = false;
            console.log("서버와의 연결이 끊어졌습니다.");
            this.onDisconnectCall && this.onDisconnectCall();
            this.onDisconnectCall = null;
        },

        onMessage : function (message)
        {
            this.onMessageCall && this.onMessageCall( message.data );
        },

        sendMessage : function (message)
        {
            this.client.sendMessage(message);
        },
    };

    return NetworkManager;
})();