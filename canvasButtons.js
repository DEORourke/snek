
const ButtonLayouts = Object.freeze({
	FourButtonDpad : {
		Left : {
			x1 : .07,
			y1 : .275,
			x2 : .31,
			y2 : .725
		},
		Right : {
			x1 : .69,
			y1 : .275,
			x2 : .93,
			y2 : .725
		},
		Up : {
			x1 : .37,
			y1 : .025,
			x2 : .63,
			y2 : .445
		},
		Down : {
			x1 : .37,
			y1 : .552,
			x2 : .63,
			y2 : .975
		}
	},
	LeftRightAction : {
		Left : {
			x1 : .07,
			y1 : .138,
			x2 : .32,
			y2 : .862			
		},
		Right : {
			x1 : .37,
			y1 : .138,
			x2 : .62,
			y2 : .862
		},
		Action: {
			x1 : .68,
			y1 : .138,
			x2 : .93,
			y2 : .862,
			shape : "elipse"
		}
	},
	FourButtonDpadPause : {
		Left : {
			x1 : .10,
			y1 : .275,
			x2 : .31,
			y2 : .725
		},
		Right : {
			x1 : .69,
			y1 : .275,
			x2 : .90,
			y2 : .725
		},
		Up : {
			x1 : .37,
			y1 : .025,
			x2 : .63,
			y2 : .445
		},
		Down : {
			x1 : .37,
			y1 : .552,
			x2 : .63,
			y2 : .975
		},
		Action: {
			x1 : .90,
			y1 : .03,
			x2 : .98,
			y2 : .20,
			shape : "pause"
		}
	},
	DPadTwoAction : {
		Left : {
			x1 : .03,
			y1 : .275,
			x2 : .25,	//31
			y2 : .725
		},
		Right : {
			x1 : .53, //69
			y1 : .275,
			x2 : .75,
			y2 : .725
		},
		Up : {
			x1 : .28, //37
			y1 : .025,
			x2 : .50, //63
			y2 : .445
		},
		Down : {
			x1 : .28,
			y1 : .552,
			x2 : .50,
			y2 : .975
		},
		Action1: {
			x1 : .78,
			y1 : .03,
			x2 : .97,
			y2 : .48,
			shape : "elipse"
		},
		Action2: {
			x1 : .78,
			y1 : .52,
			x2 : .97,
			y2 : .97,
			shape : "elipse"
		}
	},
	DPadOneAction : {
		Left : {
			x1 : .03,
			y1 : .275,
			x2 : .25,
			y2 : .725
		},
		Right : {
			x1 : .53,
			y1 : .275,
			x2 : .75,
			y2 : .725
		},
		Up : {
			x1 : .28,
			y1 : .025,
			x2 : .50,
			y2 : .445
		},
		Down : {
			x1 : .28,
			y1 : .552,
			x2 : .50,
			y2 : .975
		},
		Action: {
			x1 : .78,
			y1 : .138,
			x2 : .97,
			y2 : .862,
			shape : "elipse"
		}
	}
});

/*
5 gap between right and action
14 between actions


*/

class CanvasButtons {
		canvasOffsetX = 0;
		canvasOffsetY = 0;
		mouseButonValue = 0;
		buttons = [];
		values = {}
	constructor(canvas,config) {
		this.ctx = canvas.getContext("2d");
		this.getCanvasOffset(canvas);
		this.canvasWidth = canvas.width;
		this.canvasHeight = canvas.height;
		this.config = config
		this.buttonSpaceStart  = canvas.height * (1 - config.buttonSpaceSize);
		this.buttonSetup();
	}
	
	handleTouchDown(e) {
		let touches = e.targetTouches;
		for (let i = 0; i< touches.length; i++) {
			this.checkForButtonPress(
				touches[i].clientX - this.canvasOffsetX,
				touches[i].clientY - this.canvasOffsetY
			)
		}
		//this.drawButtons();
	}
	
	handleTouchMove() {	}
	
	handleTouchUp(e) {
		this.clearButtons();
		let touches = e.targetTouches;
		for (let i = 0; i< touches.length; i++) {
			this.checkForButtonPress(
				touches[i].clientX - this.canvasOffsetX,
				touches[i].clientY - this.canvasOffsetY
			)
		}
		//this.drawButtons();
	}
	
	handleClickDown(e) {
		this.checkForButtonPress(e.offsetX, e.offsetY);
		//this.drawButtons();
	}
	
	handleMouseMove() {	}
	
	handleClickUp(e) {
		this.clearButtons();
		//this.drawButtons();
	}
	
	getCanvasOffset(canvas) {
		let boundingBox = canvas.getBoundingClientRect();
		this.canvasOffsetX = boundingBox.x;
		this.canvasOffsetY = boundingBox.y;
	}
	
