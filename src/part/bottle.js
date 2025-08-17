import { BLOCKCONFIG, STATUS, BOTTLECONFIG } from "@utils/common";
// import img_head from '@images/head.png';
// import img_bottom from '@images/bottom.png';
// import img_top from '@images/top.png';
import sprite_stand from '@images/stand.png';
import sprite_stoop from '@images/stoop.png';
import sprite_up from '@images/up.png';
import sprite_down from '@images/down.png';
import sprite_fall from '@images/fall.png';
import { customAnimation } from "@utils/animation"
import { common } from "@utils/common";

class Bottle {
    constructor() {
        const { x, y, z } = BOTTLECONFIG;
        this.x = x;
        this.y = y;
        this.z = z;
        this.instance = null;
        this.name = "bottle";
        this.radius = 1.78;
        this.depth = 10.24;
        this.width = this.radius * 2;
        this.blockHeight = BLOCKCONFIG.height;
        this.gravity = common.gravity;
        this.flyingTime = 0;
        this.direction = 1;
        this.axis = null;
        this.status = '';
        this.reset();
        const loader = new THREE.TextureLoader();
        this.standMat = loader.load(sprite_stand);
        this.standMatRev = this.standMat.clone();
        this.standMatRev.repeat.x = -1;

        this.stoopMat = loader.load(sprite_stoop);
        this.stoopMatRev = this.stoopMat.clone();
        this.stoopMatRev.repeat.x = -1;

        this.upMat = loader.load(sprite_up);
        this.upMatRev = this.upMat.clone();
        this.upMatRev.repeat.x = -1;

        this.downMat = loader.load(sprite_down);
        this.downMatRev = this.downMat.clone();
        this.downMatRev.repeat.x = -1;

        this.fallMat = loader.load(sprite_fall);
        this.fallMatRev = this.fallMat.clone();
        this.fallMatRev.repeat.x = -1;
    }
    init() {

        this.instance = new THREE.Object3D();
        this.hero = new THREE.Object3D();
        this.instance.name = this.name;
        this.instance.position.set(this.x, this.y + 30, this.z);

        this.instance.castShadow = true;
        this.instance.receiveShadow = true;

        // 创建平面并加载纹理
        const geometry = new THREE.PlaneGeometry(10, 10); // 调整尺寸
        const texture = new THREE.TextureLoader().load(sprite_stand);
        const material = new THREE.MeshStandardMaterial({ 
        map: texture,
        transparent: true, // 启用透明度（如果纹理有透明通道）
        side: THREE.DoubleSide
        });
        this.body = new THREE.Mesh(geometry, material);

        // 设置阴影（Mesh 支持阴影）
        this.body.castShadow = true; 
        this.body.receiveShadow = true;

        this.body.position.y = 3.5;
        this.body.rotation.y = -Math.PI / 4;


        this.hero.add(this.body);

        this.instance.add(this.hero);
    }

    createHead() {
        const geometry = new THREE.IcosahedronGeometry(this.radius, 3);
        const texture = new THREE.TextureLoader().load(img_head);
        const material = new THREE.MeshPhongMaterial({ map: texture, color: 0xffffff });
        return new THREE.Mesh(geometry, material);
    }

    createBottom() {
        const geometry = new THREE.CylinderGeometry(this.radius * 0.78, this.radius * 1.17, this.radius * 2.1, 20);
        const texture = new THREE.TextureLoader().load(img_bottom);
        const material = new THREE.MeshPhongMaterial({ map: texture, color: 0xffffff });
        return new THREE.Mesh(geometry, material);
    }

    createMiddle() {
        const geometry = new THREE.CylinderGeometry(this.radius * 0.955, this.radius * 0.78, this.radius * 1.41, 20);
        const texture = new THREE.TextureLoader().load(img_bottom);
        const material = new THREE.MeshPhongMaterial({ map: texture, color: 0xffffff });
        return new THREE.Mesh(geometry, material);
    }

    createTop() {
        const geometry = new THREE.SphereGeometry(this.radius, 32, 32, 0, 6.4, 0, 1.3);
        const texture = new THREE.TextureLoader().load(img_top);
        const material = new THREE.MeshPhongMaterial({ map: texture, color: 0xffffff });
        return new THREE.Mesh(geometry, material);
    }

