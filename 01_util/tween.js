var Red = Red || {};

Red.Tween = (function ()
{
    var Tween = {};
    Tween.None = {
        none : function (k)
        {
            return k;
        }
    };

    Tween.Bounce = {
        In: function ( k ) {
            return 1 - Tween.Bounce.Out( 1 - k );
        },
        Out: function ( k ) {
            if ( k < ( 1 / 2.75 ) ) {
                return 7.5625 * k * k;
            } else if ( k < ( 2 / 2.75 ) ) {
                return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
            } else if ( k < ( 2.5 / 2.75 ) ) {
                return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
            } else {
                return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
            }
        },
    };

    Tween.Quadratic = {
        In: function (k)
        {
            return k * k;
        },
        Out: function (k)
        {
            return k * ( 2 - k );
        },
        InOut: function (k)
        {
            if (( k *= 2 ) < 1) return 0.5 * k * k;
            return -0.5 * ( --k * ( k - 2 ) - 1 );
        }
    };

    Tween.Cubic = {
        In: function ( k ) {
            return k * k * k;
        },
        Out: function ( k ) {
            return --k * k * k + 1;
        },
        InOut: function ( k ) {
            if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
            return 0.5 * ( ( k -= 2 ) * k * k + 2 );
        }
    };

    Tween.Sinusoidal = {
        In: function ( k ) {
            if (k === 0) return 0;
            if (k === 1) return 1;
            return 1 - Math.cos( k * Math.PI / 2 );
        },
        Out: function ( k ) {
            if (k === 0) return 0;
            if (k === 1) return 1;
            return Math.sin( k * Math.PI / 2 );
        },
        InOut: function ( k ) {
            if (k === 0) return 0;
            if (k === 1) return 1;
            return 0.5 * ( 1 - Math.cos( Math.PI * k ) );
        }
    };

    Tween.Exponential = {
        In: function ( k ) {
            return k === 0 ? 0 : Math.pow( 1024, k - 1 );
        },
        Out: function ( k ) {
            return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
        },
        InOut: function ( k ) {
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
            return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
        }
    };

    Tween.Circular = {
        In: function ( k ) {
            return 1 - Math.sqrt( 1 - k * k );
        },
        Out: function ( k ) {

            return Math.sqrt( 1 - ( --k * k ) );

        },
        InOut: function ( k ) {
            if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
            return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
        }
    };

    Tween.Elastic = {
        In: function ( k ) {
            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
        },
        Out: function ( k ) {
            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
        },
        InOut: function ( k ) {
            var s, a = 0.1, p = 0.4;
            if ( k === 0 ) return 0;
            if ( k === 1 ) return 1;
            if ( !a || a < 1 ) { a = 1; s = p / 4; }
            else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
            if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
            return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
        }
    };

    Tween.Back = {
        In: function ( k ) {
            var s = 1.70158;
            return k * k * ( ( s + 1 ) * k - s );

        },
        Out: function ( k ) {
            var s = 1.70158;
            return --k * k * ( ( s + 1 ) * k + s ) + 1;
        },
        InOut: function ( k ) {
            var s = 1.70158 * 1.525;
            if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
            return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
        }
    };

    return Tween;
})();