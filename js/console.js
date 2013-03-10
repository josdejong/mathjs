// TODO: turn the console in a standalone utility

(function () {
    var page = document.getElementById('page');
    var container = document.getElementById('console');
    container.innerHTML = '';

    var isFullscreen = false;
    var fullscreen = document.createElement('button');
    fullscreen.className = 'fullscreen';
    fullscreen.title = 'Toggle full screen display';
    fullscreen.onclick = toggleFullscreen;
    container.appendChild(fullscreen);

    function toggleFullscreen() {
        if (isFullscreen) {
            exitFullscreen();
        }
        else {
            showFullscreen()
        }
    }

    function showFullscreen() {
        container.className = 'fullscreen';
        document.body.style.overflow = 'hidden'; // (works only if body.style.height is defined)
        isFullscreen = true;
    }

    function exitFullscreen() {
        container.className = '';
        document.body.style.overflow = '';
        isFullscreen = false;
    }

    // TODO: not so neat, overwriting the window onkeydown here
    window.onkeydown = function (event) {
        event = event || window.event;
        var keynum = event.which || event.keyCode;
        if (keynum == 27) {
            exitFullscreen();
        }
    };

    var results = document.createElement('div');
    results.className = 'results';
    container.appendChild(results);

    /**
     * Trim a string
     * http://stackoverflow.com/a/498995/1262753
     * @param str
     * @return {*|void}
     */
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    var parser = new math.parser.Parser();
    function eval (expr) {
        if (expr) {
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

            var preExpr = document.createElement('div');
            preExpr.className = 'expr';
            preExpr.appendChild(document.createTextNode(expr));
            results.appendChild(preExpr);

            var preRes = document.createElement('div');
            preRes.className = 'res';
            preRes.appendChild(document.createTextNode(res));
            results.appendChild(preRes);

            container.scrollTop = container.scrollHeight; // scroll down
            input.value = '';
        }
    }

    function evalInput() {
        var expr = trim(input.value);
        if (expr) {
            eval(input.value);
        }
    }

    // TODO: position the input at the bottom of the editor, with a button "Evaluate" right
    var input = document.createElement('input');
    input.className = 'input';
    input.onkeydown = function (event) {
        event = event || window.event;
        var keynum = event.which || event.keyCode;
        if (keynum == 13) {
            evalInput();
        }
        if (keynum == 27) {
            exitFullscreen();
        }
    };
    container.appendChild(input);

    // evaluate some example expressions
    eval('1.2 / (2.3 + 0.7)');
    eval('a = 5.08 cm');
    eval('a in inch');
    eval('sin(45 deg) ^ 2');
    eval('function f(x, y) = x ^ y');
    eval('f(2, 3)');

})();