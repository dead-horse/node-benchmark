module.exports = process.env.HSF_COV ? require('./lib-cov/benchmark') : require('./lib/benchmark');
