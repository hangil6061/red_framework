var Red = Red || {};

Red.LayoutManager = (function ()
{
    function LayoutManager()
    {
        this.game = null;
        this.layouts = {};
    }

    LayoutManager.prototype = {
        boot : function (game)
        {
            this.game = game;
        },

        addLayout : function (key, data, container)
        {
            var layout = new Red.Layout(this.game);
            layout.create( data );
            this.layouts[ key ] = layout;

            if(container)
            {
                container.addChild( layout.rootContainer );
            }

            return layout;
        },

        removeLayout : function (key)
        {
            this.layouts[ key ] = null;
        },
        
        getLayout : function (key)
        {
            return this.layouts[key];
        }
    };

    return LayoutManager;
})();