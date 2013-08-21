
var after = require('after-transition').once
  , bindAll = require('bind-all')
  , Classes = require('classes')
  , domify = require('domify')
  , Emitter = require('emitter')
  , escape = require('on-escape')
  , event = require('event')
  , redraw = require('redraw')
  , template = require('./index.html');


/**
 * Expose `Overlay`.
 */

module.exports = Overlay;


/**
 * Initialize a new `Overlay`.
 *
 * @param {Element} target (optional)
 */

function Overlay (target) {
  if (!(this instanceof Overlay)) return new Overlay(target);
  bindAll(this);
  this.el = domify(template);
  if (!target) {
    target = document.body;
    this.addClass('fixed');
  }
  target.appendChild(this.el);
  redraw(this.el); // to force an initial show to take
}


/**
 * Mixin emitter.
 */

Emitter(Overlay.prototype);


/**
 * Mixin classes.
 */

Classes(Overlay.prototype);


/**
 * Show the overlay.
 *
 * @param {Function} callback
 * @return {Overlay}
 */

Overlay.prototype.show = function (callback) {
  var self = this;
  this.emit('showing');
  after(this.el, function () {
    self.emit('show');
    if ('function' === typeof callback) callback();
  });
  this.removeClass('hidden');
  return this;
};


/**
 * Hide the overlay.
 *
 * @param {Function} callback
 * @return {Overlay}
 */

Overlay.prototype.hide = function (callback) {
  if (this._hiding) return this;
  this._hiding = true;
  var self = this;
  this.emit('hiding');
  after(this.el, function () {
    self.emit('hide');
    if ('function' === typeof callback) callback();
    this._hiding = false;
  });
  this.addClass('hidden');
  return this;
};


/**
 * Remove the overlay from the DOM, hiding it first if it isn't hidden.
 *
 * @param {Function} callback
 * @return {Overlay}
 */

Overlay.prototype.remove = function (callback) {
  if (this._removing) return this;
  this._removing = true;
  var self = this;
  var remove = function () {
    self.emit('remove');
    if (self.el.parentNode) self.el.parentNode.removeChild(self.el);
    if ('function' === typeof callback) callback();
    this._removing = false;
  };
  this.emit('removing');
  this.hasClass('hidden') ? remove() : this.hide(remove);
  return this;
};


/**
 * Bind to closeable events.
 *
 * @return {Overlay}
 * @api private
 */

Overlay.prototype.bind = function () {
  event.bind(this.el, 'click', this.hide);
  escape.bind(this.hide);
  return this;
};


/**
 * Unbind from closeable events.
 *
 * @return {Overlay}
 * @api private
 */

Overlay.prototype.unbind = function () {
  event.unbind(this.el, 'click', this.hide);
  escape.unbind(this.hide);
  return this;
};


/**
 * Make the overlay closeable.
 *
 * @return {Overlay}
 */

Overlay.prototype.closeable =
Overlay.prototype.closable = function () {
  this.addClass('closeable').addClass('closable');
  this.on('show', this.bind);
  this.on('hide', this.unbind);
  return this;
};


/**
 * Make the overlay temporary, so that it will be removed when hidden.
 *
 * @return {Overlay}
 */

Overlay.prototype.temporary = function () {
  this.addClass('temporary');
  this.on('hide', this.remove);
  return this;
};