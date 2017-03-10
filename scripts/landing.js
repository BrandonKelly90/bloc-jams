var animatePoints = function() {
<<<<<<< HEAD
				
	var points = document.getElementsByClassName('point');
	
	var revealPoint = function(number) {
		points[number].style.opacity = 1;
		points[number].style.transform = "scaleX(1) translateY(0) rotate(360deg)";
		points[number].style.msTransform = "scaleX(1) translateY(0) rotate(360deg)";
		points[number].style.WebkitTransform = "scaleX(1) translateY(0) rotate(360deg)";
	}
	
	for (var i = 0; i < points.length; i++) {
		
		revealPoint(i);
	}
};