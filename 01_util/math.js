var Red = Red || {};

Red.Math = (function ()
{
    function Mathf()
    {
    }

    /**
     *
     * @param start {number}
     * @param end {number}
     * @param t {number} 0 ~ 1 사이값
     * @returns {*}
     */
    Mathf.Lerp = function (start, end, t)
    {
        return start + (end - start) * t;
    };

    /**
     *
     * @param color1 {number} 0x000000 ~ 0xffffff
     * @param color2 {number} 0x000000 ~ 0xffffff
     * @param t {number} 0 ~ 1 사이값
     * @returns {*}
     * @constructor
     */
    Mathf.LerpColor = function ( color1, color2, t ) {
        const r1 = color1 >> 16;
        const g1 = ( color1 >> 8 ) - ( r1 << 8 );
        const b1 = ( color1 ) - ( r1 << 16 ) - ( g1 <<  8);

        const r2 = color2 >> 16;
        const g2 = ( color2 >> 8 ) - ( r2 << 8 );
        const b2 = ( color2 ) - ( r2 << 16 ) - ( g2 <<  8);

        const r = Mathf.Lerp( r1, r2, t );
        const g = Mathf.Lerp( g1, g2, t );
        const b = Mathf.Lerp( b1, b2, t );

        return Mathf.RgbToColor( r, g, b );
    };

    Mathf.RgbToColor = function( r, g, b ) {
        return (r << 16) + (g << 8) +  (b);
    };

    /**
     *
     * @param min {int}
     * @param max {int}
     * @returns {number}
     * min 포함, max 미포함
     */
    Mathf.RandomInt = function (min, max)
    {
        return Math.floor( min + Math.random() * (max - min));
    };

    Mathf.RandomFloat = function (min, max)
    {
        return  min + Math.random() * (max - min);
    };

    Mathf.Shuffle = function( arr, max, startIdx )
    {
        startIdx = startIdx || 0;

        for( var i = 0;i < max; i++ )
        {
            var src = Mathf.RandomInt( startIdx, arr.length );
            var dst = Mathf.RandomInt( startIdx, arr.length );
            var temp = arr[src];
            arr[src] = arr[dst];
            arr[dst] = temp;
        }
        return arr;
    };

    /**
     *
     * @param a {Red.Vector2} or { x , y }
     * @param b {Red.Vector2} or { x , y }
     * @returns {number}
     */
    Mathf.Distance = function (a, b)
    {
        return Math.sqrt( ((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y )) );
    };

    /**
     *
     * @param aX
     * @param aY
     * @param bX
     * @param bY
     * @returns {number}
     * @constructor
     */
    Mathf.Distance2 = function (aX, aY, bX, bY)
    {
        return Math.sqrt( ((aX - bX) * (aX - bX)) + ((aY - bY) * (aY - bY )) );
    };

    Mathf.Clamp = function(v, min, max)
    {
        return v < min ? min : (v > max ? max : v);
    };

    Mathf.CopyObj = function(obj) {
        if (null === obj || "object" !== typeof obj) return obj;
        var copy = obj.constructor();
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
        }
        return copy;
    };

    Mathf.Normalized = function (vec)
    {
        var invLen = (vec.x !== 0 || vec.y !== 0) ? 1 / Math.sqrt(vec.x * vec.x + vec.y * vec.y) : 0;
        vec.x *= invLen;
        vec.y *= invLen;
        return vec;
    };

    /**
     * 0---->1  왼쪽에서 오른쪽으로 가는 수평한 선분일 경우  위에서 아래로 가는 선분과 충돌하면 den은 음수,
     *                                                  아래에서 위로 가는 선분과 충돌하면 den은 양수
     *
     *          위에서 아래로 가는 수직인 선분일 경우  왼쪽에서 오른쪽으로 가는 선분과 충돌하면 den은 음수
     *                                             오른쪽에서 왼쪽으로 가는 선분과 충돌하면 den은 양수
     *
     * @param point1 vector2 or {x,y} or float
     * @param point2 vector2 or {x,y} or float
     * @param point3 vector2 or {x,y} or float
     * @param point4 vector2 or {x,y} or float
     * @param x3     float
     * @param y3     float
     * @param x4     float
     * @param y4     float
     * @returns {number}  충돌일 경우 0 이외의 값 반환, 충돌 아닐경우 0 반환.
     * @constructor
     */
    Mathf.SegmentCollision = function ( point1, point2, point3, point4, x3, y3, x4, y4 )
    {
        if (x3)
        {
            point1 = {x: point1, y: point2};
            point2 = {x: point3, y: point4};
            point3 = {x: x3, y: y3};
            point4 = {x: x4, y: y4};
        }

        var den = ( point4.y - point3.y ) * ( point2.x - point1.x ) - ( point4.x - point3.x  ) * ( point2.y - point1.y );
        if (den === 0)
        {
            return 0;
        }

        var ua = (( point4.x - point3.x ) * ( point1.y - point3.y ) - ( point4.y - point3.y ) * ( point1.x - point3.x )) / den;
        var ub = (( point2.x - point1.x ) * ( point1.y - point3.y ) - ( point2.y - point1.y ) * ( point1.x - point3.x )) / den;

         // if (ua >= 0 && ua <= 1 || ub >= 0 && ub <= 1)
         // {
         //     console.log(point1.x + "\n" + point1.y + "\n" + point2.x + "\n" + point2.y
         //     + "\n" + point3.x + "\n" + point3.y + "\n" + point4.x + "\n" + point4.y
         //     + "\n" + den + "\n" + ua + "\n" + ub);
         // }

        if( ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1 )
        {
            // console.log(point1.x.toFixed(3) + "\n" + point1.y.toFixed(3) + "\n" + point2.x.toFixed(3) + "\n" + point2.y.toFixed(3) );
            // console.log(point3.x.toFixed(3) + "\n" + point3.y.toFixed(3) + "\n" + point4.x.toFixed(3) + "\n" + point4.y.toFixed(3) );
            // console.log(den.toFixed(3) + "\n" + ua.toFixed(3) + "\n" + ub.toFixed(3) );
            return ub;
        }
        else return 0;
    };

    Mathf.LineToLine = function( a1x, a1y, a2x, a2y, b1x, b1y, b2x, b2y)
    {
        const v3x_ = a1x - b1x;
        const v3y_ = a1y - b1y;

        const v2x = b2x - b1x;
        const v2y = b2y - b1y;
        const v1x = a2x - a1x;
        const v1y = a2y - a1y;

        //오른쪽면만 검사
        const den = v2y * v1x - v2x * v1y;
        if (den <= 0)
        {
            return null;
        }
        const t = (v2x * v3y_ - v2y * v3x_) / den;
        const t_ = (v1x * v3y_ - v1y * v3x_) / den;

        //오른쪽 왼쪽 둘다 검사
        // const t = (v3x * v2y - v3y * v2x) / (v1x * v2y - v1y * v2x);
        // const t_ = (v3x_ * v1y - v3y_ * v1x) / (v2x * v1y - v2y * v1x);

        if( t>=0 && t<=1 && t_>=0 && t_<=1)
        {
            const ipx = a1x + v1x * t;
            const ipy = a1y + v1y * t;

            //  v - 2( v . n )n
            const l1 = (v1x !== 0 || v1y !== 0) ? 1 / Math.sqrt( v1x * v1x + v1y * v1y ) : 0;
            const l2 = (v2x !== 0 || v2y !== 0) ? 1 / Math.sqrt( v2x * v2x + v2y * v2y ) : 0;
            const vx = v1x * l1;
            const vy = v1y * l1;
            const lx = v2y * l2;
            const ly = -v2x * l2;

            const dot = ( vx * lx + vy * ly );
            const reflectX = vx - ( lx * dot * 2 );
            const reflectY = vy - ( ly * dot * 2 );

            return {
                x : ipx,
                y : ipy,
                t : t,
                rx : reflectX,
                ry : reflectY
            };
        }
        else {
            return null;
        }
    };

    Mathf.IntersectsBounds = function (minX1,minY1,maxX1,maxY1, minX2,minY2,maxX2,maxY2)
    {
        if (minX1 > maxX2
            || maxX1 < minX2
            || minY1 > maxY2
            || maxY1 < minY2)
        {
            return false;
        }
        return true;
    };

    Mathf.IntersectsBounds2 = function ( bounds1, bounds2 )
    {
        if (bounds1.minX > bounds2.maxX
            || bounds1.maxX < bounds2.minX
            || bounds1.minY > bounds2.maxY
            || bounds1.maxY < bounds2.minY)
        {
            return false;
        }
        return true;
    };

    Mathf.IntersectsBoundsToPoint = function (minX1,minY1,maxX1,maxY1, pointX, pointY)
    {
        if (minX1 > pointX
            || maxX1 < pointX
            || minY1 > pointY
            || maxY1 < pointY)
        {
            return false;
        }
        return true;
    };

    Mathf.IntersectsCircle = function ( aX, aY, aR, bX, bY, bR )
    {
        var sqrt = ((aX - bX) * (aX - bX)) + ((aY - bY) * (aY - bY ));
        return sqrt < (aR+bR)*(aR+bR);
    },

    Mathf.DEG_TO_RAD = Math.PI / 180;
    Mathf.RAD_TO_DEG  = 180 / Math.PI;

    Mathf.RotX2D = function( point, rad )
    {
        point.y = point.y * Math.cos(rad);
        return point;
    };

    Mathf.RotY2D = function(point, rad)
    {
        point.x = point.x * Math.cos(rad);
        return point;
    };

    Mathf.RotZ2D = function(point, rad)
    {
        var x = point.x * Math.cos( rad ) + point.y * Math.sin(rad);
        var y = point.x * -Math.sin(rad) + point.y * Math.cos(rad);
        point.x = x;
        point.y = y;
        return point;
    };

    Mathf.RotX3D = function( point, rad )
    {
        //  1   0   0
        //  0  cos -sin
        //  0  sin  cos

        var cos = Math.cos(rad);
        var sin = Math.sin(rad);

        var y = (point.y * cos) + (point.z * -sin);
        var z = (point.y * sin) + (point.z * cos);

        point.y = y;
        point.z = z;
        return point;
    };

    Mathf.RotY3D = function(point, rad)
    {
        // cos  0  sin
        //  0   1   0
        //-sin  0  cos

        var cos = Math.cos(rad);
        var sin = Math.sin(rad);

        var x =(point.x * cos) + (point.z * sin);
        var z = (point.x * -sin) + (point.z * cos);

        point.x = x;
        point.z = z;
        return point;
    };

    Mathf.RotZ3D = function(point, rad)
    {
        // cos -sin  0
        // sin  cos  0
        //  0    0   1

        var cos = Math.cos(rad);
        var sin = Math.sin(rad);

        var x = (point.x * cos) + (point.y * -sin);
        var y = (point.x * sin) + (point.y * cos);

        point.x = x;
        point.y = y;
        return point;
    };

    Mathf.Scale = function(point, s)
    {
        point.x *= s;
        point.y *= s;
        return point;
    };


    Mathf.ScaleX = function(point, s)
    {
        point.x *= s;
        return point;
    };

    Mathf.ScaleY = function(point, s)
    {
        point.y *= s;
        return point;
    };

    Mathf.SkewX = function( point, rad )
    {
        //1	tan(ay)
        //0	1
        var tan = Math.tan( rad );

        var x = point.x +  tan * point.y;

        point.x = x;
        return point;
    };

    Mathf.SkewY = function( point, rad )
    {
        //1	0
        //tan(ax)	1
        var tan = Math.tan( rad );

        var y = point.x * tan + point.y;
        point.y = y;
        return point;
    };

    Mathf.SafeDivision = function( a, b ) {
        return b === 0 ? 0 : a / b;
    };

    return Mathf;
})();
