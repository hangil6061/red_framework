var Red = Red || {};

Red.PoolManager3 = (function ()
{
    function PoolManager3(game)
    {
        this.game = game;
        this.origins = {};
        this.pools = {};
    }

    PoolManager3.prototype = {

        add : function (type, origin)
        {
            this.origins[type] = origin;
        },

        get : function( type )
        {
            var item = this._getItem( type );
            item.onEnable && item.onEnable();
            return item;
        },

        _getItem : function ( type )
        {
            var pool = this._getPool(type);

            var item = null;
            if( pool.pool.length > 0 )
            {
                item = pool.pool.pop();
            }
            else
            {
                item = new this.origins[type](this.game);
                item.name = type;
                //item.onCreate && item.onCreate();
            }
            pool.use.push( item );
            return item;
        },

        _getPool : function ( type )
        {
            var pool = this.pools[ type ];
            if( !pool )
            {
                pool = this.pools[ type ] = {
                    pool : new Red.Stack(),
                    use : new Red.Stack()
                };
            }
            return pool
        },

        return : function (type, item )
        {
            item.onDisable && item.onDisable();
            var pool = this._getPool(type);
            pool.pool.push( item );
            pool.use.remove( item );
        },

        getUse : function ( type ) {
            var pool = this._getPool(type);
            return pool.use;
        }

    };

    return PoolManager3;
})();
