var Red = Red || {};

Red.Factory = (function ()
{
    function Factory()
    {
        this.game = null;
        this.worldContainer = null;
        this.getContaner = null;
    }

    Factory.prototype = {
        boot : function (game)
        {
            this.game = game;
            this.worldContainer = game.world.worldContainer;
            this.getContaner = game.containerManager.getContaner.bind(game.containerManager);
        },

        sprite : function (x, y, tex, container)
        {
            var texture;
            if( tex instanceof PIXI.Texture)
            {
                texture = tex;
            }
            else
            {
                texture = PIXI.Texture.fromImage(tex);
            }
            var sprite = new PIXI.Sprite(texture);

            if( x )
            {
                sprite.x = x;
            }

            if( y )
            {
                sprite.y = y;
            }

            if( container)
            {
                if( container instanceof PIXI.Container)
                {
                    container.addChild( sprite );
                }
                else
                {
                    this.getContaner( container ).addChild( sprite );
                }
            }
            else
            {
                this.worldContainer.addChild( sprite );
            }

            return sprite;
        },



        text : function (x, y, str, container)
        {
            var text = new Text(str);
            text.x = x;
            text.y = y;

            if( container !== null && container !== undefined )
            {
                if( container instanceof PIXI.Container)
                {
                    container.addChild( text );
                }
                else
                {
                    this.getContaner( container ).addChild( text );
                }
            }
            else
            {
                this.worldContainer.addChild( text );
            }
            return text;
        },

        button : function (x, y, normalTex, overTex, pushTex, action, container, sprite)
        {
            var texture;
            if( normalTex instanceof PIXI.Texture)
            {
                texture = normalTex;
            }
            else
            {
                texture = PIXI.Texture.fromImage(normalTex);
            }

            var sprite = sprite || new PIXI.Sprite(texture);

            if( x )
            {
                sprite.x = x;
            }

            if( y )
            {
                sprite.y = y;
            }

            if( container)
            {
                if( container instanceof PIXI.Container)
                {
                    container.addChild( sprite );
                }
                else
                {
                    this.getContaner( container ).addChild( sprite );
                }
            }
            else
            {
                this.worldContainer.addChild( sprite );
            }

            return new Red.Button( sprite, action, normalTex, overTex, pushTex  );
        },

        button_tint : function (x, y, tex , normalColor, overColor, pushColor, action, container, sprite)
        {
            var texture;
            if( tex instanceof PIXI.Texture)
            {
                texture = tex;
            }
            else
            {
                texture = PIXI.Texture.fromImage(tex);
            }

            var sprite = sprite || new PIXI.Sprite(texture);

            if( x )
            {
                sprite.x = x;
            }

            if( y )
            {
                sprite.y = y;
            }

            if( container)
            {
                if( container instanceof PIXI.Container)
                {
                    container.addChild( sprite );
                }
                else
                {
                    this.getContaner( container ).addChild( sprite );
                }
            }
            else
            {
                this.worldContainer.addChild( sprite );
            }

            return new Red.Button( sprite, action, normalColor, overColor, pushColor  );
        },

        container : function (key, isFollowCamera)
        {
            var container = new PIXI.Container();
            if( !isFollowCamera )
            {
                this.game.world.worldContainer.addChild( container );
            }
            else
            {
                this.game.stage.addChild( container );
            }

            if( key )
            {
                this.game.containerManager.addContainer( key, container );
            }
            return container;
        },

        action : function ( maxTime, action, finishCall, isFixed )
        {
            if( !isFixed )
            {
                isFixed = false;
            }
            var action = new Red.ActionData( maxTime, action, finishCall );

            if( isFixed )
            {
                this.game.actionsManager.addFixedAction( action );
            }
            else
            {
                this.game.actionsManager.addAction( action );
            }
        },

        scaleAction : function (con, start, end, Tween, maxTime, finishCall, isFixed )
        {
            con.scale.set( start );
            this.game.factory.action( maxTime,
                (function (delta, a, t, maxT)
                {
                    var tt = Tween(t/maxT);
                    con.scale.set( Red.Math.Lerp( start, end, tt ) );
                }).bind(this), finishCall, isFixed);
        },

        moveXAction : function (con, start, end, Tween, maxTime, finishCall, isFixed )
        {
            con.x = start;
            this.game.factory.action( maxTime,
                (function (delta, a, t, maxT)
                {
                    var tt = Tween(t/maxT);
                    con.x = ( Red.Math.Lerp( start, end, tt ) );
                }).bind(this), finishCall, isFixed);
        },

        waitCall : function (waitTime, call)
        {
            this.action( waitTime,function (){}, call );
        },

        loopAtion : function ( action, isFixed )
        {
            isFixed = isFixed || false;

            if( isFixed )
            {
                this.game.actionsManager.addFixedLoopAction( action );
            }
            else
            {
                this.game.actionsManager.addLoopAction( action );
            }
        },
    };

    return Factory;
})();