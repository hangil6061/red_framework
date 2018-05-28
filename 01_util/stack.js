var Red = Red || {};

Red.Stack = (function ()
{
    function Stack(size)
    {
        this.arr = [];
        this.arr.length = this.size = size || 100;
        this.length = 0;
    }

    Stack.prototype = {
        clear : function()
        {
            for (let i = 0; i < this.length; i++)
            {
                this.arr[i] = undefined;
            }
            this.length = 0;
        },

        push : function(item)
        {
            if( this.length >= this.size )
            {
                this.arr.length += 100;
                this.size = this.arr.length;
            }

            this.arr[ this.length++ ] = item;
        },

        pop : function()
        {
            let item = this.arr[ --this.length ];
            this.arr[ this.length ] = undefined;
            return item;
        },

        remove : function(item)
        {
            var idx = this.arr.indexOf( item );
            if( idx > -1 )
            {
                this.splice( idx, 1 );
            }
        },

        splice : function( startIdx, removeCount )
        {
            let i, length = this.length;

            if (startIdx >= length || removeCount <= 0) {
                return;
            }

            removeCount = (startIdx + removeCount > length ? length - startIdx : removeCount);

            let len = length - removeCount;

            for (i = startIdx; i < len; i++)
            {
                this.arr[i] = this.arr[i + removeCount];
                this.arr[i + removeCount] = undefined;
            }

            this.length = len;
        }
    };

    return Stack;

})();