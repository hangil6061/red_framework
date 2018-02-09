var Red = Red || {};

// scrollArea 와 rootContainer 의 부모가 같아야함.

Red.Scroll = (function ()
{
    function Scroll(game)
    {
        this.game = game;

        this.rootContainer = null;
        this.scrollArea = null;
        this.mask = null;
        this.isMouseOver = false;
        this.isMouseDown = false;
        this.preMousePos = {x:0,y:0};

        this.moveDelta = 4;

        this.scrollRect = {};
        this.barBg = null;
        this.barRect = null;

        this.wheelBind = null;
        this.mouseUpBind = null;
        
        this.isRectDown = false;
    }

    Scroll.prototype = {
        create : function (x, y, w, h, area, mask, bar, barBg, par )
        {
            this.rootContainer = par;

            this.mask = mask;
            this.scrollArea = area;
            this.scrollArea.mask = this.mask;

            this.rootContainer.addChild( this.mask );

            this.scrollRect.top = y;
            this.scrollRect.bottom = y + h;
            this.scrollRect.left = x;
            this.scrollRect.right = x + w;
            this.scrollRect.width = w;
            this.scrollRect.height = h;

            this.barBg = barBg;
            this.barBg.visible = false;
            this.barRect = bar;

            this.rootContainer.addChild( this.barBg );
            this.rootContainer.addChild( this.barRect );

            this.rootContainer.hitArea = new PIXI.Rectangle( x, y, w, h );
            this.rootContainer.interactive = true;
            this.rootContainer
            .on('pointerover', this._onOver.bind(this))
            .on('pointerout', this._onOut.bind(this))
            .on('pointerdown', this._onDown.bind(this))
            .on('pointerup', this._onUp.bind(this))
            .on('pointermove', this._onMove.bind(this));

            // this.barRect.interactive = true;
            // this.barRect
            // .on('pointerover', this._onOver.bind(this))
            // .on('pointerout', this._onOut.bind(this))
            // .on('pointerdown', this._onRectDown.bind(this))
            // .on('pointerup', this._onUp.bind(this))
            // .on('pointermove', this._onMove.bind(this));

            this.rootContainer.visible = false;
            this.wheelBind = this._onMouseWheel.bind(this);
            this.mouseUpBind = this._onUp.bind(this);
            this.setActive( true );
        },

        setActive : function (active)
        {
            if( active === this.rootContainer.visible ) return;

            this.rootContainer.visible = active;
            if( active )
            {
                this.game.keyManager.addWheelCall( this.wheelBind );
                this.game.keyManager.addMouseUpCall( this.mouseUpBind );
            }
            else
            {
                this.game.keyManager.removeWheelCall( this.wheelBind );
                this.game.keyManager.removeMouseUpCall( this.mouseUpBind );
            }
        },

        setMoveDelta : function (value)
        {
            this.moveDelta = value
        },

        addItem : function (con, addHeight)
        {
            if (this.scrollArea.children.length === 0)
            {
                addHeight = 0;
            }
            else
            {
                addHeight = addHeight || 0;
            }

            con.position.y = this.scrollArea.height + addHeight;
            this.scrollArea.addChild( con );
        },

        clear : function ()
        {
            this.scrollArea.children.length = 0;
            this.game.actionsManager.addAfterRenderFunc( this.refresh.bind(this) );
        },

        refresh : function ( isBottom )
        {
            if( this.scrollArea.height > this.scrollRect.height )
            {
                this.barRect.height = this.barBg.height * (this.scrollRect.height / this.scrollArea.height);
                this.barRect.position.y =  this.barBg.y;
                this.barBg.visible = true;
                this.barRect.visible = true;
            }
            else
            {
                this.barBg.visible = false;
                this.barRect.visible = false;
            }

            if( isBottom && this.scrollArea.height > this.scrollRect.height )
            {
                this.scrollArea.y = this.scrollRect.bottom - this.scrollArea.height;
            }
            else
            {
                this.scrollArea.y = this.scrollRect.top;
            }

            this._updateBarRect();
        },

        _onMouseWheel : function (e)
        {
            if(this.isMouseOver && this.scrollArea.height > this.scrollRect.height)
            {
                if( e.deltaY > 0 )
                {
                    //아래로

                    this.scrollArea.y -= this.moveDelta;

                    if( this.scrollArea.y + this.scrollArea.height < this.scrollRect.bottom )
                    {
                        this.scrollArea.y = this.scrollRect.bottom - this.scrollArea.height;
                    }
                }
                else
                {
                    //위로

                    this.scrollArea.y += this.moveDelta;
                    if( this.scrollArea.y >  this.scrollRect.top  )
                    {
                        this.scrollArea.y = this.scrollRect.top;
                    }
                }

                this._updateBarRect();
            }
        },

        _updateBarRect : function ()
        {
            if( this.scrollArea.height < this.scrollRect.height ) return;
            var value = (this.scrollRect.top - this.scrollArea.y) / (this.scrollArea.height - this.scrollRect.height);
            this.barRect.y = this.barBg.y + ((this.barBg.height - this.barRect.height) * value);
        },

        _onOver : function (e)
        {
            this.isMouseOver = true;
        },

        _onOut : function (e)
        {
            this.isMouseOver = false;
            //this.isMouseDown = false;
        },

        _onDown : function (e)
        {
            this.isMouseDown = true;
            this.preMousePos.x = e.data.global.x;
            this.preMousePos.y = e.data.global.y;
        },

        _onRectDown : function (e)
        {
            this.isMouseDown = true;
            this.preMousePos.x = e.data.global.x;
            this.preMousePos.y = e.data.global.y;
            this.isRectDown = true;
        },

        _onUp : function (e)
        {
            this.isMouseDown = false;
            this.isRectDown = false;
        },

        _onMove : function (e)
        {
            if( this.scrollArea.height <= this.scrollRect.height ) return;

            if( this.isMouseDown )
                {
                    var moveY = e.data.global.y - this.preMousePos.y;
                    if(this.isRectDown)
                    {
                        moveY *= -1;
                    }

                    if( moveY < 0 )
                    {
                        //아래로

                        this.scrollArea.y += moveY;

                        if( this.scrollArea.y + this.scrollArea.height < this.scrollRect.bottom )
                        {
                            this.scrollArea.y = this.scrollRect.bottom - this.scrollArea.height;
                        }
                    }
                    else
                    {
                        //위로

                        this.scrollArea.y += moveY;
                        if( this.scrollArea.y >  this.scrollRect.top  )
                        {
                            this.scrollArea.y = this.scrollRect.top;
                        }
                    }
                    this._updateBarRect();


                this.preMousePos.x = e.data.global.x;
                this.preMousePos.y = e.data.global.y;
            }
        },
    };

    return Scroll;
})();