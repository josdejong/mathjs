// create an instance of math.js
var math = mathjs();
var editor;

if (window.addEventListener) {
  window.addEventListener('load', function () {
    var container = document.getElementById('commandline');
    if (container) {
      editor = new CommandLineEditor({
        container: container,
        math: math
      });
    }
  });
}
