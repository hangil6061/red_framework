var Red = Red || {};

Red.RESIZETYPE = {
    base : 0,
    none : 1,
    stretch : 2,
    inGameResize : 3,
};

//확장0 축소1
Red.RESPONSIVETYPE = {
    ALL_INC : 0,
    LR_DEC : 1,
    UD_DEC : 2,
    ALL_DEC : 3,
};

Red.Game = (function ()
{
    var view = null;
    var mWidth = 800;
    var mHeight = 600;
    var viewWidth = 0;
    var viewHeight = 0;

    var resizeEvent = null;

    Red.SYSTEMEVENT = {
        OnWindowResize : "OnWindowResize",
    };

    var resizeFunc = {};

    function Game( config )
    {
        resizeFunc[Red.RESIZETYPE.base] = resizeBase.bind(this);
        resizeFunc[Red.RESIZETYPE.none] = resizeNone.bind(this);
        resizeFunc[Red.RESIZETYPE.stretch] = resizeStretch.bind(this);
        resizeFunc[Red.RESIZETYPE.inGameResize] = resizeInGameResize.bind(this);

        config = config || {};
        config.width = config.width || window.innerWidth;
        config.height = config.height || window.innerHeight;
        config.resolution = config.resolution || 1;
        config.antialias = config.antialias || false;
        config.backgroundColor = config.backgroundColor || 0x000000;
        config.resizeType = config.resizeType || Red.RESIZETYPE.base;
        config.maxWidth = config.maxWidth || config.width;
        config.maxHeight = config.maxHeight || config.height;
        config.minWidth = config.minWidth || config.width;
        config.minHeight = config.minHeight || config.height;
        config.responsiveType = config.responsiveType || Red.RESPONSIVETYPE.ALL_INC;

        // Red.game = this;

        this.width = config.width;
        this.height = config.height;
        this.baseWidth = config.baseWidth || this.width;
        this.baseHegiht = config.baseHegiht || this.height;
        this.halfWidth = config.width / 2;
        this.halfHeight = config.height / 2;
        this.aspectRatio = this.height / this.width;
        this.resizeType = config.resizeType;

        document.body.style.margin = '0';

        const maxWidth = config.maxWidth;
        const maxHeight = config.maxHeight;
        const minWidth = config.minWidth;
        const minHeight = config.minHeight;
        const responsiveType = config.responsiveType;
        const innerWidth = window.innerWidth;
        const innerHeight = window.innerHeight;
        const innerAspectRatio = innerHeight / innerWidth;

        this.maxWidth = maxWidth;
        this.maxHeight = maxHeight;
        this.minWidth = minWidth;
        this.minHeight = minHeight;
        this.responsiveType = responsiveType;


        if( this.aspectRatio > innerAspectRatio )   //게임해상도보다 가로로 큼
        {
            if( (responsiveType & Red.RESPONSIVETYPE.LR_DEC) === Red.RESPONSIVETYPE.LR_DEC )
            {
                const scale = innerWidth / this.width;
                const scaledH = this.height * scale;
                const scaledExcessH = scaledH - innerHeight;
                const excessH = scaledExcessH / scale;
                this.height -= excessH;
                if( this.height < minHeight )
                {
                    this.height = minHeight;
                }
                console.log( this.width );
            }
            else
            {
                this.width *= this.aspectRatio / innerAspectRatio;
                if( this.width > maxWidth )
                {
                    this.width = maxWidth;
                }
            }
        }
        else                                        //게임해상도보다 세로로 큼
        {
            if( (responsiveType & Red.RESPONSIVETYPE.UD_DEC) === Red.RESPONSIVETYPE.UD_DEC )
            {
                const scale = innerHeight / this.height;
                const scaledW = this.width * scale;
                const scaledExcessW = scaledW - innerWidth;
                const excessW = scaledExcessW / scale;
                this.width -= excessW;
                if( this.width < minWidth )
                {
                    this.width = minWidth;
                }
                console.log( this.height );
            }
            else
            {
                this.height *= innerAspectRatio / this.aspectRatio;
                if( this.height > maxHeight )
                {
                    this.height = maxHeight;
                }
            }
        }

        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
        this.aspectRatio = this.height / this.width;

        this.renderer = new PIXI.autoDetectRenderer({ width:this.width, height:this.height, backgroundColor:config.backgroundColor, antialias : config.antialias, resolution : config.resolution});
        mWidth = this.width;
        mHeight = this.height;

        // this.pixi.renderer.options.antialias = true;
        // this.pixi.renderer.roundPixels = true;
        // this.pixi.renderer.forceFXAA = true;

        this.stats = new Stats();
        this.stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild( this.stats.dom );


        this.stage = new PIXI.Container();
        this.isDebug = false;

        this.world = new Red.World();
        this.camera = new Red.Camera();
        this.time = new Red.Time();
        this.sceneManager = new Red.SceneManager();
        this.update = new Red.Update();
        this.factory = new Red.Factory();
        this.actionsManager = new Red.ActionManager();
        this.containerManager = new Red.ContainerManager();
        this.signalManager = new Red.SignalManager();
        this.physicsManager = new Red.PhysicsManager();
        this.debugManager = new Red.DebugManager();
        this.pointerManager = new Red.PointerManager();
        this.soundManager = new Red.SoundManager();
        this.httpManager = new Red.HttpManager();
        this.keyManager = new Red.KeyManager();
        this.layoutManager = new Red.LayoutManager();
        this.poolManager = new Red.PoolManager();

        this.world.boot(this);
        this.camera.boot(this);
        this.update.boot(this);
        this.factory.boot(this);
        this.sceneManager.boot( this );
        this.actionsManager.boot( this );
        this.containerManager.boot( this );
        this.debugManager.boot( this );
        this.layoutManager.boot( this );
        this.poolManager.boot( this );

        view = this.renderer.view;
        document.body.appendChild( view );

        resizeEvent = this.signalManager.addSignal(Red.SYSTEMEVENT.OnWindowResize);

        resizeFunc[this.resizeType]();
        window.onorientationchange = resizeFunc[this.resizeType];
        window.onresize = resizeFunc[this.resizeType];

        this.requestFullScreen = requestFullScreen;

        // '게임화면'에 대한 '실제화면' 비율
        this.getScreenRate = function ()
        {
            return viewHeight / this.height;
        };

        return this;
    }

    function requestFullScreen()
    {
        if(document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if(document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if(document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if(document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    }

    function resizeInGameResize()
    {
        this.width = this.baseWidth;
        this.height = this.baseHegiht;
        this.aspectRatio = this.height / this.width;

        const maxWidth = this.maxWidth;
        const maxHeight = this.maxHeight;

        var innerWidth = window.innerWidth;
        var innerHeight = window.innerHeight;
        const innerAspectRatio = innerHeight / innerWidth;


        if( this.aspectRatio > innerAspectRatio )
        {
            this.width = this.baseWidth * (this.aspectRatio / innerAspectRatio);
            // innerWidth = this.baseWidth * (innerAspectRatio / this.aspectRatio);

            if( this.width > maxWidth )
            {
                const rate = innerWidth / this.width;
                this.width = maxWidth;
                innerWidth = this.width * rate;
            }
            // console.log('가로로 더김');
        }
        else
        {
            this.height *= innerAspectRatio / this.aspectRatio;
            if( this.height > maxHeight )
            {
                const rate = innerHeight / this.height;
                this.height = maxHeight;
                innerHeight = this.height * rate;
            }
            // console.log('세로로 더김');
        }

        this.halfWidth = this.width / 2;
        this.halfHeight = this.height / 2;
        this.aspectRatio = this.height / this.width;
        this.renderer.resize( this.width - 1, this.height );

        //가운데 정렬
        view.style.left = '50%';
        view.style.top = '50%';
        view.style.transform = 'translate3d( -50%, -50%, 0 )';

        view.style.width = innerWidth + 'px';
        view.style.height = innerHeight + 'px';
        view.style.position = 'absolute';
        resizeEvent.dispatch();
    }

    function resizeStretch()
    {
        //꽉채우기
        viewWidth = window.innerWidth;
        viewHeight = window.innerHeight;
        view.style.position = "absolute";
        view.style.width = "100%";
        view.style.height = "100%";
        resizeEvent.dispatch();
    }

    function resizeBase()
    {
        //비율에 맞게
        var ratio = mWidth / mHeight;
        if (window.innerWidth / window.innerHeight >= ratio)
        {
            viewWidth = window.innerHeight * ratio;
            viewHeight = window.innerHeight;
        }
        else
        {
            viewWidth = window.innerWidth;
            viewHeight = window.innerWidth / ratio;
        }

        //가운데 정렬
        view.style.left = '50%';
        view.style.top = '50%';
        view.style.transform = 'translate3d( -50%, -50%, 0 )';

        view.style.width = viewWidth + 'px';
        view.style.height = viewHeight + 'px';
        view.style.position = 'absolute';

        // view.style.left = ((window.innerWidth - viewWidth) >> 1) + 'px';
        // view.style.top = ((window.innerHeight - viewHeight) >> 1) + 'px';

        resizeEvent.dispatch();
    }

    function resizeNone() {

    }

    return Game;
})();
