var Red = Red || {};

Red.MatterEngine = (function ()
{
    function MatterEngine(game)
    {
        this.game = game;
        this.engine = Matter.Engine.create();
        this.runner = Matter.Runner.create();
        this.world = this.engine.world;

        Matter.Events.on(this.engine, 'collisionStart', function(event) {

            const length = event.pairs.length;
            for (let i = 0; i < length; i++)
            {
                const pair = event.pairs[i];
                Matter.Events.trigger(pair.bodyA, 'collisionStart', pair.bodyB);
                Matter.Events.trigger(pair.bodyB, 'collisionStart', pair.bodyA);
            }
        });
    }

    MatterEngine.prototype = {
        update : function( delta )
        {
            Matter.Runner.tick( this.runner, this.engine, delta );
        },

        addBody : function( body )
        {
            Matter.World.add( this.world, body );
        },

        removeBody : function (body)
        {
            Matter.World.remove( this.world, body );
        }
    };

    return MatterEngine;
})();
