var rewire = require('rewire');
var methods = rewire('./methods');
module.exports = [{
  requests: 10000,
  concurrent: 500,
  method: methods.getAsync,
  args: [123],
  result: 123,
  description: 'getAsync(123, cb)'  
}, {
  requests: 10000,
  concurrent: 500,
  method: methods.__get__('_privateGet'),
  args: [123],
  result: 123,
  description: '_privateGet(123, cb)'  
}];