	drawButtons() {
		if (this.config.drawSpacer) {
			this.ctx.save();
			this.ctx.beginPath();
			this.ctx.moveTo(0, this.buttonSpaceStart);
			this.ctx.lineTo(this.canvasWidth, this.buttonSpaceStart);
			this.ctx.stroke();
		}
		this.buttons.forEach(btn => {
			this.ctx.fillStyle = this.values[btn.name] ? btn.colors.highlightColor : btn.colors.fillColor;
			this.ctx.strokeStyle = btn.colors.outlineColor;
			this.ctx.fill(btn.path);
			this.ctx.stroke(btn.path)
		});
		this.ctx.restore();
	}
	
	// Private methods below
	// Remember to add # later (NP++ can't handle colapsing with them)
	
	buttonSetup() {
		let layout = ButtonLayouts[this.config.layout];
		if (!layout) { return; }
		let keys = Object.keys(layout)
		keys.forEach(key => {
			let btn = {};
			btn.name = key;
			let points = this.getButtonRangeCoordinants(this.config.buttonSpaceSize, layout[key])
			btn.range = new CoordinantRange(...points);
			var type;
			if (key.match("Action")) {
				type = "action";
				btn.path = this.getActionButtonPath(layout[key].shape, btn.range);
			} else {
				let btnPathPoints = this.getArrowPathCoordinants(key, btn.range);
				btn.path = this.getPolygonalPath2DFromPoints(btnPathPoints);
				type = "arrows";
			};
			btn.colors = {
				outlineColor : this.config[type].colors.defaultOutlineColor,
				fillColor : this.config[type].colors.defaultFillColor,
				highlightColor : this.config[type].colors.defaultHighlightColor
			};	
		this.buttons.push(btn);
		})
	}
	
	checkForButtonPress(x,y) {
		this.buttons.forEach(btn => {
			if(btn.range.inArea(x,y)){
				this.values[btn.name] = true;
			}
		});
	}
	
	clearButtons() {
		Object.keys(this.values).forEach(keyName => {
			this.values[keyName] = false;
		});
	}
	
	getArrowCornerCoordinates(dir) {
		// return an array of arrays that the x/y points for the corners direction buttons should be modified by to make arrows
		// topLeft, topRight, botRight, botLeft
		switch(dir){
			case "Left": return [[buttonConfig.arrows.LRpoint , 0],[0,0],[0,0],[buttonConfig.arrows.LRpoint , 0]];
			case "Right": return [[0,0],[buttonConfig.arrows.LRpoint, 0],[buttonConfig.arrows.LRpoint, 0],[0,0]];
			case "Up": return [[0,buttonConfig.arrows.TBpoint],[0,buttonConfig.arrows.TBpoint],[0,0],[0,0]];
			case "Down": return [[0,0],[0,0],[0,buttonConfig.arrows.TBpoint],[0,buttonConfig.arrows.TBpoint]];
			default : return [[0,0],[0,0],[0,0],[0,0]];
		};
	}

	getActionButtonPath(shape, range) {
		switch(shape) {
			case "elipse" : return this.getElipsePath2DFromRange(range);
			case "octogon" : return this.getPolygonalPath2DFromPoints( this.getOctogonPathCoordinatesFromRange(range) );
			case "roundedRect" : return this.getRoundedRectPath2DFromRange(range);
			case "pause" : return this.getPauseSymbolPath2DFromRange(range);
			default : return this.getPolygonalPath2DFromPoints( this.getArrowPathCoordinants("",range) );	// results in a square
		}
	}
	
	getElipsePath2DFromRange(range) {
		let yRadi = range.height /2;
		let xRadi = range.width /2;
		let startY = range.y1 + yRadi;
		return new Path2D(`M${range.x1} ${startY}A${xRadi} ${yRadi} 0 1 1 ${range.x2} ${startY}A${xRadi} ${yRadi} 0 1 1 ${range.x1} ${startY}`);
	}
	
	getOctogonPathCoordinatesFromRange(range) {
		let sideOffsetX = range.width * this.config.action.shapes.octogon.sideCutout;
		let sideOffsetY = range.height * this.config.action.shapes.octogon.sideCutout;
		
		let points = [		
		[range.x1, range.midpointY - sideOffsetY],
		[range.midpointX - sideOffsetX, range.y1],
		[range.midpointX + sideOffsetX, range.y1],
		[range.x2, range.midpointY - sideOffsetY],
		[range.x2, range.midpointY + sideOffsetY],
		[range.midpointX + sideOffsetX, range.y2],	
		[range.midpointX - sideOffsetX, range.y2],
		[range.x1, range.midpointY + sideOffsetY]
		];
		
		return this.getPolygonalPath2DFromPoints(points);
	}
	
	getRoundedRectPath2DFromRange(range) {
		let offsetX = range.width * this.config.action.shapes.roundedRect.borderRadius;
		let offsetY = range.height * this.config.action.shapes.roundedRect.borderRadius;
		let xRadi = range.midpointX - offsetX - range.x1;
		let yRadi = range.midpointY - offsetY - range.y1;
		return new Path2D(
			`M${range.x1} ${range.midpointY - offsetY}
			 A${xRadi} ${yRadi} 0 0 1 ${range.midpointX - offsetX} ${range.y1}
			 L${range.midpointX + offsetX} ${range.y1}
			 A${xRadi} ${yRadi} 0 0 1 ${range.x2} ${range.midpointY - offsetY}
			 L${range.x2} ${range.midpointY + offsetY} 
			 A${xRadi} ${yRadi} 0 0 1 ${range.midpointX + offsetX} ${range.y2}
			 L${range.midpointX - offsetX} ${range.y2}
			 A${xRadi} ${yRadi} 0 0 1 ${range.x1} ${range.midpointY + offsetY}
			 z`
		);
	}
	
