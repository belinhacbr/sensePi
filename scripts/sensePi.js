	var strokeColor = [ 'rgba(89,48,27,1)','rgba(223,134,74,1)', 
						'rgba(76,31,115,1)','rgba(204,95,211,1)', 
						'rgba(4,100,102,1)','rgba(26,228,225,1)', 
						'rgba(2,64,144,1)','rgba(0,128,254,1)', 
						'rgba(51,75,40,1)','rgba(148,194,99,1)']
				
	var startAngles = [], endAngles = [], nextAngles = [];
	var xc, yc, innerCircleRad, outerCircleRad;
	var toValue, fromValue, steps = 1000, piIndex;
	

	function draw(){
		var canvas = document.getElementById("canvas");
		if (canvas.getContext){
			var ctx = canvas.getContext('2d');
			canvas.width = window.innerWidth;
    		canvas.height = window.innerHeight;
    		xc = (canvas.width/2);
    		yc = (canvas.height/2);
    		innerCircleRad = getRad(10);
			outerCircleRad = getRad(15);

    		drawOuterCircle(ctx, xc, yc, outerCircleRad);
    		drawText(ctx);
    		fromValue = pi[0];
    		piIndex = 1;
			setInterval(drawLines,100);					
		}
	}

	function getRad(r){
		if(canvas.height < canvas.width){
			return (yc - (canvas.height/r)) ;
		}else{
			return (xc - (canvas.width/r)) ;
		}
	}

	function xParametricCoord(xc, r, angle){
		return xc + r * Math.cos(angle); 
	}

	function yParametricCoord(yc, r, angle){
		return yc + r * Math.sin(angle);
	}

	function degreesToRad(degrees){
		return (degrees * Math.PI / 180);
	}

	function radToDegrees(rad){
		return (rad * 180 / Math.PI);
	}

	function drawText(ctx) {
	    ctx.fillStyle = 'white';
	    ctx.font = "12pt Roboto";
	    var xt, yt, segmentMed;
    	textCircleRad = getRad(25);
    	for(var i=0; i<10; i++){
    		segmentMed = (startAngles[i] + endAngles[i])/2;
    		xt = xParametricCoord(xc-10, textCircleRad, segmentMed);
    		yt = yParametricCoord(yc+7, textCircleRad, segmentMed);
    		ctx.fillText("//"+i, xt, yt);
    	}
	}

	function drawInnerCircle(ctx, xc, yc, innerCircleRad){
		ctx.beginPath();
		ctx.lineWidth = 2;
		ctx.strokeStyle = 'black';
		ctx.arc(xc,yc,40,0,Math.PI*2,true);
		ctx.moveTo(xc+innerCircleRad,yc);
		ctx.arc(xc,yc,innerCircleRad,0,Math.PI*2,true);
		ctx.stroke();
	}

	function drawOuterCircle(ctx, xc, yc, outerCircleRad){
		var sectionRad = degreesToRad(36);
		var gapRad = degreesToRad(3);
		var startAngle = gapRad, endAngle;
		for(var i=1; i<=10; i++){
			endAngle = (i*sectionRad);

			ctx.beginPath();
			ctx.lineWidth = 5;
			ctx.strokeStyle = strokeColor[i-1];
			ctx.arc(xc, yc, outerCircleRad, startAngle , endAngle, false);
			ctx.stroke();

			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.arc(xc, yc, outerCircleRad, endAngle, endAngle+gapRad, false);
			ctx.stroke();

			startAngles.push(startAngle);
			nextAngles.push(startAngle);
			endAngles.push(endAngle);
			startAngle = endAngle+gapRad;
		}
	}

	function getNextSequencialAngle(value){
		var nextAngle = nextAngles[value];
		var spacingRatio = 0.005;
		if((nextAngles[value] + spacingRatio) < endAngles[value]){
			nextAngles[value] = nextAngles[value] + spacingRatio;
		}else{
			nextAngles[value] = startAngles[value]+ 0.002;
		}
		return nextAngle;
	}

	function getNextRandomAngle(value){
		return ((Math.random() * startAngles[value]) + endAngles[value]);
	}


	function drawLines(){
		var canvas = document.getElementById("canvas");
		if (canvas.getContext){
			var ctx = canvas.getContext('2d');
			var x0, y0, x1, y1, fromValueNextAngle, toValueNextAngle;
			if(piIndex <= steps){
				ctx.save();
				toValue = pi[piIndex];

				fromValueNextAngle = getNextSequencialAngle(fromValue), toValueNextAngle = getNextSequencialAngle(toValue);
				x0=xParametricCoord(xc, innerCircleRad, fromValueNextAngle);
				y0=yParametricCoord(yc, innerCircleRad, fromValueNextAngle); 
				x1=xParametricCoord(xc, innerCircleRad, toValueNextAngle); 
				y1=yParametricCoord(yc, innerCircleRad, toValueNextAngle);

				console.log("pi");

				ctx.beginPath();
				ctx.strokeStyle = strokeColor[toValue];
				ctx.lineWidth = 1;
				ctx.moveTo(x0, y0);
				ctx.quadraticCurveTo(xc, yc, x1,y1);

				ctx.stroke();
				ctx.restore();
				fromValue = toValue;
				piIndex++;
			}
		}
	}
