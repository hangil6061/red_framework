var Red = Red || {};

Red.SignalManager = (function ()
{

    function SignalManager()
    {
        this.signals = [];
    }

    SignalManager.prototype = {
        addSignal : function (key)
        {
            var signal = this.signals[key];
            if( !signal )
            {
                signal = new Red.Signal(key.toString());
                this.signals[key] = signal;
            }

            return signal;
        },

        getSignal : function (key)
        {
            var signal = this.signals[key];
            if( signal )
            {
                return signal;
            }
            else
            {
                return this.addSignal(key);
            }
        },
    };

    return SignalManager;
})();