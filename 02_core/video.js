var Red = Red || {};

Red.Video = (function ()
{
    var _state = {
        none : 0,
        record : 1,
        play : 2,
    };

    function Video(game)
    {
        this.game = game;

        this.buffer = [];
        this.count = 0;
        this.startIdx = 0;
        this.crtIdx = 0;

        this.state = _state.none;

        this.isQueue = false;
        this.time = 0;
        this.maxTime = 0;
        this.length = 0;

        this.targetContainer = null;

        this.renderTexture = null;
        this.renderSprite = null;
    }

    Video.prototype = {

        create : function ( fps, second )
        {
            this.count = fps * second;
            this.maxTime = 1 / fps;

            for( var i = 0; i < this.count; i++ )
            {
                //var brt = new PIXI.BaseRenderTexture(this.game.width, this.game.height, PIXI.SCALE_MODES.LINEAR, 1);
                this.buffer[i] = PIXI.RenderTexture.create(this.game.width, this.game.height);
            }

            this.renderSprite = new PIXI.Sprite();
        },

        startRecord : function ( container, isQueue )
        {
            if( !container ) return;

            this.targetContainer = container;
            this.state = _state.record;
            this.isQueue = isQueue || false;
            this.time = 0;
            this.startIdx = 0;
            this.crtIdx = this.startIdx;
            this._record();
        },

        startPlay : function ( container )
        {
            if( !container ) return;

            this.state = _state.play;

            this.length = (this.crtIdx - this.startIdx) % this.count;
            if( this.length === 0 )
            {
                this.length = this.count;
            }
            this.crtIdx = this.startIdx;

            container.addChild( this.renderSprite );
        },

        stop : function ()
        {
            this.state = _state.none;
            if(this.renderSprite.parent)
            {
                this.renderSprite.parent.removeChild( this.renderSprite );
            }
            else
            {
                if(this.crtIdx >= this.count)
                {
                    this.startIdx = this.crtIdx - this.count;
                }
            }
        },
        
        update : function (delta)
        {
            switch (this.state)
            {
                case _state.none:
                    break;
                case _state.record:
                    this._update_record(delta);
                    break;
                case _state.play:
                    this._update_play(delta);
                    break;
            }
        },

        _update_record : function (delta)
        {
            if( !this.isQueue && this.startIdx === this.crtIdx) return;

            this.time += delta;
            if( this.time >= this.maxTime )
            {
                this.time -= this.maxTime;
                this._record();
            }
        },

        _update_play : function (delta)
        {
            this.time += delta;
            if( this.time >= this.maxTime )
            {
                this.time -= this.maxTime;
                this._play();
            }
        },

        _record : function ()
        {
            this.game.renderer.render(this.targetContainer, this.buffer[ (this.startIdx + this.crtIdx) % this.count ]);
            this.crtIdx++;
        },

        _play : function ()
        {
            this.renderSprite.texture = this.buffer[ ( this.startIdx + ((this.crtIdx - this.startIdx) % this.length) ) % this.count ];
            this.crtIdx++;
        },
    };

    return Video;
})();