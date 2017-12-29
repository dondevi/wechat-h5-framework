/**
 * @author dondevi
 * @create 2017-05-25
 */

// Polyfill fn.bind() for PhantomJS
/* eslint-disable no-extend-native */
Function.prototype.bind = require('function-bind');

// Use Chai should
chai.should();


import $ from "../src/modules/Core/core.js";

describe("Core", function () {
  it("Wapper Base", function () {
    $().should.eql([]);
    $(1).should.eql([1]);
    $(true).should.eql([true]);
    $([]).should.eql([]);
    $({}).should.eql([{}]);
  });
  it("Wapper DOM", function () {
    document.body.innerHTML = `<div id="div">div</div>`;
    var div = document.body.children[0];
    $("div").should.eql([div]);
    $("#div").should.eql([div]);
    $("no-exit-tag").should.eql([]);
  });
  it("Functions", function () {
    $.isArray([]).should.be.true;
    $.isArray(1).should.be.false;
    $.inArray(1, [0, 1]).should.be.true;
    $.inArray(2, [0, 1]).should.be.false;
    $.inArray("1", [0, 1]).should.be.false;
    $.each([0, 1, 2], function (index, item) {
      item.should.equal(index);
    });
  });
});



import "../src/modules/Date/date.js";

// 2017-05-25 12:30:00.000
// YYYY-MM-DD hh:mm:ss.ms
var date = new Date(1495686600000);

describe("Date format", function () {
  it("No format string", function () {
    date.format().should.equal("2017-05-25");
  });
  it("Char number of key", function () {
    date.format("Y").should.equal("2017");
    date.format("YY").should.equal("2017");
    date.format("YYYY").should.equal("2017");
    date.format("M").should.equal("5");
    date.format("MM").should.equal("05");
    date.format("MMM").should.equal("05");
  });
  it("Keys group", function () {
    date.format("Y-M-D h:m:s").should.equal("2017-5-25 12:30:0");
    date.format("YYYY-MM-DD hh:mm:ss").should.equal("2017-05-25 12:30:00");
  });
  it("Keys order", function () {
    date.format("M-D-Y h:m:s").should.equal("5-25-2017 12:30:0");
  });
  it("Spliter", function () {
    date.format("Y年M月D日").should.equal("2017年5月25日");
    date.format("Y:M:D h-m-s").should.equal("2017:5:25 12-30-0");
  });
});
