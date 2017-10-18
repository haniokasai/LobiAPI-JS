//https://stackoverflow.com/questions/25515936/perform-curl-request-in-javascript

csrf_token = '<input type="hidden" name="csrf_token" value="';
authenticity_token = '<input name="authenticity_token" type="hidden" value="';
redirect_after_login = '<input name="redirect_after_login" type="hidden" value="';
oauth_token = '<input id="oauth_token" name="oauth_token" type="hidden" value="';
twitter_redirect_to_lobi = '<a class="maintain-context" href="';

function strpos (haystack, needle, offset) {
    //  discuss at: http://locutus.io/php/strpos/
    // original by: Kevin van Zonneveld (http://kvz.io)
    // improved by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (http://brett-zamir.me)
    // bugfixed by: Daniel Esteban
    //   example 1: strpos('Kevin van Zonneveld', 'e', 5)
    //   returns 1: 14
    var i = (haystack + '')
        .indexOf(needle, (offset || 0))
    return i === -1 ? false : i
}

function substr (str, start, len) {
    //  discuss at: http://locutus.io/php/substr/
    // original by: Martijn Wieringa
    // bugfixed by: T.Wild
    // improved by: Onno Marsman (https://twitter.com/onnomarsman)
    // improved by: Brett Zamir (http://brett-zamir.me)
    //  revised by: Theriault (https://github.com/Theriault)
    //      note 1: Handles rare Unicode characters if 'unicode.semantics' ini (PHP6) is set to 'on'
    //   example 1: substr('abcdef', 0, -1)
    //   returns 1: 'abcde'
    //   example 2: substr(2, 0, -6)
    //   returns 2: false

    str += ''
    var end = str.length

    var iniVal = (typeof require !== 'undefined' ? require('../info/ini_get')('unicode.emantics') : undefined) || 'off'

    if (iniVal === 'off') {
        // assumes there are no non-BMP characters;
        // if there may be such characters, then it is best to turn it on (critical in true XHTML/XML)
        if (start < 0) {
            start += end
        }
        if (typeof len !== 'undefined') {
            if (len < 0) {
                end = len + end
            } else {
                end = len + start
            }
        }

        // PHP returns false if start does not fall within the string.
        // PHP returns false if the calculated end comes before the calculated start.
        // PHP returns an empty string if start and end are the same.
        // Otherwise, PHP returns the portion of the string from start to end.
        if (start >= str.length || start < 0 || start > end) {
            return false
        }

        return str.slice(start, end)
    }

    // Full-blown Unicode including non-Basic-Multilingual-Plane characters
    var i = 0
    var allBMP = true
    var es = 0
    var el = 0
    var se = 0
    var ret = ''

    for (i = 0; i < str.length; i++) {
        if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
            allBMP = false
            break
        }
    }

    if (!allBMP) {
        if (start < 0) {
            for (i = end - 1, es = (start += end); i >= es; i--) {
                if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
                    start--
                    es--
                }
            }
        } else {
            var surrogatePairs = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
            while ((surrogatePairs.exec(str)) !== null) {
                var li = surrogatePairs.lastIndex
                if (li - 2 < start) {
                    start++
                } else {
                    break
                }
            }
        }

        if (start >= end || start < 0) {
            return false
        }
        if (len < 0) {
            for (i = end - 1, el = (end += len); i >= el; i--) {
                if (/[\uDC00-\uDFFF]/.test(str.charAt(i)) && /[\uD800-\uDBFF]/.test(str.charAt(i - 1))) {
                    end--
                    el--
                }
            }
            if (start > end) {
                return false
            }
            return str.slice(start, end)
        } else {
            se = start + len
            for (i = start; i < se; i++) {
                ret += str.charAt(i)
                if (/[\uD800-\uDBFF]/.test(str.charAt(i)) && /[\uDC00-\uDFFF]/.test(str.charAt(i + 1))) {
                    // Go one further, since one of the "characters" is part of a surrogate pair
                    se++
                }
            }
            return ret
        }
    }
}


function get_string(source, pattern, end_pattern) {
    start = strpos(source, pattern) + pattern.length;
    end = strpos(source, end_pattern, start + 1);
    return substr(source, start, end - start);
}

email="foo";
password="bar";

$.ajax({
    url: 'https://lobi.co/signin',
    beforeSend: function(xhr) {
    }, success: function(data){
        csrf_token =　get_string(data,csrf_token, '"');
        post_data = 'csrf_token='+csrf_token+'&email='+mail+'&password='+password;
        posted =http_post('https://lobi.co/signin', post_data);
        if(posted.indexOf('ログインに失敗しました')== -1){
            return true;
        }else{
            return false;
        }
    }
})