    show() {
        return new Promise((resolve, reject) => {
            customAnimation.to(this.instance.position, 1, {
                x: BOTTLECONFIG.x,
                y: BOTTLECONFIG.y + this.blockHeight / 2,
                z: BOTTLECONFIG.z,
                ease: 'Bounce.easeOut',
                onComplete: () => resolve()
            });
        })
    }
    setDirection(direction, axis) {
        this.direction = direction;
        this.axis = axis;
    }
    rotate() {
        const scale = 1.35;
        this.hero.rotation.z = this.hero.rotation.x = 0;
        if (this.direction == 0) { // x
            // customAnimation.to(this.hero.rotation, 0.14, { z: this.hero.rotation.z - Math.PI })
            // customAnimation.to(this.hero.rotation, 0.18, { z: this.hero.rotation.z - 2 * Math.PI, delay: 0.14 })
            // customAnimation.to(this.head.position, 0.1, { y: this.head.position.y + 0.9 * scale, x: this.head.position.x + 0.45 * scale })
            // customAnimation.to(this.head.position, 0.1, { y: this.head.position.y - 0.9 * scale, x: this.head.position.x - 0.45 * scale, delay: 0.1 })
            // customAnimation.to(this.head.position, 0.15, { y: 10.24, x: 0, delay: 0.25 })
            // customAnimation.to(this.body.scale, 0.1, { y: Math.max(scale, 1), x: Math.max(Math.min(1 / scale, 1), 0.7), z: Math.max(Math.min(1 / scale, 1), 0.7) })
            // customAnimation.to(this.body.scale, 0.1, { y: Math.min(0.9 / scale, 0.7), x: Math.max(scale, 1.2), z: Math.max(scale, 1.2), delay: 0.1 })
            // customAnimation.to(this.body.scale, 0.3, { y: 1, x: 1, z: 1, delay: 0.2 })
        } else if (this.direction == 1) { // z
            // customAnimation.to(this.hero.rotation, 0.14, { x: this.hero.rotation.x - Math.PI })
            // customAnimation.to(this.hero.rotation, 0.18, { x: this.hero.rotation.x - 2 * Math.PI, delay: 0.14 })
            // customAnimation.to(this.head.position, 0.1, { y: this.head.position.y + 0.9 * scale, z: this.head.position.z - 0.45 * scale })
            // customAnimation.to(this.head.position, 0.1, { z: this.head.position.z + 0.45 * scale, y: this.head.position.y - 0.9 * scale, delay: 0.1 })
            // customAnimation.to(this.head.position, 0.15, { y: 10.24, z: 0, delay: 0.25 })
            // customAnimation.to(this.body.scale, 0.05, { y: Math.max(scale, 1), x: Math.max(Math.min(1 / scale, 1), 0.7), z: Math.max(Math.min(1 / scale, 1), 0.7) })
            // customAnimation.to(this.body.scale, 0.05, { y: Math.min(0.9 / scale, 0.7), x: Math.max(scale, 1.2), z: Math.max(scale, 1.2), delay: 0.1 })
            // customAnimation.to(this.body.scale, 0.2, { y: 1, x: 1, z: 1, delay: 0.2 })
        }
    }
    reset() {
        this.stop();
        this.instance && this.instance.position.set(this.x, this.y + 30, this.z);
        this.instance && this.instance.rotation.set(0, 0, 0);
    }
    shrink() {
        this.status = STATUS.SKRINK;
        // 切换到蹲下的材质
        if (this.direction) this.body.scale.x = -1;
            this.body.material.map = this.stoopMat;
        // else
            // this.body.material.map = this.stoopMatRev;
    }
    jump() {
        this.status = STATUS.JUMPUP;
        if (this.direction) this.body.scale.x = -1; else this.body.scale.x = 1;
            this.body.material.map = this.upMat;
        // else
            // this.body.material.map = this.upMatRev;
    }
    stop() {
        this.status = STATUS.STOP;
        this.velocity = {
            vx: 0,
            vy: 0
        }
        this.flyingTime = 0;
        this.scale = 1;
        if (this.instance) {
            this.body.scale.x = this.scale;
            this.body.scale.y = this.scale;
            this.body.scale.z = this.scale;
            // this.head.position.y = 10.24;
            this.hero.position.y = 0;
        }
        if (!this.body) return;
        if (this.direction) this.body.scale.x = -1; else this.body.scale.x = 1;
            this.body.material.map = this.standMat;
        // else
            // this.body.material.map = this.standMatRev;
    }

