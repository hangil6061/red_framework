var Red = Red || {};

Red.IFrame = (function ()
{
    function IFrame(game)
    {
        this.game = game;

        this.call = {
            "@gamePlay": null,
        };

        this.on( "@gamePlay", function ()
        {
            this.call && this.call();
        }.bind(this));

    }

    IFrame.prototype = {
        init : function ( gamePlayCall )
        {
            this.call["@gamePlay"] = gamePlayCall;
            return this;
        },

        updateScore : function(score)
        {

        },

        gameOver : function(score)
        {

        },

        on : function ( eventName, call )
        {
            window.addEventListener( eventName, call );
            return this;
        },
    };

    return IFrame;
})();