// graph.js
class GraphPlotter {
	constructor(canvasId, resetAllButtonId, linearParams = { slope: 1, yIntersection: 0 }, aQuadraticParams = { a: 1, b: 0, c: 0 }) {
		this.canvas = document.getElementById(canvasId);
		this.ctx = this.canvas.getContext('2d');
		this.buttonResetAll = document.getElementById(resetAllButtonId);

		this.flagGrid = false;
		this.drawing = false;
		this.isPanning = false;
		this.startX = 0;
		this.startY = 0;
		this.offsetX = 0;
		this.offsetY = aQuadraticParams.a > 0 ? 200 : - 200;
		this.scale = 50;

		this.originX = this.canvas.width / 2;
		this.originY = this.canvas.height / 2;

		this.intersectionsX = {p:-1, q:1};

		this.ptOrg = {x:0, y:0};
		this.ptA = {x:0, y:0};
		this.ptB = {x:0, y:0};
		this.ptC = {x:0, y:0};


		// Parameters of linear and quadratic functions
		this.linearParams = linearParams;
		this.quadraticParams = aQuadraticParams;

		this.initEventListeners();
		this.redraw();
	}

	initEventListeners() {
		this.canvas.addEventListener('wheel', (e) => this.onWheel(e));
		this.canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
		this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
		this.canvas.addEventListener('mouseup', () => this.onMouseUp());
		this.canvas.addEventListener('mouseout', () => this.onMouseOut());
	}

	onWheel(e) {
		e.preventDefault();
		const scaleAmount = e.deltaY > 0 ? 0.9 : 1.1;
		this.scale *= scaleAmount;
		this.redraw();
	}

	onMouseDown(e) {
		this.isPanning = true;
		this.startX = e.offsetX;
		this.startY = e.offsetY;
	}

	onMouseMove(e) {
		if (this.isPanning) {
			this.offsetX += (e.offsetX - this.startX);
			this.offsetY += (e.offsetY - this.startY);
			this.startX = e.offsetX;
			this.startY = e.offsetY;
			this.redraw();
		} else if (this.drawing) {
			this.ctx.lineTo(e.offsetX, e.offsetY);
			this.ctx.stroke();
		}
	}

	onMouseUp() {
		this.isPanning = false;
		this.drawing = false;
	}

	onMouseOut() {
		this.isPanning = false;
		this.drawing = false;
	}

	resetAll() {
		this.drawing = false;
		this.isPanning = false;
		//this.flagGrid = false;
		this.startX = 0;
		this.startY = 0;
		this.offsetX = 0;
		this.offsetY = this.quadraticParams.a > 0 ? 200 : - 200;
		this.scale = 50;
		this.redraw();
	}

	setLinearParams(aSlope, aIntersection) {
		this.linearParams.slope = aSlope;
		this.linearParams.yIntersection = aIntersection;
		this.redraw();
	}

	setQuadraticParams(a, b, c) {
		this.offsetY = a > 0 ? 200 : - 200;
		this.quadraticParams.a = a;
		this.quadraticParams.b = b;
		this.quadraticParams.c = c;
		this.redraw();
	}

	setLinearParamsFromIntersections(aXp, aXq) {
		this.intersectionsX = {p : aXp, q : aXq};
		const { a, b, c } = this.quadraticParams;

		const y1 = a * aXp * aXp + b * aXp + c;
		const y2 = a * aXq * aXq + b * aXq + c;

		const slope = (y2 - y1) / (aXq - aXp);
		const intersection = y1 - slope * aXp;

		this.slope = a * (aXp + aXq);
		this.yIntersection = - a * aXp * aXq;
		this.setLinearParams(slope, intersection);

		this.ptA.x = aXp;
		this.ptA.y = a * (aXp ** 2);
		this.ptB.x = aXq;
		this.ptB.y = a * (aXq ** 2);
		this.ptC.x = 0;
		this.ptC.y = intersection;

		let flagFitting = false;
		while (flagFitting == false) {
			const pt1 = this.toCanvasXY(this.ptA);
			const pt2 = this.toCanvasXY(this.ptB);
			if (pt1[1] < 0 || pt1[1] > this.canvas.height || pt2[1] < 0 || pt2[1] > this.canvas.height) {
				this.scale *= 0.5;	
			}
			else {
				flagFitting = true;
			}
		}
	}

	clearCanvas() {
		this.ctx.clearRect(-this.canvas.width, -this.canvas.height, this.canvas.width * 2, this.canvas.height * 2);
	}

