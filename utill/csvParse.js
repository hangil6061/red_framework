var Red = Red || {};

Red.CSVParser = (function ()
{
    function CSVParser()
    {
    }

    CSVParser.newParse = function (string)
    {
        var dataList = [];
        var headArr = [];
        var str = {};
        str.str = "";
        var firstLine = true;
        var headNum = 0;
        var data = {};

        for( var i = 0; i < string.length; i++ )
        {
            switch ( string[i] )
            {
                case "\r":
                    break;
                case "\n" :
                    if( firstLine )
                    {
                        headArr.push(  str.str );
                        firstLine = false;
                    }
                    else
                    {
                        data[ headArr[headNum] ] = str.str;
                        dataList.push(data);
                    }


                    str.str = "";
                    headNum = 0;
                    data = {};
                    break;
                case undefined:
                    if( firstLine )
                    {
                        headArr.push(  str.str );
                        firstLine = false;
                    }
                    else
                    {
                        data[ headArr[headNum] ] = str.str;
                        dataList.push(data);
                    }


                    str.str = "";
                    headNum = 0;
                    data = {};
                    break;
                case "\"" :
                    i++;
                    while ( true )
                    {
                        if( string[i] === "\"" && string[i+1] === "\"")
                        {
                            str.str += string[i];
                            i++;
                            i++;
                        }
                        else if( string[i] === "\"" && ( ! string[i+1] || string[i+1] !== "\""))
                        {
                            break;
                        }
                        else
                        {
                            str.str += string[i];
                            i++;
                        }
                    }

                    //console.log( str.str );
                    //i = checkQuotation( string, i , str);
                    break;
                case "," :


                    if( firstLine )
                    {
                        headArr.push(  str.str );
                        //dic[ str.str ] = [];
                    }
                    else
                    {
                        data[ headArr[headNum] ] = str.str;
                        //dic[ headArr[headNum] ].push( str.str );
                    }

                    headNum++;
                    str.str = "";
                    break;
                default:
                    str.str += string[i];
                    break;
            }
        }

        if( headNum !== 0 )
        {
            data[ headArr[headNum] ] = str.str;
            dataList.push(data);
        }

        return dataList;
    };

    CSVParser.parse = function(string)
    {
        var dataList = [];
        var headArr = [];
        var str = {};
        str.str = "";
        var firstLine = true;
        var headNum = 0;
        var data = {};

        for( var i = 0; i < string.length; i++ )
        {
            switch ( string[i] )
            {
                case "\r":
                    break;
                case "\n" :
                    if( firstLine )
                    {
                        headArr.push(  str.str );
                        firstLine = false;
                    }
                    else
                    {
                        data[ headArr[headNum] ] = str.str;
                        dataList.push(data);
                    }

                    str.str = "";
                    headNum = 0;
                    data = {};
                    break;
                case "\"" :
                    i = checkQuotation( string, i , str);
                    break;
                case "," :

                    if( firstLine )
                    {
                        headArr.push(  str.str );
                        //dic[ str.str ] = [];
                    }
                    else
                    {
                        data[ headArr[headNum] ] = str.str;
                        //dic[ headArr[headNum] ].push( str.str );
                    }

                    headNum++;
                    str.str = "";
                    break;
                default:
                    str.str += string[i];
                    break;
            }
        }

        if( headNum !== 0 )
        {
            data[ headArr[headNum] ] = str.str;
            dataList.push(data);
        }

        return dataList;
    };

    function checkQuotation( string, startIdx, str  )
    {
        var idx = startIdx + 1;

        var count = 0;
        while ( true )
        {
            if( string[idx] === "\"" || string[idx] === " ")
            {
                idx++;
            }
            else
            {
                break;
            }

            count++;
            if( count > 1000 )
            {
                console.log( 11 );
            }
        }

        while (true)
        {
            if( string[idx] !== "\"")
            {
                str.str += string[idx];
                idx++;
            }
            else
            {
                break;
            }

            count++;
            if( count > 10000 )
            {
                console.log( 11 );
            }
        }

        while ( true )
        {
            if( string[idx] === "\"" || string[idx] === " ")
            {
                idx++;
            }
            else
            {
                break;
            }
            count++;
            if( count > 10000 )
            {
                console.log( 11 );
            }
        }

        return idx - 1;
    }


    return CSVParser;
})();