var Red = Red || {};

Red.Layout = (function ()
{
    var _data = {
        name : "",
        visible : true,
        children : [],
        localPosition : {x:0,y:0},
        position : {x:0,y:0},
        pivot : {x:0,y:0},
        scale : {x:0, y:0},
        sprite : { spriteName : "", color : "", alpha : 1, width : 0, height : 0, isInteractive:false },
        nineSlice : {spriteName : "", border:{l:0,t:0,r:0,b:0},width:0,height:0,  alpha : 1, color : "", isInteractive:false},
        tilingSprite : {spriteName : "", width:0,height:0,  alpha : 1, color : "", isInteractive:false},
        button : {normal:"", over:"", push:"", disabled:""},
        text : {font:"", text:"", size:0, align : "", width:0, isNormal : false},
        input : { placeholder : "", width : 0, height : 0, fontSize : 0,  fontColor:"", placeholderColor:"", isTextArea :false ,isPassword : false, isNumberOnly : false},
        scroll : {},
        toggleGroup : { toggles : [ {buttonName:"", onImageName:""} ], defaultIndex : 0 },

    };

    function Layout(game)
    {
        this.game = game;
        this.rootContainer = null;
        this.children = {};
        this.animation = null;

        this.afterCreate = [];

        this.aniEventCall = [];
    }

    Layout.prototype = {
        create : function (data)
        {
            this.rootContainer = new PIXI.Container();

            for( var i = 0; i < data.length; i++ )
            {
                this._createObject(data[i], this.rootContainer, "");
            }

            for( var i = 0; i < this.afterCreate.length; i++ )
            {
                this._afterCreateObject(this.afterCreate[i]);
            }

            this.animation = new Red.LayoutAnimation(this.game);
            this.animation.create( this );
        },

        start : function()
        {
            this.rootContainer.visible = true;
        },

        finish : function()
        {
            this.rootContainer.visible = false;
        },

        destroy : function ()
        {
            var self = this;
            Object.keys(this.children).forEach(function (c) {

                var child = self.children[c];
                if(child.parent)
                {
                    child.parent.removeChild( child );
                }
                child.destroy();
            });
            this.rootContainer.parent.removeChild( this.rootContainer );
        },

        printChildren : function ()
        {
            Object.keys(this.children).forEach(function (t) {
                console.log(t);
            });
        },

        addAnimationClip : function (clip, key)
        {
            key = key || clip.name;
            this.animation.addClip( clip, key );
        },

        playAnimationClip : function (key, loop, finishCall)
        {
            this.animation.play( key, loop, finishCall );
        },

        update : function (delta)
        {
            this.animation.update( delta );
        },

        invokeEvent : function (eventName, parameter)
        {
            for(var i = 0; i < this.aniEventCall.length; i++)
            {
                this.aniEventCall[i]( eventName, parameter );
            }
        },

        _createObject : function (data, root, parName)
        {
            var con = null;
            var buttonObject = null;
            var name = parName + data.name;

            if( data.sprite )
            {
                if( data.sprite.spriteName === "null" )
                {
                    con = this.game.factory.sprite( data.localPosition.x, data.localPosition.y, PIXI.Texture.WHITE , root );
                    con.width = data.sprite.width;
                    con.height = data.sprite.height;
                }
                else
                {
                    con = this.game.factory.sprite( data.localPosition.x, data.localPosition.y, data.sprite.spriteName, root );
                }

                if(data.sprite.color)
                {
                    con.tint = parseInt( data.sprite.color);
                }

                if(data.sprite.alpha)
                {
                    con.alpha = data.sprite.alpha;
                }
                con.anchor.set( data.pivot.x, data.pivot.y );
                if(data.scale)
                {
                    con.scale.set( data.scale.x, data.scale.y );
                }

                if(data.sprite.isInteractive )
                {
                    con.interactive = data.sprite.isInteractive;
                }
            }
            else if( data.nineSlice )
            {
                con = new PIXI.mesh.NineSlicePlane( PIXI.Texture.fromImage( data.nineSlice.spriteName )
                    , data.nineSlice.border.l,data.nineSlice.border.t,data.nineSlice.border.r,data.nineSlice.border.b );

                con.position.set( data.localPosition.x,data.localPosition.y);
                con.width = data.nineSlice.width;
                con.height = data.nineSlice.height;
                con.pivot.set( data.pivot.x, data.pivot.y );
                if(data.nineSlice.color)
                {
                    con.tint = parseInt( data.nineSlice.color);
                }
                if(data.nineSlice.alpha)
                {
                    con.alpha = data.nineSlice.alpha;
                }
                if(data.scale)
                {
                    con.scale.set( data.scale.x, data.scale.y );
                }

                if(data.nineSlice.isInteractive )
                {
                    con.interactive = data.nineSlice.isInteractive;
                }

                root.addChild( con );
            }
            else if( data.tilingSprite )
            {
                con = new PIXI.extras.TilingSprite( PIXI.Texture.fromImage( data.tilingSprite.spriteName )
                    ,data.tilingSprite.width, data.tilingSprite.height );
                con.position.set( data.localPosition.x,data.localPosition.y);
                //con.anchor.set( data.pivot.x, data.pivot.y );

                if(data.tilingSprite.color)
                {
                    con.tint = parseInt( data.tilingSprite.color);
                }
                if(data.tilingSprite.alpha)
                {
                    con.alpha = data.tilingSprite.alpha;
                }
                if(data.scale)
                {
                    con.scale.set( data.scale.x, data.scale.y );
                }

                if(data.tilingSprite.isInteractive )
                {
                    con.interactive = data.tilingSprite.isInteractive;
                }

                con.anchor.set( data.pivot.x, data.pivot.y );
                root.addChild( con );
            }
            else if( data.button )
            {
                var sprite = null;

                if( data.button.transition === 1 )
                {
                    if( data.button.border )
                    {
                        sprite = new PIXI.mesh.NineSlicePlane( PIXI.Texture.fromImage( data.button.spriteName )
                            , data.button.border.l,data.button.border.t,data.button.border.r,data.button.border.b );
                    }

                    con = this.game.factory.button_tint( data.localPosition.x, data.localPosition.y
                        , data.button.spriteName, data.button.normal, data.button.over, data.button.push, null, root,sprite  );

                    if( data.button.border )
                    {
                        sprite.width = data.button.width;
                        sprite.height = data.button.height;
                    }
                    else
                    {
                        con.sprite.anchor.set( data.pivot.x, data.pivot.y );
                        if(data.scale)
                        {
                            con.sprite.scale.set( data.scale.x, data.scale.y );
                        }
                    }

                    con.setOffTexture( data.button.disabled );
                }
                else if( data.button.transition === 2 )
                {
                    if( data.button.border )
                    {
                        sprite = new PIXI.mesh.NineSlicePlane( PIXI.Texture.fromImage( data.button.normal )
                            , data.button.border.l,data.button.border.t,data.button.border.r,data.button.border.b );
                        sprite.uploadUvTransform = true;

                    }

                    con = this.game.factory.button( data.localPosition.x, data.localPosition.y
                        , data.button.normal, data.button.over, data.button.push, null, root ,sprite );

                    if( data.button.border )
                    {
                        sprite.width = data.button.width;
                        sprite.height = data.button.height;
                    }
                    else
                    {
                        con.sprite.anchor.set( data.pivot.x, data.pivot.y );
                        if(data.scale)
                        {
                            con.sprite.scale.set( data.scale.x, data.scale.y );
                        }
                    }


                    if( data.button.disabled !== "" )
                    {
                        con.setOffTexture( data.button.disabled );
                    }
                }

                buttonObject = con;
                con = con.sprite;

            }
            else if( data.text )
            {
                if( data.text.isNormal )
                {
                    var size = data.text.size * 1.15;
                    con = new PIXI.Text( data.text.text,new PIXI.TextStyle(
                        {
                            fontFamily : data.text.font,
                            fontSize: data.text.size,
                            fill:  parseInt( data.text.color),
                        }) );
                }
                else
                {
                    var size = data.text.size * 1.15;
                    con = new Red.BitmapText2( data.text.text, {font: size.toString() + "px " + data.text.font } );
                    con.tint = parseInt( data.text.color);
                }

                con.position.set( data.localPosition.x, data.localPosition.y );
                con.anchor.set(data.pivot.x, data.pivot.y);

                if( data.text.align )
                {
                    con.align = data.text.align;
                }

                if( data.text.width )
                {
                    con.maxWidth = data.text.width;
                }
                root.addChild( con );
            }
            else if( data.input )
            {
                con = new Red.InputText( this.game );

                if( data.input.isTextArea === "true" )
                {
                    con.create( data.localPosition.x, data.localPosition.y, data.input.width, data.input .height, data.input.fontSize || 18, root, null );
                }
                else
                {
                    con.create( data.localPosition.x, data.localPosition.y, data.input.width, data.input .height, data.input.fontSize || 18, root, null, "input" );
                }

                data.input.placeholder && con.setPlaceholder(  data.input.placeholder );
                con.setColor( "#" + data.input.fontColor );
                if(data.input.isPassword === "true")
                {
                    con.setPassword();
                }

                if( data.input.isNumberOnly === "true" )
                {
                    con.setNumberOnly();
                }

            }
            else if( data.mask )
            {
                con = new PIXI.Graphics();
                con.beginFill(0x555555);
                con.drawRect( 0,0, data.mask.width, data.mask.height );
                con.position.set( data.localPosition.x, data.localPosition.y );
            }
            else
            {
                //빈오브젝트
                con = new PIXI.Container();
                root.addChild(con);
                con.position.set( data.localPosition.x, data.localPosition.y );

                if( data.scroll )
                {
                    this.afterCreate.push( { name : "scroll",  path : name, data : data } );
                }
                else if( data.toggleGroup )
                {
                    this.afterCreate.push( { name : "toggleGroup",  path : name, data : data } );
                }
            }

            this.children[ name ] = buttonObject || con;
            this.children[ name ].layoutData = data;

            if(data.visible === "false")
            {
                if( buttonObject )
                {
                    buttonObject.setActive( data.visible === "true" );
                }
                else
                {
                    this.children[ name ].visible = data.visible === "true";
                }
            }

            for( var i = 0; i < data.children.length; i++ )
            {
                this._createObject(data.children[i], con, name + "/");
            }
        },

        _afterCreateObject : function (data)
        {
            if( data.name === "scroll" )
            {
                var scroll = new Red.Scroll( this.game );
                scroll.create(
                    data.data.children[1].localPosition.x,
                    data.data.children[1].localPosition.y,
                    data.data.children[1].mask.width,
                    data.data.children[1].mask.height,
                    this.children[ data.path + "/" +  data.data.children[0].name],
                    this.children[ data.path + "/" +  data.data.children[1].name],
                    this.children[ data.path + "/" +  data.data.children[3].name],
                    this.children[ data.path + "/" +  data.data.children[2].name],
                    this.children[ data.path ]);
                scroll.refresh();
                this.children[ data.path ] = scroll;
                scroll.layoutData = data.data;
            }
            else if( data.name === "toggleGroup" )
            {

                var toggles = [];
                for( var i = 0; i < data.data.toggleGroup.toggles.length; i++ )
                {
                    var toggleData = data.data.toggleGroup.toggles[i];
                    toggles.push( Red.ToggleGroup.createToggle( this.children[ data.path + "/" + toggleData.buttonName ],
                        this.children[ data.path + "/" + toggleData.buttonName + "/" +  toggleData.onImageName] ));
                }

                var toggleGroup = new Red.ToggleGroup( this.game );
                toggleGroup.create( this.children[ data.path ], toggles );
                toggleGroup.setSelect( data.data.toggleGroup.defaultIndex );
                toggleGroup.layoutData = data.data;

                this.children[ data.path ] = toggleGroup;
            }
        },
    };

    return Layout;
})();
