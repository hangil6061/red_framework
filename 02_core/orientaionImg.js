var Red = Red || {};

Red.OrientationImg = (function ()
{
    function OrientationImg( game )
    {
        this.game = game;
        this.coverImg = null;
    }

    OrientationImg.prototype = {
        create : function ( src ) {
            this.coverImg = document.createElement('img');
            document.body.appendChild(this.coverImg);
            this.coverImg.src = src;
            this.coverImg.style.width = '100%';
            this.coverImg.style.height = '100%';
            this.coverImg.style.position = 'absolute';
            window.addEventListener( "orientationchange", this.onOrientationChange.bind(this) );
            this.onOrientationChange();
        },

        onOrientationChange : function ()
        {
            if (window.orientation === 90 || window.orientation === -90)
            {
                this.coverImg.style.visibility = 'visible';
            }
            else
            {
                this.coverImg.style.visibility = 'hidden';
            }
        }
    };

    return OrientationImg;
})();
