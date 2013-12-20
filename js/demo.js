// create an instance of math.js
var math = mathjs();
var editor;

document.onload = function () {
  var container = document.getElementById('commandline');
  if (container) {
    editor = new CommandLineEditor({
      container: container,
      math: math
    });
  }
};
