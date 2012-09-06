exports.getAsync = function(a, callback) {
  setTimeout(function() {
    callback(null, a);
  }, 10);
};

function _privateGet (a, callback) {
  setTimeout(function() {
    callback(null, a);
  }, 10);
};