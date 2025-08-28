import img_box from '@images/box.png'

const BLOCK_SIZE = 16;
export default class PropsBox {
  constructor(x, y, z) {
    this.name = 'PropsBox';
    this.instance = new THREE.Object3D();
    const loader = new THREE.TextureLoader();
    const mainGeom = new THREE.BoxGeometry(BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
    const mainMat = new THREE.MeshPhongMaterial({ map: loader.load(img_box , (texture) => {
      this.instance.add(new THREE.Mesh(mainGeom, mainMat));
      this.instance.position.set(x, y, z);
      this.instance.scale.set(0.25, 0.25, 0.25);
      this.instance.rotation.set(0, 0, 0);
      this.instance.castShadow = true;
      this.instance.receiveShadow = true;
    }), transparent: true});
    this.phase = 0; // 在y轴上下移动（sine）
    this.initialY = y;
  }
  update() {
    // 缓慢绕着y轴旋转
    this.instance.rotation.y += 0.03;
    this.instance.position.y = Math.sin(this.phase) * 2 + this.initialY;
    this.phase += 0.06;
  }
}
