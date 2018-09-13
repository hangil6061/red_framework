var Red = Red || {};

Number.isInteger = Number.isInteger || function(value) {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
};

if (!(function f() {}).name) {
    Object.defineProperty(Function.prototype, 'name', {
        get: function() {
            var name = (this.toString().match(/^function\s*([^\s(]+)/) || [])[1];
            // For better performance only parse once, and then cache the
            // result through a new accessor for repeated access.
            Object.defineProperty(this, 'name', { value: name });
            return name;
        }
    });
}

Red.Utill = (function ()
{
    function Utill()
    {
    }


    Utill.stringFormat = function (string)
    {
        var args = arguments;
        return string.replace(/{(\d+)}/g, function (match, number)
        {
            return args[ parseInt(number)+1];
        });;
    };

    Utill.getUrl_googleSpreadsheetToCSV = function (key, sheetID)
    {
        sheetID = sheetID || 0;
        return Utill.stringFormat("https://docs.google.com/spreadsheets/d/{0}/export?gid={1}&format=csv",key,sheetID);
    };

    Utill.deepCopy = function(obj)
    {
        let ret;
        if( obj instanceof Array)
        {
            ret = []
        }
        else if( obj instanceof Object)
        {
            ret = {};
        }
        else
        {
            return obj;
        }


        for (let i in obj)
        {
            if (obj.hasOwnProperty(i))
            {
                ret[i] = Utill.deepCopy(obj[i]);
            }
        }
        return ret;
    };

    /**
    *
    * 존재하면 덮어쓰기
    * @param key
    * @param str
    */
    Utill.localSave = function (key, str)
    {
        localStorage.setItem(key, str);
    };

    /**
     * 값 찾지 못하면 null 리턴
     * @param key
     */
    Utill.localLoad = function (key)
    {
        return localStorage.getItem(key)
    };

    /**
     *
     * @param n 숫자
     * @param digits 0채울 자릿수
     * @returns {string}
     */
    Utill.leadingZeros = function(n, digits) {
        var zero = '';
        n = n.toString();

        if (n.length < digits) {
            for (var i = 0; i < digits - n.length; i++)
                zero += '0';
        }
        return zero + n;
    };

    /**
     *
     * @param f 실수
     * @param cipher  반올림할 소숫점 자릿수
     * @returns {number} 반환실수
     */
    Utill.floatRound = function (f, cipher)
    {
        return Math.round( f * cipher ) / cipher;
    };

    /**
     * 숫자 입력받아 3자리수마다 ,찍어서 반환함
     * @param num 정수
     * @returns {string}
     */
    Utill.addComma = function(num)
    {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };


    /**
     * 입력받은 파라미터를 이름으로 검색해서 반환해줌.
     * @param name
     * @returns {string}
     */
    Utill.getParameterByName = function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
            results = regex.exec(location.search);
        return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    };

    Utill.clearParameter = function () {
        history.replaceState({}, null, location.pathname);
    };

    return Utill;
})();
