// create an instance of math.js
var math = mathjs();
var editor;

if (document.body.addEventListener) {
  document.body.addEventListener('load', function () {
    var container = document.getElementById('commandline');
    if (container) {
      editor = new CommandLineEditor({
        container: container,
        math: math
      });
    }
  });
}
