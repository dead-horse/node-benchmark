/*!
 * hsf - benchmark.js 
 * Copyright(c) 2012 Taobao.com
 */

/**
 * Module dependencies.
 */
var EventEmitter = require('events').EventEmitter;
var util = require('util');

var Benchmark = function(options) {
  EventEmitter.call(this);
  this.requests = options.requests || 100;
  this.concurrent = options.concurrent || 1;
  this.method = options.method;
  this.owner = options.owner;
  this.result = options.result || null;
  this.description = options.description || '';
  try {
    this.args = JSON.parse(options.args || '[]');
  } catch(err) {
    this.args = options.args;
  }
  !Array.isArray(this.args) ? this.args = [this.args] : null;
  this.timeout = parseInt(options.timeout || 3000);
  this.err = 0;                  //总计错误数
  this.times = 0;                //总计调用数
  this.sends = 0;                //已经发送的请求数
  this.startTime;                //开始时间
  this.totalUse = 0;             //总用时
  this.max = 0;                  //最长响应时间
  this.distribute = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  this.distributeValue = [5, 10, 20, 30, 40, 50, 80, 100, 200, 300, 500, 1000, 2000, 3000];
};

util.inherits(Benchmark, EventEmitter);

Benchmark.prototype.callback = function(sendTime, err, data) {
  var use = new Date().getTime() - sendTime;
  this.max = use > this.max ? use : this.max;
  var distVal = this.distributeValue;
  var geted = false;
  for (var i = 0, l = distVal.length; i < l; i++) {
    if (use < distVal[i]) {
      this.distribute[i]++;
      geted = true;
      break;
    }
  }
  if (!geted) {
    this.distribute[l]++;
  }
  this.totalUse += use;
  this.times++;
  if (err) {
    this.err++;
  } else if (this.result && data !== this.result) {
    this.err++;
  }
  if (this.times % this.concurrent === 0 && this.times < this.requests) {
    this.start();
  }
  if (this.times % (this.requests / 10) === 0 && this.times < this.requests) {
    this.emit('piece', {
      times: this.times,
      err: this.err
    });
  }
  if (this.times === this.requests) { 
    var use = new Date().getTime() - this.startTime;
    if (err) {
      this.emit('err', err);
    }
    this.emit('end', {
      requests: this.requests,
      concurrent: this.concurrent,
      description: this.description,
      use: use,
      totalUse: this.totalUse,
      times: this.times,
      err: this.err,
      max: this.max,
      distribute: this.distribute,
      distributeValue: this.distributeValue
    });
  }
}

Benchmark.prototype.start = function() {
  var concurrent = this.concurrent;
  var sendTime = new Date().getTime();
  if (!this.startTime) {
    this.startTime = sendTime;
  }
  var cb = function(err, data) {
    this.callback(sendTime, err, data);
  }.bind(this);

  for (var i = concurrent; i--; ) {
    this.method.apply(this.owner, this.args.concat(cb));
  }
}

exports.create = function (options) {
  return new Benchmark(options);
};
