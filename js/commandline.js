/**
 * A small command line editor to demonstrate the math.js parser.
 * @param {Object} params    Configuration parameter. Available:
 *                           {HTMLElement} container DOM Element to contain
 *                                                   the editor
 *                           {String} [id]           Optional id for the editor,
 *                                                   used to persist data.
 *                                                   "default" by default.
 */
function CommandLineEditor (params) {
    // object with utility methods
    var util = {};

    /**
     * Returns the version of Internet Explorer or a -1
     * (indicating the use of another browser).
     * Source: http://msdn.microsoft.com/en-us/library/ms537509(v=vs.85).aspx
     * @return {Number} Internet Explorer version, or -1 in case of an other browser
     */
    util.getInternetExplorerVersion = function getInternetExplorerVersion () {
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
    };

    /**
     * Add and event listener
     * @param {Element}  element       An html element
     * @param {string}   action        The action, for example "click",
     *                                 without the prefix "on"
     * @param {function}    listener   The callback function to be executed
     */
    util.addEventListener = function addEventListener(element, action, listener) {
        if (element.addEventListener) {
            element.addEventListener(action, listener, false);
        } else {
            element.attachEvent('on' + action, listener);  // IE browsers
        }
    };

    /**
     * Remove an event listener from an element
     * @param {Element}  element   An html dom element
     * @param {string}   action    The name of the event, for example "mousedown"
     * @param {function} listener  The listener function
     */
    util.removeEventListener = function removeEventListener (element, action, listener) {
        if (element.removeEventListener) {
            element.removeEventListener(action, listener, false);
        } else {
            element.detachEvent('on' + action, listener);  // IE browsers
        }
    };

    /**
     * Clear all DOM childs from an element
     * @param {HTMLElement} element
     */
    util.clearDOM = function clearDOM (element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };

    // read the parameters
    var container = (params && params.container) ? params.container : undefined;
    if (!container) {
        throw new Error('Required parameter "container" missing in configuration parameters');
    }
    var id = (params && params.id) ? String(params.id) : 'default';

    // clear the container
    util.clearDOM(container);

    // validate if math.js is loaded.
    var error;
    if (typeof math === 'undefined' || !math.parser || !math.parser.Parser) {
        error = document.createElement('div');
        error.appendChild(document.createTextNode(
            'Cannot create parser, math.js not loaded.'));
        error.style.color = 'red';
        container.appendChild(error);
        return;
    }

    // validate browser
    // the editor does not work well on IE7
    // TODO: make the demo working on IE7
    var ieVersion = util.getInternetExplorerVersion();
    if (ieVersion == 6 || ieVersion == 7) {
        error = document.createElement('div');
        error.appendChild(document.createTextNode(
            'Sorry, this demo is not available on IE7 and older. The math.js ' +
                'library itself works fine on every version of IE though.'));
        error.style.color = 'red';
        container.appendChild(error);
        return;
    }

    // define parameters
    var dom = {},
        fullscreen = false,
        history = [],
        historyIndex = -1,
        parser = new math.parser.Parser();

    function resize() {
        // position the full screen button in the top right
        var top = 8;
        var right = (dom.topPanel.clientWidth - dom.results.clientWidth) + 6;
        dom.fullscreen.style.top = top + 'px';
        dom.fullscreen.style.right = right + 'px';
    }

    function toggleFullscreen() {
        if (fullscreen) {
            exitFullscreen();
        }
        else {
            showFullscreen()
        }
    }

    function showFullscreen() {
        dom.frame.className = 'cle fullscreen';
        document.body.style.overflow = 'hidden'; // (works only if body.style.height is defined)
        fullscreen = true;
        resize();
    }

    function exitFullscreen() {
        dom.frame.className = 'cle';
        document.body.style.overflow = '';
        fullscreen = false;
        resize();
    }

    /**
     * KeyDown event handler to catch ESC key in the window
     * @param {Event} event
     */
    function onESC (event) {
        if (dom.frame.parentNode != container) {
            destroy();
        }

        event = event || window.event;
        var keynum = event.which || event.keyCode;
        if (keynum == 27) {
            exitFullscreen();
        }
    }

    /**
     * Resize event handler
     */
    function onResize () {
        if (dom.frame.parentNode != container) {
            destroy();
        }

        resize();
    }

    /**
     * KeyDown handler for the input field
     * @param event
     * @returns {boolean}
     */
    function onKeyDown (event) {
        event = event || window.event;

        var keynum = event.which || event.keyCode;
        switch (keynum) {
            // TODO: implement auto completion on Tab key

            case 13: // Enter
                evalInput();
                return false;
                break;

            case 38: // Arrow up
                if (historyIndex > 0) {
                    historyIndex--;
                    dom.input.value = history[historyIndex] || '';
                }
                return false;
                break;

            case 40: // Arrow down
                if (historyIndex < history.length) {
                    historyIndex++;
                    dom.input.value = history[historyIndex] || '';
                }
                return false;
                break;

            default:
                historyIndex = history.length;
                break;
        }

        return true;
    }

    /**
     * Destroy the editor: cleanup HTML DOM and global event listeners
     */
    function create() {
        // create main frame for the editor
        dom.frame = document.createElement('div');
        dom.frame.className = 'cle';
        container.appendChild(dom.frame);

        // create two panels for the layout
        dom.topPanel = document.createElement('div');
        dom.topPanel.className = 'top-panel';
        dom.frame.appendChild(dom.topPanel);
        dom.bottomPanel = document.createElement('div');
        dom.bottomPanel.className = 'bottom-panel';
        dom.frame.appendChild(dom.bottomPanel);

        // create div to hold the results
        dom.results = document.createElement('div');
        dom.results.className = 'results';
        dom.topPanel.appendChild(dom.results);

        // create fullscreen button
        dom.fullscreen = document.createElement('button');
        dom.fullscreen.className = 'fullscreen';
        dom.fullscreen.title = 'Toggle full screen display';
        dom.fullscreen.onclick = toggleFullscreen;
        dom.topPanel.appendChild(dom.fullscreen);

        // panels for the input field and button
        dom.inputLeft = document.createElement('div');
        dom.inputLeft.className = 'input-left';
        dom.bottomPanel.appendChild(dom.inputLeft);
        dom.inputRight = document.createElement('div');
        dom.inputRight.className = 'input-right';
        dom.bottomPanel.appendChild(dom.inputRight);

        dom.input = document.createElement('input');
        dom.input.className = 'input';
        dom.input.onkeydown = onKeyDown;
        dom.inputLeft.appendChild(dom.input);

        // create an eval button
        dom.btnEval = document.createElement('button');
        dom.btnEval.appendChild(document.createTextNode('Evaluate'));
        dom.btnEval.className = 'eval';
        dom.btnEval.title = 'Evaluate the entered expression';
        dom.btnEval.onclick = evalInput;
        dom.inputRight.appendChild(dom.btnEval);

        // create global event listeners
        util.addEventListener(window, 'keydown', onESC);
        util.addEventListener(window, 'resize', onResize);
    }

    /**
     * Destroy the editor: cleanup HTML DOM and global event listeners
     */
    function destroy() {
        // destroy DOM
        if (dom.frame.parentNode) {
            dom.frame.parentNode.removeChild(dom.frame);
        }

        // destroy event listeners
        util.removeEventListener(window, 'keydown', onESC);
        util.removeEventListener(window, 'resize', onResize);
    }

    /**
     * Trim a string
     * http://stackoverflow.com/a/498995/1262753
     * @param str
     * @return {*|void}
     */
    function trim(str) {
        return str.replace(/^\s+|\s+$/g, '');
    }

    /**
     * Load saved expressions or example expressions
     */
    function load() {
        var expressions;
        if (localStorage) {
            // load expressions from local storage
            var data = localStorage[id];
            if (data) {
                expressions = JSON.parse(data);
            }
        }
        if (!expressions || !(expressions instanceof Array)) {
            // load some example expressions
            expressions = [
                '1.2 / (2.3 + 0.7)',
                'a = 5.08 cm + 1 inch',
                'a in inch',
                'sin(45 deg) ^ 2',
                'function f(x, y) = x ^ y',
                'f(2, 3)'
            ];
        }

        // evaluate all expressions
        expressions.forEach(function (expr) {
            eval(expr);
        });
    }

    /**
     * Save executed expressions
     */
    function save() {
        if (localStorage) {
            localStorage[id] = JSON.stringify(history);
        }
    }

    function clear() {
        history = [];
        historyIndex = -1;
        parser.clear();

        util.clearDOM(dom.results);
        dom.input.value = '';
        resize();
        // save(); // TODO: save expressions (first we need a method to restore the examples)
    }

    function eval (expr) {
        expr = trim(expr);

        if (expr == 'clear') {
            clear();
            return;
        }

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
            dom.results.appendChild(preExpr);

            var preRes = document.createElement('pre');
            preRes.className = 'res';
            preRes.appendChild(document.createTextNode(res));
            dom.results.appendChild(preRes);

            dom.results.scrollTop = dom.results.scrollHeight; // scroll down
            dom.input.value = '';

            resize();
            // save();  // TODO: save expressions (first we need a method to restore the examples)
        }
    }

    function evalInput() {
        eval(dom.input.value);
    }

    create();
    load();
}
