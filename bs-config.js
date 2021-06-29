var path = require("path");
var webpack = require("webpack");

module.exports = function(bs){
  return {
    port: 7080,
    open: false,
    server: {
      middleware: {
        1: require("connect-history-api-fallback")({
          index: "/index.html",
          verbose: true
        })
      }
    }
  };
};
