var Red = Red || {};

Red.Camera = (function ()
{
    function Camera()
    {
        this.game = null;
        this.position = new PIXI.Point();
        this.target = null;
        this.offset = new PIXI.Point();

        this.bounds = new PIXI.Bounds();
        this.bounds.minX = 0;
        this.bounds.minY = 0;
        this.bounds.maxX = 0;
        this.bounds.maxY = 0;

        this.deltaRate = 0.24;

        this.updateFunc = this._update0;
    }

    Camera.prototype = {
        boot : function (game)
        {
            this.game = game;
        },

        setUpdate : function( type )
        {
            switch ( type )
            {
                case 0:
                    this.updateFunc = this._update0;
                    break;
                default:
                    this.updateFunc = this._update1;
                    break;
            }
        },

        setDeltaRate : function(rate)
        {
            this.deltaRate = rate;
        },

        update : function (delta)
        {
            this.updateFunc(delta);
        },

        //왼쪽위 원점용
        _update0 : function(delta)
        {
            if( this.target )
            {
                this.setPosition( this.target.x - this.game.halfWidth - this.offset.x, this.target.y - this.game.halfHeight - this.offset.y, delta);
            }
        },


        //가운데 원점용
        _update1 : function (delta)
        {
            if( this.target )
            {
                this.setPosition( this.target.x - this.offset.x, this.target.y - this.offset.y, delta);
            }
        },

        initPosition : function( x, y )
        {
            this.position.set( x, y );
        },

        setPosition : function (x, y, delta)
        {
            this.position.x = Red.Math.Lerp(this.position.x, x, delta / this.deltaRate);
            this.position.y = Red.Math.Lerp(this.position.y, y, delta / this.deltaRate);
            //this.position.x = x;
            //this.position.y = y;

            if( this.position.x < this.bounds.minX )
            {
                this.position.x = this.bounds.minX;
            }
            else if( this.position.x > this.bounds.maxX )
            {
                this.position.x = this.bounds.maxX;
            }

            if( this.position.y < this.bounds.minY )
            {
                this.position.y = this.bounds.minY;
            }
            else if( this.position.y > this.bounds.maxY )
            {
                this.position.y = this.bounds.maxY;
            }

        },

        /**
         *
         * @param target PIXI.Container
         */
        setTarget : function (target, offsetX, offsetY)
        {
            this.target = target;
            offsetX = offsetX || 0;
            offsetY = offsetY || 0;

            this.offset.x = offsetX;
            this.offset.y = offsetY;
        }
    };

    return Camera;
})();
