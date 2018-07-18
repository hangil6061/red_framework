var Red = Red || {};

Red.SheetAnimation = (function ()
{
    function SheetAnimation( game, sprite )
    {
        this.game = game;
        this.sprite = sprite || new PIXI.Sprite(PIXI.Texture.fromImage(''));

        this.anims = {};

        this.currentAnim = null;
        this.currentFrameIdx = 0;

        this.isLoop = true;
        this.finishCall = null;
        this.isPlay = false;

        this.time = 0;
        this.interval = 0.15;
    }

    SheetAnimation.prototype = {
        addAnim : function (key, textures)
        {
            this.anims[key] = textures;
        },

        playAnim : function(key, isLoop, interval, finishCall)
        {
            this.isPlay = true;
            this.isLoop = isLoop || false;
            this.interval = interval || 0.15;
            this.finishCall = finishCall || null;
            this.currentAnim = this.anims[key];
            this.currentFrameIdx = 0;
            this.time = 0;
        },

        finishedAnim : function()
        {
            this.isPlay = false;
            this.finishCall && this.finishCall();
        },

        update : function (delta)
        {
            if( !this.isPlay ) return;

            this.time += delta;
            if( this.time >= this.interval )
            {
                this.time -= this.interval;
                this.currentFrameIdx++;
                this.updateFrame();
            }
        },

        updateFrame : function ()
        {
            if(!this.currentAnim) return;

            if( this.currentFrameIdx ===  this.currentAnim.length)
            {
                if( this.isLoop )
                {
                    this.currentFrameIdx %= this.currentAnim.length;
                    this.sprite.texture = this.currentAnim[ this.currentFrameIdx ];
                }
                else
                {
                    this.finishedAnim();
                }
            }
            else
            {
                this.sprite.texture = this.currentAnim[ this.currentFrameIdx ];
            }

        },
    };

    return SheetAnimation;
})();
