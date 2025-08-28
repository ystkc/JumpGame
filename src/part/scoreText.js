import font from './font'

export class GeomText {
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


import { Text } from 'troika-three-text'

export default class SDFText {
	constructor() {
		this.instance = new Text();
		
		this.instance.color = 0x000000
		this.instance.anchorX = 'center' // 对齐方式
		this.instance.anchorY = 'top'
	}

	updateText(text, size=5) {
		// 创建文本实例
		const myText = this.instance;

		// 配置文本属性
		myText.text = text
		myText.fontSize = size // 即使是很小的字号，也能非常清晰！

		// 重要：在修改文本或尺寸后，必须调用 sync 更新
		// myText.sync(() => {
		// 	console.log('文本渲染完成')
		// })
		return myText
	}
}