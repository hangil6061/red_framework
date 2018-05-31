var Red = Red || {};

Red.PoolManager2 = (function ()
{
    function PoolManager2(game)
    {
        this.game = game;
        this.pools = {};
    }

    PoolManager2.prototype = {

        get : function( type )
        {
            let item = this._getItem( type );
            item.onEnable && item.onEnable();
            return item;
        },

        _getItem : function ( type )
        {
            let pool = this._getPool(type);

            let item = null;
            if( pool.pool.length > 0 )
            {
                item = pool.pool.pop();
            }
            else
            {
                item = new type(this.game);
                if( !item.name )
                {
                    item.name = type.name;
                }
                //item.onCreate && item.onCreate();
            }
            pool.use.push( item );
            return item;
        },

        _getPool : function ( type )
        {
            let pool = this.pools[ type.name ];
            if( !pool )
            {
                pool = this.pools[ type.name ] = {
                    pool : new Red.Stack(),
                    use : new Red.Stack()
                };
            }
            return pool
        },

        return : function ( item )
        {
            item.onDisable && item.onDisable();
            let pool = this._getPool(item);
            pool.pool.push( item );
            pool.use.remove( item );
        },

        getUse ( type )
        {
            let pool = this._getPool(type);
            return pool.use;
        }
    };

    return PoolManager2;
})();