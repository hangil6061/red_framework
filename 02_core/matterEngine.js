var Red = Red || {};

Red.MatterEngine = (function ()
{
    function MatterEngine(game)
    {
        this.game = game;
        this.engine = Matter.Engine.create();
        this.runner = Matter.Runner.create();
        this.world = this.engine.world;


        this.runner.deltaMin  = 0;

        // this.world.gravity.scale = 0.01;
        // this.world.gravity.y = 1.5;
        // this.world.gravity.x = -0.1;
        // console.log( this.engine );

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
            if( delta > 0 )
            {
                Matter.Runner.tick( this.runner, this.engine );
            }
        },

        addBody : function( body )
        {
            Matter.World.add( this.world, body );
        },

        removeBody : function (body)
        {
            Matter.World.remove( this.world, body );
        },

        pause : function () {

        },
        resume : function () {

        },
    };

    return MatterEngine;
})();
