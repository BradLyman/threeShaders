'use strict';
let Three = require('three');

/**
 * The mixin expects the component to define two methods,
 * onResize, and updateScene.
 * The mixin provides four properties:
 *     renderer, canvasWidth, canvasHeight, aspect.
 * The renderer is the webgl renderer.
 * The canvasWidth/Height is the current width and height
 *   of the webgl canvas.
 * The aspect is the aspect ratio of the canvas, this is
 *   enforced by javascript when the screen is resized.
 **/
module.exports = {
  //---- Public Members ----//
  aspect : 4/3,

  //---- Lifecycle Methods ----//
  componentWillUnmount : function() {
    this._active = false;
    if (this.renderer) {
      delete this.renderer;
      this.renderer = undefined;
    }
  },

  componentDidMount : function() {
    this.renderer = new Three.WebGLRenderer(
        { canvas    : this.refs.canvas,
          antialias : true,
        });

    let updateCanvasSize = this._updateCanvasSize;
    window.onresize = (function() {
      let timer = 0;
      return function() {
        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(updateCanvasSize, 100);
      };
    }());

    this._active = true;
  },

  //---- Public Methods ----//
  start : function() {
    this._updateCanvasSize();
    this._updateScene();
  },

  //---- Private Methods ----//
  _updateScene : function() {
    if (this._active) {
      this.updateScene();
    }
    requestAnimationFrame(this._updateScene);
  },

  _updateAspect : function() {
    let canvas = this.refs.canvas;
    let computed = window.getComputedStyle(canvas);
    let w = parseFloat(computed.width);
    let h = (w / this.aspect) + 'px';
    canvas.style.height = h;
  },

  _updateCanvasSize : function() {
    this._updateAspect();
    let canvas        = this.refs.canvas;
    let computed      = window.getComputedStyle(canvas);
    this.canvasWidth  = parseFloat(computed.width);
    this.canvasHeight = parseFloat(computed.height);

    this.renderer.setSize(
        this.canvasWidth, this.canvasHeight);

    if (this.onResize) {
      this.onResize();
    }
  },
};
