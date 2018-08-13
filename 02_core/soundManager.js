var Red = Red || {};

Red.SoundManager = (function ()
{
    function SoundManager()
    {
        this.isBgmMute = false;
        this.isEFFMute = false;

        this.bgm = null;
        this.sounds = {};
    }

    SoundManager.prototype = {
        addSound : function (key, sound)
        {
            this.sounds[key] = sound;
        },

        removeSound : function(key)
        {
            if( this.sounds[key] )
            {
                this.sounds[key].stop();
                delete PIXI.sound._sounds[key];
                return delete this.sounds[key];
            }
        },

        setBgmMute : function (active)
        {
            if(this.isBgmMute === active) return;

            this.isBgmMute = active;
            if( this.isBgmMute )
            {
                this.bgm._preVolume = this.bgm.volume;
                this.bgm.volume = 0;
            }
            else
            {
                this.bgm.volume = this.bgm._preVolume;
            }
        },

        setSoundMute : function (active)
        {
            if(this.isEFFMute === active) return;

            this.isEFFMute = active;
            if( this.isEFFMute )
            {
                for( var key in this.sounds )
                {
                    if( !this.sounds.hasOwnProperty( key ) ) continue;
                    var sound = this.sounds[ key ];
                    if( sound === this.bgm) continue;
                    if( sound.isPlaying )
                    {
                        sound.stop();
                    }
                }
            }
        },

        playBgm : function (key, volume)
        {
            volume = volume || 1;

            if( this.bgm ===  this.sounds[key]) return;
            if( this.bgm && this.bgm.isPlaying )
            {
                this.bgm.stop();
            }

            this.bgm = this.sounds[key];
            if(this.bgm)
            {
                this.bgm._preVolume = volume;
                if( this.isBgmMute )
                {
                    this.bgm.volume = 0;
                }
                else
                {
                    this.bgm.volume = volume;
                }
                this.bgm.loop = true;
                this.bgm.play();
            }
        },

        stopBgm : function ()
        {
            if(this.bgm)
            {
                this.bgm.stop();
                this.bgm = null;
            }

        },

        playSound : function (key, volume, loop, call)
        {
            volume = volume || 1;
            loop = loop || false;

            var sound = this.sounds[key];

            if( sound && !this.isEFFMute)
            {
                sound.volume = volume;
                sound.loop = loop;
                sound.play(call);
            }
        },

        stopSound : function (key)
        {
            var sound = this.sounds[key];
            if( sound )
            {
                sound.stop();
            }
        },

        isPlaySound : function (key)
        {
            if( this.sounds[key] )
            {
                return this.sounds[key].isPlaying;
            }
            return false;
        }
    };

    return SoundManager;
})();
