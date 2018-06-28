var Red = Red || {};

Red.IFrame = (function ()
{
    function IFrame(game)
    {
        this.game = game;

        this.call = {
            "@gamePlay": null,
        };

        window.addEventListener("message", this._onMessage.bind(this));
    }

    IFrame.prototype = {
        init : function ( gamePlayCall )
        {
            this.call["@gamePlay"] = gamePlayCall;
            window.parent.postMessage({
                type : "@gameReady",
            }, '*');
            return this;
        },

        updateScore : function(score)
        {
            if( window.parent )
            {
                window.parent.postMessage({
                    type : "@updateScore",
                    score : score
                }, '*');
            }
        },

        gameOver : function(score)
        {
            if( window.parent )
            {
                window.parent.postMessage({
                    type : "@gameOver",
                    score : score
                }, '*');
            }
        },

        _onMessage : function( message )
        {
            if( !message.data || !message.data.type ) return;
            this.call[message.data.type] && this.call[message.data.type]( message.data );
        },
    };

    return IFrame;
})();
