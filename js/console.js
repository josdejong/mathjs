/**
 * A small console editor to demonstrate the math.js parser.
 */
(function (container) {
    // TODO: turn the console in a standalone utility

    var page = document.getElementById('page');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }

    /**
     * Returns the version of Internet Explorer or a -1
     * (indicating the use of another browser).
     * Source: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx
     * @return {Number} Internet Explorer version, or -1 in case of an other browser
     */
    function getInternetExplorerVersion () {
        var rv = -1; // Return value assumes failure.
        if (navigator.appName == 'Microsoft Internet Explorer')
        {
            var ua = navigator.userAgent;
            var re  = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
            if (re.exec(ua) != null) {
                rv = parseFloat( RegExp.$1 );
            }
        }
        return rv;
    }

    // the console does not work well on IE7
    // TODO: make the demo working on IE7
    var ieVersion = getInternetExplorerVersion();
    if (ieVersion == 6 || ieVersion == 7) {
        container.appendChild(document.createTextNode(
            'Sorry, this demo is not available on IE7 and older. The math.js ' +
                'library itself works fine on every version of IE though.'));
        container.style.color = 'red';
        return;
    }

    // create main frame for the console
    var frame = document.createElement('div');
    frame.className = 'console';
    container.appendChild(frame);

    // create two panels for the layout
    var topPanel = document.createElement('div');
    topPanel.className = 'top-panel';
    frame.appendChild(topPanel);
    var bottomPanel = document.createElement('div');
    bottomPanel.className = 'bottom-panel';
    frame.appendChild(bottomPanel);

    // create div to hold the results
    var results = document.createElement('div');
    results.className = 'results';
    topPanel.appendChild(results);

    var isFullscreen = false;
    var fullscreen = document.createElement('button');
    fullscreen.className = 'fullscreen';
    fullscreen.title = 'Toggle full screen display';
    fullscreen.onclick = toggleFullscreen;
    topPanel.appendChild(fullscreen);

    function resize() {
        // position the full screen button in the top right
        var top = 8;
        var right = (topPanel.clientWidth - results.clientWidth) + 6;
        fullscreen.style.top = top + 'px';
        fullscreen.style.right = right + 'px';
    }

    function toggleFullscreen() {
        if (isFullscreen) {
            exitFullscreen();
        }
        else {
            showFullscreen()
        }
    }

    function showFullscreen() {
        frame.className = 'console fullscreen';
        document.body.style.overflow = 'hidden'; // (works only if body.style.height is defined)
        isFullscreen = true;
        resize();
    }

    function exitFullscreen() {
        frame.className = 'console';
        document.body.style.overflow = '';
        isFullscreen = false;
        resize();
    }

    // TODO: not so neat, overwriting the window onkeydown here
    window.onkeydown = function (event) {
        event = event || window.event;
        var keynum = event.which || event.keyCode;
        if (keynum == 27) {
            exitFullscreen();
        }
    };
    window.onresize = resize;

    /**
     * Trim a string
     * http://stackoverflow.com/a/498995/1262753
     * @param str
     * @return {*|void}
     */
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    var history = [];
    var historyIndex = -1;
    var parser = new math.parser.Parser();
    function eval (expr) {
        expr = trim(expr);
        if (expr) {
            history.push(expr);
            historyIndex = history.length;

            var res;
            try {
                res = parser.eval(expr);
                if ((res instanceof Number) || (typeof res == 'number')) {
                    res = math.round(res, 9);
                }
            }
            catch (err) {
                res = err.toString();
            }

            var preExpr = document.createElement('pre');
            preExpr.className = 'expr';
            preExpr.appendChild(document.createTextNode(expr));
            results.appendChild(preExpr);

            var preRes = document.createElement('pre');
            preRes.className = 'res';
            preRes.appendChild(document.createTextNode(res));
            results.appendChild(preRes);

            results.scrollTop = results.scrollHeight; // scroll down
            input.value = '';

            resize();
        }
    }

    function evalInput() {
        eval(input.value);
    }

    // panels for the input field and button
    var inputLeft = document.createElement('div');
    inputLeft.className = 'input-left';
    bottomPanel.appendChild(inputLeft);
    var inputRight = document.createElement('div');
    inputRight.className = 'input-right';
    bottomPanel.appendChild(inputRight);

    var input = document.createElement('input');
    input.className = 'input';
    input.onkeydown = function (event) {
        event = event || window.event;
        var expr;
        var keynum = event.which || event.keyCode;
        switch (keynum) {
            case 13: // Enter
                evalInput();
                return false;
                break;
            case 38: // Arrow up
                if (historyIndex > 0) {
                    historyIndex--;
                    expr = history[historyIndex];
                    if (expr) {
                        input.value = expr;
                    }
                }
                return false;
                break;

            case 40: // Arrow down
                if (historyIndex < history.length - 1) {
                    historyIndex++;
                    expr = history[historyIndex];
                    if (expr) {
                        input.value = expr;
                    }
                }
                return false;
                break;

            default:
                historyIndex = history.length;
                break;
        }
    };
    inputLeft.appendChild(input);

    // create an eval button
    var btnEval = document.createElement('button');
    btnEval.appendChild(document.createTextNode('Evaluate'));
    btnEval.className = 'eval';
    btnEval.title = 'Evaluate the entered expression';
    btnEval.onclick = evalInput;
    inputRight.appendChild(btnEval);

    // evaluate some example expressions
    eval('1.2 / (2.3 + 0.7)');
    eval('a = 5.08 cm + 1 inch');
    eval('a in inch');
    eval('sin(45 deg) ^ 2');
    eval('function f(x, y) = x ^ y');
    eval('f(2, 3)');

})(document.getElementById('console'));
