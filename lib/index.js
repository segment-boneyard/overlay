
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
  var visible = ! this.hasClass('hidden');
  var showing = this.hasClass('showing');

  if('function' === typeof callback) {
    visible && !showing ? callback() : this.once('show', callback);
  }

  if (visible || showing) return this;
  this.addClass('showing');
  this.emit('showing');

  var self = this;
  after(this.el, function () {
    self.removeClass('showing');
    self.emit('show');
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
  var hidden = this.hasClass('hidden');
  var hiding = this.hasClass('hiding');

  if ('function' === typeof callback) {
    hidden && !hiding ? callback() : this.once('hide', callback);
  }

  if (hidden || hiding) return this;
  this.addClass('hiding');
  this.emit('hiding');

  var self = this;
  after(this.el, function () {
    self.removeClass('hiding');
    self.emit('hide');
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
  var removed = ! this.el.parentNode;
  var removing = this.hasClass('removing');

  if ('function' === typeof callback) {
    removed && !removing ? callback() : this.once('remove', callback);
  }

  if (removed || removing) return this;
  this.addClass('removing');
  this.emit('removing');

  var self = this;
  var el = this.el;
  this.hide(function () {
    el.parentNode.removeChild(el);
    self.removeClass('removing');
    self.emit('remove');
  });

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


/**
 * Attach or invoke callbacks for an
 */