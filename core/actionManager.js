var Red = Red || {};

Red.ActionManager = (function ()
{
    function ActionManager()
    {
        this.actions = [];
        this.fixedActions = [];

        this.lastFrameFunc = []; //마지막 프레임에 한번
        this.afterRenderFunc = [];
    }

    ActionManager.prototype = {
        boot: function (game)
        {
            game.update.normalUpdate.push( this.update.bind( this ) );
            game.update.fixedUpdate.push( this.fixedUpdate.bind( this ) );
        },

        clear : function ()
        {
            this.actions.length = 0;
            this.fixedActions.length = 0;
            this.lastFrameFunc.length = 0;
            this.afterRenderFunc.length = 0;
        },

        addAction : function (action)
        {
            action.time = 0;
            var bind = action.update.bind( action );
            this.actions.push( bind );
        },

        addLoopAction : function (action)
        {
            this.actions.push( action );
        },

        addFixedLoopAction : function (action)
        {
            this.fixedActions.push( action );
        },

        addLastFrameFunc : function (func)
        {
            this.lastFrameFunc.push(func);
        },

        addAfterRenderFunc : function (func)
        {
            this.afterRenderFunc.push(func);
        },


        removeAction : function (index)
        {
            this.actions.splice(index,1);
        },

        update : function (delta)
        {
            var len = this.actions.length;
            for(var i = 0; i < len;)
            {
                if( this.actions[i](delta) )
                {
                    i++;
                }
                else
                {
                    this.removeAction( i );
                    len = this.actions.length;
                }
            }
        },

        addFixedAction : function (action)
        {
            this.fixedActions.push( action.update.bind( action ) );
        },

        removeFixedAction : function (index)
        {
            this.fixedActions.splice(index,1);
        },

        fixedUpdate : function (delta)
        {
            var len = this.fixedActions.length;
            for(var i = 0; i < len;)
            {
                if( this.fixedActions[i](delta) )
                {
                    i++;
                }
                else
                {
                    this.removeFixedAction( i );
                    len = this.fixedActions.length;
                }
            }
        },
    };

    return ActionManager;
})();