(function(window){
  window.onerror = function (message, file, line, column) {
    window.parent.postMessage({
      errorMessage: message,
    }, location.origin);
  }
}(window));