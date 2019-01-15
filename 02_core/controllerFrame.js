var Red = Red || {};

Red.ControllerFrame = (function ()
{
    function ControllerFrame(view)
    {
        this.canvas = view;

        this.canvas.className += ' gameCanvas';

        this.div = document.createElement('div');
        document.body.appendChild( this.div );

        this.touch = document.createElement('div');
        this.div.appendChild( this.touch );
        this.touch.textContent = "Touch";

        this.div.className += ' controllerFrame';
        this.touch.className += ' touchFrame';

        window.addEventListener( 'resize', this.onResize.bind(this) );
        this.onResize();
    }

    ControllerFrame.prototype = {
        onResize : function ( )
        {
            const calc = window.innerHeight - parseInt( this.canvas.style.height );

            this.div.style.height = calc + 'px';
            this.div.style.top = this.canvas.style.height;
            this.div.style['line-height'] = this.div.style.height;
        }
    };

    return ControllerFrame;
})();
