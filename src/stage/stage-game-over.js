import scene from '@scene';
import { common } from '@utils/common';
import img_replay from "@images/replay.png";

export default class StageGameOver {
    constructor(callback) {
        this.callback = callback;
        const { canvas } = common;
        this.canvas = canvas;
        this.score = 0;
    }
    init() {
        console.log(`GameOver init`);
        this.render();
    }
    render() {
        const { width, height, aspect } = common;
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        this.context = canvas.getContext('2d');
        this.context.fillStyle = 'rgba(0,0,0,.7)';
        this.context.fillRect((width - 200) / 2, (height - 200) / 2, 200, 200);
        this.context.fillStyle = '#eee';
        this.context.font = '22px Georgia';
        this.context.fillText('Game Over', (width - 200) / 2 + 45, (height - 200) / 2 + 55);
        this.replay_btn = new Image();
        this.replay_btn.onload = () => {
            this.context.drawImage(this.replay_btn, width / 2 - 60, (height - 200) / 2 + 125, 120, 47);
        }
        this.replay_btn.src = img_replay;


        this.texture = new THREE.Texture(canvas);
        this.material = new THREE.MeshBasicMaterial({
            map: this.texture,
            transparent: true,
            // side: THREE.DoubleSide
        });

        this.geometry = new THREE.PlaneGeometry(60, 60 * aspect);
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position.z = 20;
        this.mesh.visible = false;

        this.texture.needsUpdate = true;
        scene.camera.instance.add(this.mesh);
    }

    show() {
        console.log(`GameOver show`);
        this.mesh.visible = true;
        this.score = this.callback.getScore();
        this.addTouchEvent();
    }

    hide() {
        console.log(`GameOver hide`);
        this.mesh.visible = false;
        this.removeTouchEvent();
        console.log('------------')
    }

    onTouchEnd(e) {
        if (!this.mesh.visible) return;
        this.callback.restartGame();
    }

    addTouchEvent = e => {
        this.canvas.addEventListener('touchend', this.onTouchEnd.bind(this), true)
        this.canvas.addEventListener('mouseup', this.onTouchEnd.bind(this), true)
    }

    removeTouchEvent = e => {
        this.canvas.removeEventListener('touchend', this.onTouchEnd.bind(this), true)
        this.canvas.removeEventListener('mouseup', this.onTouchEnd.bind(this), true)
    }

}