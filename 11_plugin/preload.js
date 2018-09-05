var Red = Red || {};

Red.Preload = (function ()
{
    function Preload()
    {

    }

    Preload.load = function (preload, call, isSkipSpine, isHowler)
    {
        PIXI.loader.add('preload', preload);
        PIXI.loader.load(function (loader, resources)
        {
            var data = resources.preload.data;
            for( var d in data )
            {
                if(isSkipSpine && d === 'spine') continue;
                if(isHowler && d === 'sound') continue;

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

    Preload.spineLoad = function (spineData, textures, call)
    {
        var data = spineData;
        var atlas = new PIXI.spine.core.TextureAtlas();
        atlas.addTextureHash(textures, true);

        for( var i = 0; i < data.length; i++)
        {
            PIXI.loader.add(data[i].key, data[i].path,  { metadata: { spineAtlas: atlas }});
        }

        PIXI.loader.load( function (loader, resources)
        {
            call( resources );
        } );
    };

    Preload.howlerLoad = function ( soundData, call )
    {
        var sounds = {};
        var finishCall = function () {
            loadCount++;
            if( loadCount >= soundData.length )
            {
                call( sounds );
            }
        };

        var loadCount = 0;

        for( var i = 0; i < soundData.length; i++ )
        {
            var howl = new Howl({
                src: [soundData[i].path],
                autoplay: false,
                loop: false,
                volume: 1,
                onload: finishCall,
            });
            sounds[ soundData[i].key ] = howl;
        }
    };

    return Preload;
})();