    _shrink() {
        const DELTA_SCALE = 0.005;
        const HEAD_DELTA = 0.03;
        const bottleDeltaY = HEAD_DELTA / 2;
        const deltaY = this.blockHeight * DELTA_SCALE / 2;
        this.hero.position.y -= (bottleDeltaY + deltaY * 2);
        return;
        const HORIZON_DELTA_SCALE = 0.002;
        const MIN_SCALE = 0.55;
        this.scale -= DELTA_SCALE;
        this.scale = Math.max(MIN_SCALE, this.scale);
        if (this.scale <= MIN_SCALE) {
            return;
        }
        this.body.scale.y = this.scale;
        this.body.scale.x += HORIZON_DELTA_SCALE;
        this.body.scale.z += HORIZON_DELTA_SCALE;
        // this.head.position.y -= HEAD_DELTA;
    }

    _jumpStateSwitch() {
        if (this.status === STATUS.JUMPUP && this.flyingTime >= 0.15) { // 计算出来的，0.15是最高点
            this.status = STATUS.JUMPDOWN;
            // 切换到下落的材质
            if (this.direction) this.body.scale.x = -1; else this.body.scale.x = 1;
                this.body.material.map = this.downMat;
            // else
                // this.body.material.map = this.downMatRev;
        }
    }

    _jump(tickTime) {
        const t = tickTime / 1000;
        this._jumpStateSwitch();
        this.flyingTime = this.flyingTime + t;
        const translateH = this.velocity.vx * t;
        const translateY = this.velocity.vy * t - 0.5 * this.gravity * t * t - this.gravity * this.flyingTime * t;
        this.instance.translateY(translateY);
        this.instance.translateOnAxis(this.axis, translateH);
    }

    forerake() {
        this.fall();
        return;
        this.status = STATUS.FORERAKE;
        this.instance.position.y = BLOCKCONFIG.height/2;
        setTimeout(() => {
            if (this.direction === 0) {
                customAnimation.to(this.instance.rotation, .5, { z: -Math.PI / 2 });
            }
            if (this.direction === 1) {
                customAnimation.to(this.instance.rotation, .5, { x: -Math.PI / 2 });
            }
            setTimeout(() => {
                customAnimation.to(this.instance.position, 0.2, { y: -BLOCKCONFIG.height / 2 + 2 });
            }, 350);
        }, 200);
    }

    hypsokinesis() {
        this.fall();
        return;
        this.status = STATUS.HYPSOKINESIS;
        this.instance.position.y = BLOCKCONFIG.height/2;
        setTimeout(() => {
            if (this.direction === 0) {
                customAnimation.to(this.instance.rotation, .5, { z: Math.PI / 2 });
            }
            if (this.direction === 1) {
                customAnimation.to(this.instance.rotation, .5, { x: Math.PI / 2 });
            }
            setTimeout(() => {
                customAnimation.to(this.instance.position, 0.2, { y: -BLOCKCONFIG.height / 2 + 2 });
            }, 150);
        }, 200);
    }

    fall() {
        this.status = STATUS.FALL;
        // 切换到下落的材质
        if (this.direction) this.body.scale.x = -1; else this.body.scale.x = 1;
            this.body.material.map = this.fallMat;
        // else
            // this.body.material.map = this.fallMatRev;
        console.log('fall')
        customAnimation.to(this.instance.position, 0.2, { y: -BLOCKCONFIG.height / 2 });
    }

    update() {
        if (this.status === STATUS.SKRINK) {
            this._shrink()
        } else if (this.status === STATUS.JUMPUP || this.status === STATUS.JUMPDOWN) {
            const tickTime = Date.now() - this.lastFrameTime;
            this._jump(tickTime);
        }
        this.lastFrameTime = Date.now();
    }
}

export default new Bottle();