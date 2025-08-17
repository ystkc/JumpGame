import font from './font'

export default class Text {
	constructor() {
		// 转化字体为有限字符集 https://gero3.github.io/facetype.js/
		this.font = new THREE.Font(font);
		this.size = 5.0;
		this.height = 0.1;
		this.fillStyle = 0x666666;
	}

	init(options) {
		this.material = new THREE.MeshBasicMaterial({ color: this.fillStyle, transparent: true });
		if (options && options.opacity) this.material.opacity = options.opacity;
		this.options = options || {};
		const geometry = new THREE.TextGeometry('0', { 'font': this.font, 'size': this.size, 'height': this.height });
		this.instance = new THREE.Mesh(geometry, this.material);
		this.instance.name = 'scoreText';
	}

	updateScore(score) {
		this.instance = new THREE.Mesh(new THREE.TextGeometry(score, { 'font': this.font, 'size': this.size, 'height': this.height }), this.material);
	}
}