	drawGrid() {
		if (this.flagGrid)
		{
			if (this.scale > 2) {
				const step = 1;
				this.ctx.strokeStyle = 'lightgray';
				this.ctx.lineWidth = 0.5;

				for (let x = -this.canvas.width; x < this.canvas.width; x += step) {
					this.ctx.beginPath();
					this.ctx.moveTo(x * this.scale + this.offsetX + this.originX, -this.canvas.height);
					this.ctx.lineTo(x * this.scale + this.offsetX + this.originX, this.canvas.height);
					this.ctx.stroke();
				}

				for (let y = -this.canvas.height; y < this.canvas.height; y += step) {
					this.ctx.beginPath();
					this.ctx.moveTo(-this.canvas.width, y * this.scale + this.offsetY + this.originY);
					this.ctx.lineTo(this.canvas.width, y * this.scale + this.offsetY + this.originY);
					this.ctx.stroke();
				}
			}
		}
	}

	drawAxes() {
		this.ctx.strokeStyle = 'black';
		this.ctx.lineWidth = 1;

		this.ctx.beginPath();
		this.ctx.moveTo(-this.canvas.width, this.originY + this.offsetY);
		this.ctx.lineTo(this.canvas.width, this.originY + this.offsetY);
		this.ctx.stroke();

		this.ctx.beginPath();
		this.ctx.moveTo(this.originX + this.offsetX, -this.canvas.height);
		this.ctx.lineTo(this.originX + this.offsetX, this.canvas.height);
		this.ctx.stroke();
	}

	drawLinearFunction() {
		const { slope: p, yIntersection: q } = this.linearParams;	
		this.ctx.strokeStyle = 'blue';
		this.ctx.beginPath();
		//@@@
		for (let x = -this.canvas.width; x < this.canvas.width; x++) {
			const y = p * x + q;
			const canvasX = this.originX + x * this.scale + this.offsetX;
			const canvasY = this.originY - y * this.scale + this.offsetY;
			if (x === -this.canvas.width) {
				this.ctx.moveTo(canvasX, canvasY);
			} else {
				this.ctx.lineTo(canvasX, canvasY);
			}
		}
		//this.ctx.moveTo(this.originX + 0 * this.scale + this.offsetX, 0);
		//this.ctx.lineTo(this.originX + 0 * this.scale + this.offsetX, this.canvas.height);
		this.ctx.stroke();

		this.ctx.font = '16px Arial';
		const strFormulaQ = "straight line : y = b x + c";
		this.ctx.fillStyle = this.ctx.strokeStyle;
		this.ctx.fillText(strFormulaQ, 24, 48);
	}

	drawQuadraticFunction() {
		const { a, b, c } = this.quadraticParams;
		const step = 0.1;

		this.ctx.beginPath();
		for (let x = -this.canvas.width; x < this.canvas.width; x += step) {
			const y = a * x * x + b * x + c;
			const canvasX = this.originX + x * this.scale + this.offsetX;
			const canvasY = this.originY - y * this.scale + this.offsetY;
			if (x === -this.canvas.width) {
				this.ctx.moveTo(canvasX, canvasY);
			} else {
				this.ctx.lineTo(canvasX, canvasY);
			}
		}
		this.ctx.strokeStyle = 'red';
		this.ctx.stroke();

		this.ctx.font = '16px Arial';
		let strFormulaQ = "curve : y = a x ^ 2 = ???";
		switch(a) {
			case -1:
				strFormulaQ = "curve : y = a x ^ 2 =  - x^2";
				break;
			case 0:
				strFormulaQ = "curve : y = a x ^ 2 =  0";
				break;
			case 1:
				strFormulaQ = "curve : y = a x ^ 2 =  x^2";
				break;
			default:
				strFormulaQ = "curve : y =  a x ^ 2 = " + a + " x^2";
				break;
		}
		this.ctx.fillStyle = 'red';
		this.ctx.fillText(strFormulaQ, 24, 24);
	}
	
	toCanvasXY (aPoint = {x, y})
	{
		const Sx = this.originX + aPoint.x * this.scale + this.offsetX;
		const Sy = this.originY + aPoint.y * (- this.scale) + this.offsetY;
		return [Sx, Sy];
	}

	drawTriangleFill() {
		const a = this.quadraticParams.a;
		const ptO = this.toCanvasXY(this.ptOrg);
		const pt1 = this.toCanvasXY(this.ptA);
		const pt2 = this.toCanvasXY(this.ptB);

		this.ctx.fillStyle = "lime";
		this.ctx.beginPath();
		this.ctx.moveTo(ptO[0], ptO[1]);
		this.ctx.lineTo(pt1[0], pt1[1]);
		this.ctx.lineTo(pt2[0], pt2[1]);
		this.ctx.fill();
	}
	
	drawTriangleOutline() {
		const pt0 = this.toCanvasXY(this.ptOrg);
		const pt1 = this.toCanvasXY(this.ptA);
		const pt2 = this.toCanvasXY(this.ptB);

		this.ctx.strokeStyle = "green";
		this.ctx.lineWidth = 3;
		this.ctx.beginPath();
		this.ctx.moveTo(pt0[0], pt0[1]);
		this.ctx.lineTo(pt1[0], pt1[1]);
		this.ctx.lineTo(pt2[0], pt2[1]);
		this.ctx.lineTo(pt0[0], pt0[1]);
		this.ctx.stroke();
	}

