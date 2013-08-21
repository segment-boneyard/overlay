
# overlay

  A simple overlay UI component.

## Installation

    $ component install segmentio/overlay

## Example

```js
var overlay = require('overlay');

overlay().closable(); // the body now has an overlay on it
```

## API

### overlay(target)
  Show an overlay on a given `target` element, defaulting to `document.body`.

### #show(fn)
  Show the overlay, optionally calling a callback `fn`.

### #hide(fn)
  Hide the overlay, optionally calling a callback `fn`.

### #remove(fn)
  Remove the overlay from the DOM optionally calling a callback `fn`. If the overlay isn't hidden yet, hide it first.

### #closable()
  Make the overlay closable by clicking on it, or hitting the `ESC` key.

### #temporary()
  Make the overlay remove itself after it's been hidden. This is useful for one-off overlays where you don't want to have to manage removing it from the DOM.

### #emitter
  [`component/emitter`](https://github.com/component/emitter) is mixed in.

### #classes
  [`ianstormtaylor/classes`](https://github.com/ianstormtaylor/classes) is mixed in.
  

## License

  MIT
