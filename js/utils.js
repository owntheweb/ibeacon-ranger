//make window.requestAnimationFrame cross-browser
//used when telling browser that JavaScript is being used
//specifically for animation, gives higher priority, smoother performance
if(!window.requestAnimationFrame) {
	window.requestAnimationFrame = (window.webkitRequestAnimationFrame ||
									window.mozRequestAnimationFrame ||
									window.oRequestAnimationFrame ||
									window.msRequestAnimationFrame ||
									function(callback) {
										return window.setTimeout(callback, 1000/60);
									});
}