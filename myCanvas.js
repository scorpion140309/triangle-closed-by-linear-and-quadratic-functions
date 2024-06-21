//
class myCanvas {
	constructor(canvasId) {
		this.canvas = document.getElementById(canvasId);
		this.context = this.canvas.getContext("2d");
		this.isDrawing = false;

		this.init();
	}

	init() {
		document.addEventListener("DOMContentLoaded", () => {
			this.attachEventListeners();
			this.setupCanvas();
		});
	}

	setupCanvas() {
		this.context.lineWidth = 1;
		this.context.strokeStyle = '#000';
		this.context.lineCap = 'round';
	}

	startDrawing(e) {
		this.isDrawing = true;
		this.draw(this.getMousePos(e));
		e.preventDefault();
	}

	stopDrawing() {
		this.isDrawing = false;
		this.context.beginPath();
	}

	draw(pos) {
		if (!this.isDrawing) return;

		this.context.lineTo(pos.x, pos.y);
		this.context.stroke();
		this.context.beginPath();
		this.context.moveTo(pos.x, pos.y);
	}

	getMousePos(e) {
		const rect = this.canvas.getBoundingClientRect();
		const scaleX = this.canvas.width / rect.width;
		const scaleY = this.canvas.height / rect.height;
		const x = (e.clientX || e.touches[0].clientX) - rect.left;
		const y = (e.clientY || e.touches[0].clientY) - rect.top;

		return {
			x: x * scaleX,
			y: y * scaleY
		};
	}

	attachEventListeners() {
		this.canvas.addEventListener("mousedown", (e) => this.startDrawing(e));
		this.canvas.addEventListener("touchstart", (e) => this.startDrawing(e));
		this.canvas.addEventListener("mousemove", (e) => this.draw(this.getMousePos(e)));
		this.canvas.addEventListener("touchmove", (e) => this.draw(this.getMousePos(e)));
		this.canvas.addEventListener("mouseup", () => this.stopDrawing());
		this.canvas.addEventListener("touchend", () => this.stopDrawing());
	}

	clearCanvas() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
}
