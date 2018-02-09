var Red = Red || {};

Red.ToggleGroup = (function ()
{
    function ToggleGroup( game )
    {
        this.game = game;
        this.rootContainer = null;
        this.toggles = [];
        this.selectIdx = -1;
        this.onToggleClickCall = null;
    }

    ToggleGroup.prototype = {

        create : function (root, toggles, call)
        {
            this.rootContainer = root;
            this.toggles.length = 0;
            this.onToggleClickCall = call;

            var self = this;
            for( var i = 0; i < toggles.length; i++ )
            {
                toggles[i].index = i;
                toggles[i].onSprite.visible = false;
                toggles[i].button.buttonAction = (function ()
                {
                    self.setSelect(this.index);
                    self.onToggleClickCall && self.onToggleClickCall(this.index);
                }).bind( toggles[i] );

                this.toggles.push( toggles[i] );
            }
        },

        setSelect : function (idx)
        {
            if( idx === this.selectIdx ) return;
            
            this.resetSelect();

            var targetToggle = this.toggles[idx];
            if( targetToggle )
            {
                targetToggle.onSprite.visible = true;
                this.selectIdx = idx;
                this.toggles[this.selectIdx].onEnable && this.toggles[this.selectIdx].onEnable(this.selectIdx);
            }
        },

        resetSelect : function ()
        {
            if(this.selectIdx === -1) return;
            this.toggles[this.selectIdx].onSprite.visible = false;
            this.toggles[this.selectIdx].onDisable && this.toggles[this.selectIdx].onDisable(this.selectIdx);
            this.selectIdx = -1;
        },

        reset : function ()
        {
            for( var i = 0; i < this.toggles.length; i++  )
            {
                this.toggles[i].onSprite.visible = false;
                this.toggles[i].onDisable && this.toggles[i].onDisable(i);
            }
            this.selectIdx = -1;
        },
    };

    ToggleGroup.createToggle = function ( button, onSprite )
    {
        return { button : button, onSprite : onSprite, index : 0, onDisable : null, onEnable : null };
    };

    return ToggleGroup;
})();