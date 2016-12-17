(function(window){
  var defaultConsole = console.log;
  window.onerror = function (message, file, line, column) {
    window.parent.postMessage({
      type: 'error',
      errorMessage: message,
    }, location.origin);
  }
  window.console.log = function(message) {
    defaultConsole(message);
    window.parent.postMessage({
      type: 'log',
      message: JSON.stringify(message),
    }, location.origin);
  }
}(window));