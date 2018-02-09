var Red = Red || {};

Red.LayoutAnimation_key = (function ()
{
    var _propertyType = {
        "none"          : 0,
        "visible"       : 1,
        "scale.x"       : 2,
        "scale.y"       : 3,
        "scale.z"       : 4,
        "color.r"       : 5,
        "color.g"       : 6,
        "color.b"       : 7,
        "alpha"         : 8,
        "position.x"    : 9,
        "position.y"    : 10,
        "position.z"    : 11,
        "rotation.x"     : 12,
        "rotation.y"     : 13,
        "rotation"       : 14,
        "width"         : 15,
        "height"        : 16,
    };

    var _updateList = [];

    _updateList[_propertyType["none"]] = function (t)
    {
        this.finish();
    };

    _updateList[_propertyType["visible"]] = function (t)
    {
        if( this.crtTime > t ) return;                  //첫 키프레임이 중간부터 시작할 경우

        if( t >= this.nextTime )
        {
            this.idx++;
            this.crtKey = this.nextKey || this.crtKey;      //첫 키프레임에는 넥스트가 널인 상태임.

            this.nextKey = this.keys[ this.idx ];
            if( !this.nextKey )
            {
                this.owner.visible = this.crtKey.value === 1;
                this.finish();
                return;
            }

            this.crtTime = this.crtKey.time;
            this.nextTime = this.nextKey.time;

            this.owner.visible = this.crtKey.value === 1;
        }
    };

    _updateList[_propertyType["scale.x"]] = function (t)
    {
        if( this.crtTime > t ) return;                  //첫 키프레임이 중간부터 시작할 경우

        if( t >= this.nextTime )
        {
            this.idx++;
            this.crtKey = this.nextKey || this.crtKey;      //첫 키프레임에는 넥스트가 널인 상태임.

            this.nextKey = this.keys[ this.idx ];
            if( !this.nextKey )
            {
                this.owner.scale.x = this.crtKey.value;
                this.finish();
                return;
            }

            this.crtTime = this.crtKey.time;
            this.nextTime = this.nextKey.time;
        }

        var mt = this.nextTime - this.crtTime;
        var ct = t - this.crtTime;

        this.owner.scale.x = Red.Math.Lerp( this.crtKey.value, this.nextKey.value, Red.Tween.Quadratic.InOut( ct / mt ));
    };

    _updateList[_propertyType["scale.y"]] = function (t)
    {
        if( this.crtTime > t ) return;                  //첫 키프레임이 중간부터 시작할 경우

        if( t >= this.nextTime )
        {
            this.idx++;
            this.crtKey = this.nextKey || this.crtKey;      //첫 키프레임에는 넥스트가 널인 상태임.

            this.nextKey = this.keys[ this.idx ];
            if( !this.nextKey )
            {
                this.owner.scale.y = this.crtKey.value;
                this.finish();
                return;
            }

            this.crtTime = this.crtKey.time;
            this.nextTime = this.nextKey.time;
        }

        var mt =this.nextTime - this.crtTime;
        var ct = t - this.crtTime;

        this.owner.scale.y = Red.Math.Lerp( this.crtKey.value, this.nextKey.value, Red.Tween.Quadratic.InOut( ct / mt ));
    };

    _updateList[_propertyType["alpha"]] = function (t)
    {
        if( this.crtTime > t ) return;                  //첫 키프레임이 중간부터 시작할 경우

        if( t >= this.nextTime )
        {
            this.idx++;
            this.crtKey = this.nextKey || this.crtKey;      //첫 키프레임에는 넥스트가 널인 상태임.

            this.nextKey = this.keys[ this.idx ];
            if( !this.nextKey )
            {
                this.owner.alpha = this.crtKey.value;
                this.finish();
                return;
            }

            this.crtTime = this.crtKey.time;
            this.nextTime = this.nextKey.time;
        }

        var mt = this.nextTime - this.crtTime;
        var ct = t - this.crtTime;

        this.owner.alpha = Red.Math.Lerp( this.crtKey.value, this.nextKey.value, Red.Tween.Quadratic.InOut( ct / mt ));
    };

    _updateList[_propertyType["position.x"]] = function (t)
    {
        if( this.crtTime > t ) return;                  //첫 키프레임이 중간부터 시작할 경우

        if( t >= this.nextTime )
        {
            this.idx++;
            this.crtKey = this.nextKey || this.crtKey;      //첫 키프레임에는 넥스트가 널인 상태임.

            this.nextKey = this.keys[ this.idx ];
            if( !this.nextKey )
            {
                this.owner.position.x = this.crtKey.value;
                this.finish();
                return;
            }

            this.crtTime = this.crtKey.time;
            this.nextTime = this.nextKey.time;
        }

        var mt = this.nextTime - this.crtTime;
        var ct = t - this.crtTime;

        this.owner.position.x = Red.Math.Lerp( this.crtKey.value, this.nextKey.value, Red.Tween.Quadratic.InOut( ct / mt ));
    };

    _updateList[_propertyType["position.y"]] = function (t)
    {
        if( this.crtTime > t ) return;                  //첫 키프레임이 중간부터 시작할 경우

        if( t >= this.nextTime )
        {
            this.idx++;
            this.crtKey = this.nextKey || this.crtKey;      //첫 키프레임에는 넥스트가 널인 상태임.

            this.nextKey = this.keys[ this.idx ];
            if( !this.nextKey )
            {
                this.owner.position.y = this.crtKey.value;
                this.finish();
                return;
            }

            this.crtTime = this.crtKey.time;
            this.nextTime = this.nextKey.time;
        }

        var mt = this.nextTime - this.crtTime;
        var ct = t - this.crtTime;

        this.owner.position.y = Red.Math.Lerp( this.crtKey.value, this.nextKey.value, Red.Tween.Quadratic.InOut( ct / mt ));
    };

    _updateList[_propertyType["rotation"]] = function (t)
    {
        if( this.crtTime > t ) return;                  //첫 키프레임이 중간부터 시작할 경우

        if( t >= this.nextTime )
        {
            this.idx++;
            this.crtKey = this.nextKey || this.crtKey;      //첫 키프레임에는 넥스트가 널인 상태임.

            this.nextKey = this.keys[ this.idx ];
            if( !this.nextKey )
            {
                this.owner.rotaion = this.crtKey.value;
                this.finish();
                return;
            }

            this.crtTime = this.crtKey.time;
            this.nextTime = this.nextKey.time;
        }

        var mt = this.nextTime - this.crtTime;
        var ct = t - this.crtTime;

        this.owner.rotation = Red.Math.Lerp( this.crtKey.value, this.nextKey.value, Red.Tween.Quadratic.InOut( ct / mt )) * Red.Math.DEG_TO_RAD;
    };

    _updateList[_propertyType["width"]] = function (t)
    {
        if( this.crtTime > t ) return;                  //첫 키프레임이 중간부터 시작할 경우

        if( t >= this.nextTime )
        {
            this.idx++;
            this.crtKey = this.nextKey || this.crtKey;      //첫 키프레임에는 넥스트가 널인 상태임.

            this.nextKey = this.keys[ this.idx ];
            if( !this.nextKey )
            {
                this.owner.width = this.crtKey.value;
                this.finish();
                return;
            }

            this.crtTime = this.crtKey.time;
            this.nextTime = this.nextKey.time;
        }

        var mt = this.nextTime - this.crtTime;
        var ct = t - this.crtTime;

        this.owner.width = Red.Math.Lerp( this.crtKey.value, this.nextKey.value, Red.Tween.Quadratic.InOut( ct / mt ));
    };

    _updateList[_propertyType["height"]] = function (t)
    {
        if( this.crtTime > t ) return;                  //첫 키프레임이 중간부터 시작할 경우

        if( t >= this.nextTime )
        {
            this.idx++;
            this.crtKey = this.nextKey || this.crtKey;      //첫 키프레임에는 넥스트가 널인 상태임.

            this.nextKey = this.keys[ this.idx ];
            if( !this.nextKey )
            {
                this.owner.height = this.crtKey.value;
                this.finish();
                return;
            }

            this.crtTime = this.crtKey.time;
            this.nextTime = this.nextKey.time;
        }

        var mt = this.nextTime - this.crtTime;
        var ct = t - this.crtTime;

        this.owner.height = Red.Math.Lerp( this.crtKey.value, this.nextKey.value, Red.Tween.Quadratic.InOut( ct / mt ));
    };

    function LayoutAnimation_key(game)
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

        this.updateFunc = null;
    }

    LayoutAnimation_key.prototype = {
        create : function (owner, property, keys)
        {
            this.owner = owner;
            this.keys = keys;
            this.updateFunc = _updateList[_propertyType[property]];
        },

        play : function ()
        {
            this.idx = 0;
            this.isPlaying = true;
            this.crtKey = this.keys[this.idx];

            this.crtTime = this.crtKey.time;
            this.nextTime = 0;
            this.nextKey = null;

            this.updateFunc(0);
        },

        finish : function ()
        {
            this.isPlaying = false;
        },

        update : function (t)
        {
            if( !this.isPlaying ) return 1;

            this.updateFunc(t);

            return 0;
        },
    };

    return LayoutAnimation_key;
})();