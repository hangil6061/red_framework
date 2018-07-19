var Red = Red || {};

Red.Update = (function ()
{
    function Update( )
    {
        this.game = null;

        this.preUpdate = [];
        this.normalUpdate = [];
        this.postUpdate = [];
        this.fixedUpdate = [];
        this.lastFrameFunc = null;
        this.afterRenderFunc = null;


        this.time = null;
        this.cameraPosition = null;
        this.cameraUpdate = null;
        this.worldContainer = null;
        this.debugContainer = null;
        this.debug = null;

        this.render = null;
        this.stage = null;

        this.physicsDraw = null;
        this.physicsUpdate = null;
        this.updateBind = this.update.bind( this );
    }

    Update.prototype = {
        boot : function (game)
        {
            this.game = game;
            this.time = game.time;
            this.cameraUpdate = game.camera.update.bind( game.camera );
            this.cameraPosition = game.camera.position;
            this.worldContainer = game.world.worldContainer;
            this.debugContainer = game.world.debugContainer;
            this.physicsStep = game.physicsManager.step.bind( game.physicsManager );
            this.physicsDraw = game.physicsManager.draw.bind( game.physicsManager );
            this.debug = game.debugManager;

            this.lastFrameFunc = game.actionsManager.lastFrameFunc;
            this.afterRenderFunc = game.actionsManager.afterRenderFunc;

            this.render = game.renderer;
            this.stage = game.stage;

            window.requestAnimationFrame( this.updateBind );
        },

        update: function ()
        {
            if( this.game.stats )
            {
                this.game.stats.begin();
            }
            var self = this;
            var time = self.time;
            var curTime = Date.now();
            time.deltaTime = (curTime - time.lastTime);
            time.lastTime = curTime;
            var deltaTime = time.deltaTime * 0.001 * time.timeScale;

            var i = 0;
            var updateCache = null;
            var len = 0;

            self.debug.clear();

            var fixedDelta = curTime - time.lastFixedTime;
            if (fixedDelta >= time.fixedTime)
            {
                var fixedTimeCache = time.fixedTime;
                var fixedTime = time.fixedTime * 0.001 * time.timeScale;
                updateCache = self.fixedUpdate;
                len = updateCache.length;

                while (fixedDelta >= fixedTimeCache)
                {
                    for (i = 0; i < len; i++)
                    {
                        updateCache[i](fixedTime);
                    }
                    this.physicsStep(fixedTime);

                    fixedDelta -= fixedTimeCache;
                }

                time.lastFixedTime = curTime - fixedDelta;
            }

            updateCache = self.preUpdate;
            len = updateCache.length;
            for (i = 0; i < len; i++)
            {
                updateCache[i](deltaTime);
            }

            updateCache = self.normalUpdate;
            len = updateCache.length;
            for (i = 0; i < len; i++)
            {
                updateCache[i](deltaTime);
            }

            updateCache = self.postUpdate;
            len = updateCache.length;
            for (i = 0; i < len; i++)
            {
                updateCache[i](deltaTime);
            }

            updateCache = self.lastFrameFunc;
            len = updateCache.length;
            for (i = 0; i < len; i++)
            {
                updateCache[i]();
            }
            updateCache.length = 0;

            self.cameraUpdate( deltaTime );
            self.worldContainer.position.set( -self.cameraPosition.x,  -self.cameraPosition.y );
            self.debugContainer.position.set( -self.cameraPosition.x,  -self.cameraPosition.y );

            if( this.game.isDebug )
            {
                this.physicsDraw();
                var goDebug = this.debug.gameObjectDebugs;
                for(i = 0; i < goDebug.length; i++ )
                {
                    goDebug[i].draw();
                }
            }

            time.fpsCount++;
            if( curTime - time.lastFpsTime >= 1000 )
            {
                time.fps = time.fpsCount;
                time.fpsCount = 0;
                time.lastFpsTime = curTime;
            }

            //var endTime = Date.now();
            //console.log( endTime - curTime );

            this.render.render(this.stage);

            updateCache = self.afterRenderFunc;
            len = updateCache.length;
            for (i = 0; i < len; i++)
            {
                updateCache[i]();
            }
            updateCache.length = 0;

            window.requestAnimationFrame(this.updateBind);
            if(this.game.stats)
            {
                this.game.stats.end();
            }
        }
    };

    return Update;
})();
