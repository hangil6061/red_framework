var Red = Red || {};

Red.LayoutAnimation_event = (function ()
{
    var _eventKey = {
        eventName : "",
        time : 0,
        parameter : 0,
    };

    function LayoutAnimation_event(game)
    {
        this.game = game;
        this.owner = null;
        this.isPlaying = false;
        this.idx = 0;
        this.keys = null;

        this.crtKey = null;
        this.nextKey = null;
        this.nextTime = 0;
        this.crtTime = 0;
    }

    LayoutAnimation_event.prototype = {

        create : function (owner, keys)
        {
            this.owner = owner;
            this.keys = keys;
        },

        play : function ()
        {
            this.idx = 0;
            this.isPlaying = true;
            this.crtKey = this.keys[this.idx];

            this.crtTime = this.crtKey.time;
            this.nextTime = 0;
            this.nextKey = null;
        },

        finish : function ()
        {
            this.isPlaying = false;
        },


        update : function (t)
        {
            if( !this.isPlaying ) return 1;

            this._update(t);

            return 0;
        },
        
        _update : function (t)
        {
            if( this.crtTime > t ) return;                  //첫 키프레임이 중간부터 시작할 경우
            if( t >= this.nextTime )
            {
                this.idx++;
                this.crtKey = this.nextKey || this.crtKey;      //첫 키프레임에는 넥스트가 널인 상태임.

                this.nextKey = this.keys[ this.idx ];
                if( !this.nextKey )
                {
                    if( this.crtKey.parameter )
                    {
                        this.owner.invokeEvent( this.crtKey.eventName, this.crtKey.parameter );
                    }
                    else
                    {
                        this.owner.invokeEvent(this.crtKey.eventName);
                    }

                    this.finish();
                    return;
                }

                this.crtTime = this.crtKey.time;
                this.nextTime = this.nextKey.time;

                if( this.crtKey.parameter )
                {
                    this.owner.invokeEvent( this.crtKey.eventName, this.crtKey.parameter );
                }
                else
                {
                    this.owner.invokeEvent(this.crtKey.eventName);
                }
            }
        }

    };

    return LayoutAnimation_event;
})();