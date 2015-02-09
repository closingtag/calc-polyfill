	// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

	// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel

	// MIT license
	(function(){var e=0;var t=["ms","moz","webkit","o"];for(var n=0;n<t.length&&!win.requestAnimationFrame;++n){win.requestAnimationFrame=win[t[n]+"RequestAnimationFrame"];win.cancelAnimationFrame=win[t[n]+"CancelAnimationFrame"]||win[t[n]+"CancelRequestAnimationFrame"]}if(!win.requestAnimationFrame)win.requestAnimationFrame=function(t,n){var r=(new Date).getTime();var i=Math.max(0,16-(r-e));var s=win.setTimeout(function(){t(r+i)},i);e=r+i;return s};if(!win.cancelAnimationFrame)win.cancelAnimationFrame=function(e){clearTimeout(e)}})()