	getPauseSymbolPath2DFromRange(range) {
		let gapOffset = range.width * .1;
		return new Path2D(
			`M${range.x1} ${range.y1}
			 L${range.midpointX - gapOffset} ${range.y1}
			 L${range.midpointX - gapOffset} ${range.y2}
			 L${range.x1} ${range.y2}
			 z
			 M${range.midpointX + gapOffset} ${range.y1}
			 L${range.x2} ${range.y1}
			 L${range.x2} ${range.y2}
			 L${range.midpointX + gapOffset} ${range.y2}
			 z`
		);
	}
	
	getButtonRangeCoordinants(size,positions) {
		let buttonSpaceheight = this.canvasHeight - this.buttonSpaceStart;
		return [
			this.canvasWidth * positions.x1,
			buttonSpaceheight * positions.y1 + this.buttonSpaceStart,
			this.canvasWidth * positions.x2,
			buttonSpaceheight * positions.y2 + this.buttonSpaceStart
		];
	}

	getArrowPathCoordinants(dir, range) {
		let corners = this.getArrowCornerCoordinates(dir);		
		return [
			[ range.x1 + range.width * corners[0][0], range.y1 + range.height * corners[0][1]],
			[ range.midpointX, range.y1 ],
			[ range.x2 - range.width * corners[1][0], range.y1 + range.height * corners[1][1]],
			[ range.x2, range.midpointY ],
			[ range.x2 - range.width * corners[2][0], range.y2 - range.height * corners[2][1]],
			[ range.midpointX, range.y2 ],
			[ range.x1 + range.width * corners[3][0], range.y2 - range.height * corners[3][1]],
			[ range.x1, range.midpointY]
		];
	}
	
	getPolygonalPath2DFromPoints(points) {
	// Takes an array of arrays representing a series of X Y coordinants and returns a closed Path2D of those points.
		let strArray = [`M${points[0][0]} ${points[0][1]}`];
		for (let i=1; i<points.length; i++) {
			strArray.push(`L${points[i][0]} ${points[i][1]}`);
		}
		strArray.push("z");
		let str = strArray.join("")
		return new Path2D(str);
	}

}

class CoordinantRange {
	constructor(x1,y1,x2,y2) {
		[this.x1,this.x2] = [x1,x2].sort(this.sort);
		[this.y1,this.y2] = [y1,y2].sort(this.sort);
		this.width = this.x2 - this.x1;
		this.midpointX = (this.x1 + this.x2)/2;
		this.height = this.y2 - this.y1;
		this.midpointY = (this.y1 + this.y2)/2;
	}
	sort(a,b) {
		return parseFloat(a) - parseFloat(b)
	}
	getPoints() {
		return [this.x1, this.y1, this.x2, this.y2];
	}
	draw(ctx) {
		if (!ctx) { return; }
		ctx.strokeRect(this.x1, this.y1, this.width, this.height);
	}
	clear(ctx) {
		if (!ctx) { return; }
		ctx.clearRect(this.x1, this.y1, this.width, this.height);
	}
	write(txt, ctx) {
		if (!ctx) { return; }
		ctx.save();
		ctx.textAlign = 'center';
		ctx.textBaseline = "middle"
		ctx.fillText(txt,this.midpointX, this.midpointY, this.width);
		ctx.restore();
	}
	inArea(x,y) {
		return ( this.x1 < parseFloat(x) 
			&& this.x2 > parseFloat(x)
			&& this.y1 < parseFloat(y)
			&& this.y2 > parseFloat(y)
		)
	}
}

/* Sample button config
const buttonConfig = {
	buttonSpaceSize: .33,  // percentage of the height canvas that the buttons should take up expressed as a decimal
	layout : "FourButtonDpad",
	drawSpacer : true,
	action: {
		shapes: {
			elipse: {
				optionVariable : 0  // I really can't think of anything to put here
			},
			octogon: {
				sideCutout : .25 // percentage of each side that gets cut out to form the diagional sides of the octogon
			},
			roundedRect: {
				borderRadius : .25
			}
		},
		colors: {
			defaultOutlineColor: "#222",
			defaultFillColor: "#333",
			defaultHighlightColor: "#c00"
		}
	},
	arrows: {
		LRpoint: .35, // percentage of the width of the button range to move in to start the point
		TBpoint: .5, // percentage of the hight of the button range to move in to start the point
		colors: {
			defaultOutlineColor: "#222",
			defaultFillColor: "#333",
			defaultHighlightColor: "#DD0"
		}
	}
}
*/

