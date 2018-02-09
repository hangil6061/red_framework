var Red = Red || {};

Red.LayoutAnimation = (function ()
{
    function LayoutAnimation(game)
    {
        this.game = game;
        this.owner = null;
        this.isPlaying = false;
        this.clips = {};
        this.playClip = null;
        this.time = 0;
        this.loop = false;
        this.finishCall = null;
    }

    LayoutAnimation.prototype = {
        create : function (owner)
        {
            this.owner = owner;
        },

        addClip : function (clipData, name)
        {
            this.clips[name] = [];

            for( var i = 0; i < clipData.keys.length; i++ )
            {
                var clip = clipData.keys[i];
                var owner = this.owner.children[ clip.path ];
                if( !owner ) continue;

                var property = clip["property"];

                var key = new Red.LayoutAnimation_key(this.game);
                key.create( owner, property, clip.keys );
                this.clips[name].push( key );
            }


            if( clipData.events.length > 0 )
            {
                var event = new Red.LayoutAnimation_event(this.game);
                event.create( this.owner, clipData.events );
                this.clips[name].push( event );
            }
        },

        play : function ( key, loop, call )
        {
            loop = loop || false;
            call = call || null;

            this.playClip = this.clips[ key ];
            this.time = 0;
            this.isLoop = loop;
            this.finishCall = call;

            if( !this.playClip  ) return;
            this.isPlaying = true;
            for( var i = 0; i < this.playClip.length; i++ )
            {
                this.playClip[i].play();
            }
        },

        finish : function ()
        {
            this.isPlaying = false;
            this.playClip = null;
        },
        
        update : function (delta)
        {
            if( !this.isPlaying ) return;

            this.time += delta;
            var endCount = 0;

            for( var i = 0; i < this.playClip.length; i++ )
            {
                endCount += this.playClip[i].update(this.time);
            }


            if( endCount === this.playClip.length )
            {
                if( this.isLoop )
                {
                    this.time = 0;
                    for( var i = 0; i < this.playClip.length; i++ )
                    {
                        this.playClip[i].play();
                    }

                }
                else
                {
                    this.finish();
                    this.finishCall && this.finishCall();
                }
            }
        }
    };

    return LayoutAnimation;
})();