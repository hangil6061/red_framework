var Red = Red || {};

Red.Gauge = (function ()
{
    function Gauge()
    {
        this.isActive = true;
        this.sprite = null;
        this.mask = null;

        this.width = 0;
        this.height = 0;
    }


    Gauge.prototype = {
        create : function ( x, y, tex, par )
        {
            if( tex instanceof PIXI.Sprite)
            {
                this.sprite = tex;
            }
            else
            {
                this.sprite = new PIXI.Sprite( PIXI.Texture.fromImage( tex ));
            }

            this.sprite.position.set( x,y );

            if( par )
            {
                par.addChild(this.sprite);
            }

            this.mask = new PIXI.Graphics();
            this.sprite.addChild(this.mask);
            this.sprite.mask = this.mask;

            this.width = this.sprite.texture.width;
            this.height = this.sprite.texture.height;

            this.sprite.mask = this.mask;
        },

        setActive : function (active)
        {
            if( this.isActive === active ) return;

            this.isActive = active;
            if( active )
            {
                this.sprite.visible = true;
            }
            else
            {
                this.sprite.visible = false;
            }
        },

        setValue : function (crt, max)
        {
            this.mask.clear();
            this.mask.beginFill( 0xffffff );
            this.mask.drawRect( 0, 0, this.width * crt / max, this.height );
        },
    };

    return Gauge;
})();