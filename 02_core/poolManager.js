var Red = Red || {};

Red.PoolManager = (function ()
{
    function PoolManager()
    {
        this.game = null;
        this.pools = {};
    }

    PoolManager.prototype = {
        boot : function (game)
        {
            this.game = game;
        },

        get : function ( prototype )
        {
            var item = this._getItem( prototype );
            item.onGet && item.onGet();
            return item;
        },

        _getItem : function ( prototype )
        {
            var pool = this._getPool(prototype.name);

            var item = null;
            if( pool.pool.length > 0 )
            {
                item = pool.pool.shift();
            }
            else
            {
                item = new prototype(this.game);
                item.onCreate && item.onCreate();
            }
            pool.use.push( item );
            return item;
        },

        _getPool : function (name)
        {
            var pool = this.pools[ name ];
            if( !pool )
            {
                pool = this.pools[ name ] = {
                    pool : [],
                    use : []
                };
            }
            return pool
        },

        return : function ( item )
        {
            item.onReturn && item.onReturn();
            var pool = this._getPool(item.name);
            pool.pool.push( item );
            var useIdx = pool.use.indexOf( item );
            if( useIdx > -1 )
            {
                pool.use.splice( useIdx, 1 );
            }
        },
        
        getUse : function (prototype)
        {
            var pool = this._getPool(prototype.name);
            return pool.use;
        }
    };

    return PoolManager;
})();