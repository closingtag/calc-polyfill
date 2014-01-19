# A Polyfill for CSS3 calc()


This is a javascript poly fill for the CSS3 calc-function. Inspired by [selectivizr](http://selectivizr.com/) and the original poly fill: [CJKay/PolyCalc](https://github.com/CJKay/PolyCalc).

## Usage

Simply drop the link like this after you included your CSS:

	<script type="text/javascript" src="path/to/calc.js"></script> 

Unfortunatly there is no test for support of calc(). But you can use conditional loading of [Modernizr](http://modernizr.com/docs/#load) like this:

	Modernizr.load({
	  test: Modernizr.csscalc,
	  nope: 'path/to/calc.js'
	});

## Dependencies

* support for document.querySelectorAll()
