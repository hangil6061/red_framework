var Red = Red || {};

Red.Preload = (function ()
{
    function Preload()
    {

    }

    Preload.load = function (preload, call)
    {
        PIXI.loader.add('preload', preload);
        PIXI.loader.load(function (loader, resources)
        {
            var data = resources.preload.data;
            for( var d in data )
            {
                if( data.hasOwnProperty( d ) )
                {
                    var data2 = data[d];
                    for( var i = 0; i < data2.length; i++)
                    {
                        PIXI.loader.add(data2[i].key, data2[i].path);
                    }
                }
            }

            PIXI.loader.load( function (loader, resources)
            {
                call( resources );
            } );
        });
    };

    return Preload;
})();