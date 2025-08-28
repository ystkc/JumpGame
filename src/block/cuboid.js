import BaseBlock from './base';
import { BLOCKTYPE, COLOR } from '@utils/common';

import img_default_left from '@images/cube_default/left.png'
import img_default_right from '@images/cube_default/right.png'
import img_default_top from '@images/cube_default/top.png'

export default class CuboidBlock extends BaseBlock {
    constructor(x = 0, y = 0, z = 0, type, mat = null) { // mat是[left, right, top]
        super(BLOCKTYPE.CUBOID);
        this.name = "block";

        this.instance = null;

        let main_material;
        if (true) {
            const loader = new THREE.TextureLoader();

            let mat_left, mat_right, mat_top;
            if (mat) {
                mat_left = new THREE.MeshPhongMaterial({ map: loader.load(mat[0], (texture) => {
                    this.generateBoxMesh(texture, main_material);
                }), transparent: true });
                mat_right = new THREE.MeshPhongMaterial({ map: loader.load(mat[1]), transparent: true });
                mat_top = new THREE.MeshPhongMaterial({ map: loader.load(mat[2]), transparent: true });
            } else {
                mat_left = new THREE.MeshPhongMaterial({ map: loader.load(img_default_left, (texture) => {
                    this.generateBoxMesh(texture, main_material);
                }), transparent: true });
                mat_right = new THREE.MeshPhongMaterial({ map: loader.load(img_default_right), transparent: true });
                mat_top = new THREE.MeshPhongMaterial({ map: loader.load(img_default_top), transparent: true });
            }
            main_material = [mat_left, mat_left, mat_top, mat_top, mat_right, mat_right];
        } else {
            const newColor = ~~COLOR[~~(COLOR.length * Math.random())];
            main_material = new THREE.MeshPhongMaterial({ color: newColor });
        }
        this.instance = new THREE.Object3D(); // 虽然没初始化，但是也要同步示例一个对象，否则会报错

        this.instance.receiveShadow = true;
        this.instance.castShadow = true;
        this.instance.name = this.name;

        this.x = this.instance.position.x = x;
        this.y = this.instance.position.y = y;
        this.z = this.instance.position.z = z;

        if (type === 'popup') {
            this.popup()
        } else if (type === 'show') {
            this.instance.position.x = this.x
            this.instance.position.y = this.y
            this.instance.position.z = this.z
        }
    }
    generateBoxMesh(texture, main_material) {
        const aspect_left = texture.image.width / texture.image.height;
        this.size = this.height * aspect_left;
        const main_box_height = this.height;
        const main_geometry = new THREE.BoxGeometry(this.size, main_box_height, this.size);

        const bottom_mesh = new THREE.Mesh(main_geometry, main_material);

        bottom_mesh.position.y = 0;
        bottom_mesh.castShadow = true;
        bottom_mesh.receiveShadow = true;

        this.instance.add(bottom_mesh);
    }
}
