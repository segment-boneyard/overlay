var template = require('./index.html');
var domify = require('domify');
var emitter = require('emitter');
var showable = require('showable');
var classes = require('classes');

/**
 * Exports
 *
 * @type {Function}
 */
module.exports = Overlay;


/**
 * Initialize a new `Overlay`.
 *
 * @param {Object} options
 * @api public
 */

function Overlay(target) {
  if(!(this instanceof Overlay)) return new Overlay(target);

  this.target = target || document.body;
  this.el = domify(template);
  this.el.addEventListener('click', this.handleClick.bind(this));

  var self = this;

  this.on('showing', function(){
    self.target.appendChild(self.el);
  });

  this.on('hide', function(){
    self.target.removeChild(self.el);
  });
}


/**
 * When the overlay is click, emit an event so that
 * the view that is using this overlay can choose
 * to close the overlay if they want
 *
 * @param {Event} e
 *
 * @return {void}
 */
Overlay.prototype.handleClick = function(e){
  this.emit('click', e);
};


/**
 * Mixins
 */
emitter(Overlay.prototype);
showable(Overlay.prototype);
classes(Overlay.prototype);