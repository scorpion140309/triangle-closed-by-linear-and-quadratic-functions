// main.js

const mathTmp = {
	RandI: (aValL, aValR) => {
		const min = aValL < aValR ? aValL : aValR;
		const max = aValL > aValR ? aValL : aValR;
		const range = max - min + 1;
		return Math.floor(Math.random() * range) + min;
    }
}

class mainClass {
	constructor(aCanvasId, aResetAllButtonId, aFreeCanvasID) {
		//
		this.plotter = new GraphPlotter(aCanvasId, aResetAllButtonId);
		//
		this.plotter.resizeCanvas(aFreeCanvasID, 0.9, 0.5);
		//
		this.coefA = 1;
		this.intersectionsX = [-1, 1];
		//
		this.flagAnswer = false;
		//
		this.canvas = new myCanvas(aFreeCanvasID);
	}
	drawGraph () {
		const s = Math.random() < 0.5 ? -1 : 1;
		const n = mathTmp.RandI(-2, 1);
		const a = s * (2 ** n);
		this.plotter.setQuadraticParams(a, 0, 0);  // y = a x^2
		this.coefA = a;
		// set the X coordinates of the intersections and calculate the linear function
		const range = 4;
		const x1 = - Math.floor(Math.random() * range) - 1;
		let x2 = Math.floor(Math.random() * range) + 1;
		while (Math.abs(x1) == Math.abs(x2)) {
			x2 = Math.floor(Math.random() * range) + 1;
		}
		this.intersectionsX[0] = x1;
		this.intersectionsX[1] = x2;
		this.plotter.setLinearParamsFromIntersections(x1, x2);
		this.plotter.setGridFlag(this.flagAnswer);

		this.plotter.redraw();
    }
	resetGraph() {
		this.canvas.clearCanvas();
		this.plotter.resetAll();
		this.drawGraph();
	}
	resetAll() {
		this.flagAnswer = false;
		this.resetGraph();
	}
	toggleFlagAnswer() {
		this.flagAnswer = !this.flagAnswer;
		this.plotter.setGridFlag(this.flagAnswer);
	}
	getFomulaFlag() {
		return this.flagAnswer;
	}
	GetParams() {
		return [this.coefA, this.intersectionsX[0], this.intersectionsX[1]];
	}
}

//
let mc = new mainClass('graphCanvas', 'reset_all_button', 'canvas-Free');

//
function resetAll () {
	mc.resetAll();
	[a, p, q] = mc.GetParams();
	generateMathJax(a,p,q,false);
}

//
function toggleAnswer () {
	mc.toggleFlagAnswer();
	generateMathJax(a,p,q, mc.getFomulaFlag());
}

//
function generateExercise() {
	mc.resetGraph();
	[a, p, q] = mc.GetParams();
	generateMathJax(a,p,q, mc.getFomulaFlag());
}

//
function clearCanvas() {
	mc.canvas.clearCanvas();
}

//
document.addEventListener("DOMContentLoaded", () => {
	//
	mc.drawGraph();
	[a, p, q] = mc.GetParams();
	generateMathJax(a,p,q, mc.getFomulaFlag());
});

