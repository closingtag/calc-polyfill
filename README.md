# A Polyfill for CSS3 calc()


This is a javascript poly fill for the CSS3 [calc-function](https://developer.mozilla.org/de/docs/Web/CSS/calc).

Inspired by:

- [selectivizr](http://selectivizr.com/)
- the original poly fill: [CJKay/PolyCalc](https://github.com/CJKay/PolyCalc)
- more recently by [css.js](https://github.com/jotform/css.js)

## Usage

Simply drop the link like this after you included your CSS:

	<script type="text/javascript" src="path/to/calc.js"></script>

A test for the support if calc() is integrated based on the [Modernizr test](https://github.com/Modernizr/Modernizr/blob/924c7611c170ef2dc502582e5079507aff61e388/feature-detects/css/calc.js)

Tested on Internet Explorer 8 and Android 4.0.3

## Dependencies

* support for ``document.querySelectorAll``
* for media queries ``window.matchMedia``

## Remarks

### Specificity

This polyfill does not take specificity into account when applying styles for calc().

For example if you have to rules:


	.element  div {
		width: calc(50% - 230px);
	}

	div {
		width: calc(50% - 100px);
	}

The first rule would apply for the ``<div />`` element because of higher specificity. The CSS is parsed from top to bottom and therefore the polyfill would apply the styles of the second rule. Just keep that in mind.

### Resetting

This polyfill also does not detect any resetting of calc():


	.element  div {
		width: calc(50% - 230px);
	}

	div {
		width: 50%;
	}

The polyfill will apply the rules from the first as it is not detecting the resetting of the width in the second.

### Inline Styles

Support for polyfilling inline styles is integrated. However right now there seems no way to get the unparsed contents of a ``<style />`` element in IE8 and therefore the polyfill will not work there. IF you find a way to do this let me now or make a PR.

### Media-Queries

There is currently no support for libs like [respond.js](https://github.com/scottjehl/Respond) and it is not planned to add support. However the polyfill uses ``window.matchMedia`` to test for media queries. If you wish to add support for media queries for IE8 include a [polyfill](https://github.com/paulirish/matchMedia.js/) before the calc-polyfill.

## To Do

* more Android testing
* consider imported CSS files wie ``@import``