	findIntersections() {
		const { a, b, c } = this.quadraticParams;
		const { slope: p, yIntersection: q } = this.linearParams;

		const A = a;
		const B = b - p;
		const C = c - q;

		const discriminant = B * B - 4 * A * C;
		if (discriminant < 0) {
			return []; // no answer
		}

		const sqrtDiscriminant = Math.sqrt(discriminant);
		const x1 = (-B + sqrtDiscriminant) / (2 * A);
		const x2 = (-B - sqrtDiscriminant) / (2 * A);

		return discriminant === 0 ? [x1] : [x1, x2];
	}

	drawInterseptionY() {
		const pt0 = this.toCanvasXY(this.ptOrg);
		const pt3 = this.toCanvasXY(this.ptC);
		this.ctx.strokeStyle = 'green';
		this.ctx.lineWidth = 4;
		this.ctx.fillStyle = 'black';
		this.ctx.font = '16px Arial';
		this.ctx.beginPath();
		this.ctx.moveTo(pt0[0], pt0[1]);
		this.ctx.lineTo(pt3[0], pt3[1]);
		this.ctx.stroke();
	}


	drawXIntersections() {
		const intersectionsX = this.findIntersections();

		if (intersectionsX.length === 0) return; // no answer

		this.ctx.strokeStyle = 'magenta';
		this.ctx.fillStyle = 'black';
		this.ctx.lineWidth = 1;
		this.ctx.font = '16px Arial';

		intersectionsX.forEach((x) => {
			const canvasX = this.originX + x * this.scale + this.offsetX;
			const canvasY = this.originY + this.offsetY;

			this.ctx.beginPath();
			this.ctx.moveTo(canvasX, -this.canvas.height);
			this.ctx.lineTo(canvasX, this.canvas.height);
			this.ctx.stroke();

			// display x-coordinates
			const ofsX = 3;
			const ofsY = this.quadraticParams.a > 0 ? 24 : -12;
			const strX = x < 0 ? "p = " : "q = "
			this.ctx.fillText(strX + x, canvasX + ofsX, canvasY + ofsY);
		});
	}

	drawPoints () {
		this.ctx.font = '16px Arial';
		this.ctx.fillStyle = 'black';

		// point O
		const pt0 = this.toCanvasXY(this.ptOrg);
		this.ctx.beginPath();
		this.ctx.arc(pt0[0], pt0[1], 5, 0, 2 * Math.PI);
		this.ctx.fill();
		const ofsY0 = this.quadraticParams.a > 0 ? 16 : -4;
		this.ctx.fillText("O", pt0[0] + 16, pt0[1] + ofsY0);

		// point A
		const pt1 = this.toCanvasXY(this.ptA);
		this.ctx.beginPath();
		this.ctx.arc(pt1[0], pt1[1], 5, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.fillText("A", pt1[0] - 24, pt1[1]);

		// point B
		const pt2 = this.toCanvasXY(this.ptB);
		this.ctx.beginPath();
		this.ctx.arc(pt2[0], pt2[1], 5, 0, 2 * Math.PI);
		this.ctx.fill();
		this.ctx.fillText("B", pt2[0] + 24, pt2[1]);

		// point C
		const pt3 = this.toCanvasXY(this.ptC);
		this.ctx.beginPath();
		this.ctx.arc(pt3[0], pt3[1], 5, 0, 2 * Math.PI);
		this.ctx.fill();
		let ofsX3 = 0;
		if (this.quadraticParams.a > 0) {
			ofsX3 = this.ptA.y < this.ptB.y ? -32 : 16;
		} else {
			ofsX3 = this.ptA.y < this.ptB.y ? 16 : -32;
		}
		this.linearParams.slope * (this.ptA.y - this.ptB.y) > 0 ? -16 : 16;
		const ofsY3 = this.quadraticParams.a > 0 ? - 8 : 24;
		const strIntersectionY = this.flagGrid ? "C = " + this.linearParams.yIntersection : "C";
		this.ctx.fillText(strIntersectionY, pt3[0] + ofsX3, pt3[1] + ofsY3);
	}

	redraw() {
		this.clearCanvas();
		this.drawTriangleFill();
		this.drawGrid();
		this.drawAxes();
		this.drawLinearFunction();
		this.drawQuadraticFunction();
		this.drawXIntersections();
		this.drawTriangleOutline();
		this.drawInterseptionY();
		this.drawPoints();
	}

	resizeCanvas(aCanvasId, aScaleW, aScaleH) {
		const canvas = document.getElementById(aCanvasId);
		canvas.width = aScaleW * window.innerWidth;
		canvas.height = aScaleH * window.innerHeight;
		const ctx = canvas.getContext('2d');
		ctx.fillStyle = 'white';
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	setGridFlag(aFlag)
	{
		this.flagGrid = aFlag;
		this.redraw();
	}
}
