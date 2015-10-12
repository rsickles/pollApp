// Used http://www.html5canvastutorials.com/ and draw.js for help writing on canvas

 var canvas = document.getElementById('myCanvas');
 var context = canvas.getContext('2d');

 // taken from website draw.js
 document.ontouchmove = function(e){ e.preventDefault();};
 var canvastop = canvas.offsetTop;
 var canvasleft = canvas.offsetLeft;
 var shape = "";
 var colors = ["green", "red", "blue", "yellow"];
 var color = "";

 //this function draws the shape with the specified color and shape
 function drawShape(shape,color,locX,locY) {
      var centerX = locX;
      var centerY = locY;
      //first decide what shape to draw based on check boxes
      if(shape=="rectangle")
      {
	      context.beginPath();
	      context.rect(centerX, centerY, 200, 100);
      }
      if(shape=="circle")
      {
	      var radius = 70;
	      context.beginPath();
	      context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
      }
      if(shape=="square")
      {
	      context.beginPath();
	      context.rect(centerX, centerY, 100, 100);
      }
      //now choose random color and add to canvas
      var color_number = Math.floor(Math.random() * 4);
      if(color!=="random"){
      	context.fillStyle = color;
      }
      else
      {
      	context.fillStyle = colors[color_number];
    	}
      context.fill();
      context.lineWidth = 5;
      context.strokeStyle = '#003300';
      context.stroke();
}

 // taken from website draw.js
 var doOnTouchStart = function(event){
	  event.preventDefault();
	  if(shape==="" || color ==="")
	  {
	  	alert("Please Select Shape And Color First");
	  }
	  else
	  {
	    lastx = event.touches[0].clientX - canvasleft;  // try substituting 1
	    lasty = event.touches[0].clientY - canvastop;   // or 2 for index for multitouch
	    drawShape(shape,color,lastx,lasty);
  	}
  };

 // used for dragging shape creation effect
 var doOnTouchMove = function(event)
 {
    event.preventDefault();

    if(shape==="" || color ==="")
	  {
	  	alert("Please Select Shape And Color First");
	  }
	  else
	  {
    	var newx = event.touches[0].clientX - canvasleft;
    	var newy = event.touches[0].clientY - canvastop;
    	drawShape(shape,color,newx,newy);
  	}
  }

 //called to get the shape of the currently checked box
 function getShape(){
 	shape = $('input[name=shape]:checked', '#chooseShape').attr('id');
 }

//called to get the color of the currently checked box
 function getColor(){
 	color = $('input[name=color]:checked', '#chooseColor').attr('id');
 }

// added touch handlers
canvas.addEventListener("touchmove", doOnTouchMove);
canvas.addEventListener("touchstart", doOnTouchStart);

 // bind event handler to clear button
document.getElementById('clear').addEventListener('click', function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
}, false);



