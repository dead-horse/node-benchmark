node-benchmark
==============

a benchmark util for Node.js.   
You can use it test every function, get a report like this:   

```
Benchmark test at Fri Sep 07 2012 01:53:53 GMT+0800 (CST):
getAsync(123, cb)
Number of totaol request: 1000, CONCURRENT users: 10
Time taken for tests: 0.398   seconds
Complete requests:    1000   
Failed requests:      0      
Requests per second:  2512.56 [#/sec]
Time per request:     2.81    [ms]   
Max response time:    87[ms] Response time distribute:
Response time | Num | Proportion
0 ~ 5         | 940 | 94.00%    
5 ~ 10        | 40  | 4.00%     
10 ~ 20       | 10  | 1.00%     
20 ~ 30       | 0   | 0.00%     
30 ~ 40       | 0   | 0.00%     
40 ~ 50       | 4   | 0.40%     
50 ~ 80       | 4   | 0.40%     
80 ~ 100      | 2   | 0.20%     
100 ~ 200     | 0   | 0.00%     
200 ~ 300     | 0   | 0.00%     
300 ~ 500     | 0   | 0.00%     
500 ~ 1000    | 0   | 0.00%     
1000 ~ 2000   | 0   | 0.00%     
2000 ~ 3000   | 0   | 0.00%     
 > 3000       | 0   | 0.00%  
```

## Usage:  
 * Use nbm:   

```
 nbm [options]
example:./benchmark -c conf.js -l out.log -t md

Options:
  -c, --config   input config file path, array of inputs       [required]
  -l, --log      -l FILE, LOG to FILE.                       
  -t, --logType  log type, could be markdown/md, default text
```
* In conf.js, must exports a array of `options`. These `options` are for `lib/benchmark`:   

```js
var rewire = require('rewire');
var methods = rewire('./example/methods');
/**
 * {Number}   requests      total requests number
 * {Number}   concurrent    concurrent user number
 * {String}   type          which type of method, `sync`, `async`, `http`, `hsf`
 * {Function} method        which method want to be test
 * {Array}    args          invoke arguments
 * {All}      result        expect invoke result
 * {String}   description   describe this method, just for dispaly and record to the log file
 * @type {Array}
 */
module.exports = [{
  requests: 10000,
  concurrent: 500,
  type: 'async',
  method: methods.getAsync,
  args: [123],
  result: 123,
  description: 'getAsync(123, cb)'  
}, {
  requests: 10000,
  concurrent: 500,
  type: 'async',
  method: methods.__get__('_privateGet'),
  args: [123],
  result: 123,
  description: '_privateGet(123, cb)'  
}];
```
Just like upside, use [rewire](https://github.com/jhnns/rewire) can get the private method to be tested.   

## Install   

```
npm install -g node-benchmark
```  

## Todo   
 * more test   
 * `sync`, `http`, `hsf` method support    
 * api

## License  
MIT 