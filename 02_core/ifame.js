var Red = Red || {};

Red.IFrame = (function ()
{
    function IFrame(game)
    {
        this.game = game;

        this.call = {};
        window.addEventListener("message", this._onMessage.bind(this));
    }

    IFrame.EventType = {
        gamePlay : '@gamePlay',
        gameReady : '@gameReady',
        updateScore : '@updateScore',
        gameOver : '@gameOver',

        leftArrowDown : '@leftArrowDown',
        leftArrowUp : '@leftArrowUp',
        rightArrowDown: '@rightArrowDown',
        rightArrowUp : '@rightArrowUp',
        upArrowDown : '@upArrowDown',
        upArrowUp : '@upArrowUp',
        downArrowDown : '@downArrowDown',
        downArrowUp : '@downArrowUp',

        aButtonDown : '@aButtonDown',
        aButtonUp : '@aButtonUp',
        bButtonDown : '@bButtonDown',
        bButtonUp : '@bButtonUp',
        cButtonDown : '@cButtonDown',
        cButtonUp : '@cButtonUp',
    };

    IFrame.prototype = {
        init : function ( gamePlayCall )
        {
            this.addEvent( IFrame.EventType.gamePlay, gamePlayCall );
            window.parent.postMessage({
                type : IFrame.EventType.gameReady,
            }, '*');
            return this;
        },

        addEvent: function( event, call ) {
            this.call[event] = call;
        },

        removeEvent: function( event ) {
            this.call[event] = null;
        },

        updateScore : function( score )
        {
            if( window.parent )
            {
                window.parent.postMessage({
                    type : IFrame.EventType.updateScore,
                    score : score
                }, '*');
            }
        },

        gameOver : function(score)
        {
            if( window.parent )
            {
                window.parent.postMessage({
                    type : IFrame.EventType.gameOver,
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
