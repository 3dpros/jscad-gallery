require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"gear":[function(require,module,exports){
//this file is a template for converting jscad to a Node module
const scadApi = require('@jscad/scad-api')
const { difference, intersection, union } = scadApi.booleanOps;
const { CAG, CSG } = scadApi.csg;
const { echo } = scadApi.debug;
const { linear_extrude, rectangular_extrude, rotate_extrude } = scadApi.extrusions;
const { abs, acos, asin, atan, atan2, ceil, cos, floor, log, lookup, max, min, pow, rands, round, sign, sin, sqrt, tan } = scadApi.maths;
const { OpenJsCad } = scadApi.OpenJsCad;
const { circle, polygon, square, triangle } = scadApi.primitives2d;
const { cube, cylinder, geodesicSphere, polyhedron, sphere, torus } = scadApi.primitives3d;
const { center, chain_hull, contract, expand, hull, minkowski, mirror, multmatrix } = scadApi.transformations;
const { vector_char, vector_text } = scadApi.text;


///////////////

// title      : Name Plate
// author     : Rene K. Mueller
// license    : MIT License
// description: create your own name plate
// date       : 2013/04/24
// file       : name_plate.jscad

function getParameterDefinitions () {
  return [
    {name: 'name', initial: 'Joe Example', type: 'text', caption: 'Your name', size: 30},
    {name: 'title', initial: '3D Printer Developer', type: 'text', caption: 'Your title', size: 30},
    {name: 'thickness', initial: 3, type: 'float', caption: 'Thickness'}
  ];
}

function main (param) {
  var o = []; // our stack of objects
  var l = []; // our stack of line segments (when rendering vector text)
  var p = []; // our stack of extruded line segments

  // -- render name & extrude
  l = vector_text(0, 0, param.name);
  l.forEach(function (s) {
    p.push(rectangular_extrude(s, {w: param.thickness, h: param.thickness}));
  });
  o.push(union(p).setColor([1, 1, 0]).scale([1 / 3, 1 / 3, 1 / 3]).center([true, true, false]).translate([0, 0, param.thickness]));

  if (param.title.length) {
    // -- render title & extrude
    l = vector_text(0, 0, param.title);
    p = [];
    l.forEach(function (s) {
      p.push(rectangular_extrude(s, {w: param.thickness, h: param.thickness}));
    });
    o.push(union(p).setColor([1, 1, 0]).scale([1 / 8, 1 / 8, 1 / 3]).center([true, true, false]).translate([0, -8, param.thickness]));
  }
  o = [union(o)]; // neat: we combine name + title, and make it first entry of an array

  var b = o[0].getBounds();
  var m = 2;
  var w = b[1].x - b[0].x + m * 2;
  var h = b[1].y - b[0].y + m * 2;
  o.push(cube({size: [w, h, param.thickness], round: true, radius: 0.5}).translate([b[0].x - m, b[0].y - m, 0]));

  return union(o);
}


///////////////
module.exports = main;

if (typeof getParameterDefinitions === 'function') {
    module.exports.getParameterDefinitions = getParameterDefinitions;
}

},{"@jscad/scad-api":"@jscad/scad-api"}]},{},[]);
