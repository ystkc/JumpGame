import BaseBlock from './base';
import { BLOCKTYPE, COLOR } from '@utils/common';

import img_0_left from '@images/cube0/left.png'
import img_0_right from '@images/cube0/right.png'
import img_0_top from '@images/cube0/top.png'

import img_1_left from '@images/cube1/left.png'
import img_1_right from '@images/cube1/right.png'
import img_1_top from '@images/cube1/top.png'

import img_2_left from '@images/cube2/left.png'
import img_2_right from '@images/cube2/right.png'
import img_2_top from '@images/cube2/top.png'

const matFace = [
    {
        left: img_0_left,
        right: img_0_right,
        top: img_0_top
    },
    {
        left: img_1_left,
        right: img_1_right,
        top: img_1_top
    },
    {
        left: img_2_left,
        right: img_2_right,
        top: img_2_top
    }
]

export default class CuboidBlock extends BaseBlock {
    constructor(x = 0, y = 0, z = 0, type, matIndex = 0) {
        super(BLOCKTYPE.CUBOID);
        this.name = "block";

        this.instance = null;

        let main_material;
        if (true) {
            const loader = new THREE.TextureLoader();

            const mat_left = new THREE.MeshPhongMaterial({ map: loader.load(matFace[matIndex].left, (texture) => {
                const aspect_left = texture.image.width / texture.image.height;
                this.size = this.height * aspect_left;
                const main_box_height = this.height;
                const main_geometry = new THREE.BoxGeometry(this.size, main_box_height, this.size);

                const bottom_mesh = new THREE.Mesh(main_geometry, main_material);

                bottom_mesh.position.y = 0;
                bottom_mesh.castShadow = true;
                bottom_mesh.receiveShadow = true;

                this.instance.add(bottom_mesh);
            }), transparent: true });

            const mat_right = new THREE.MeshPhongMaterial({ map: loader.load(matFace[matIndex].right), transparent: true });
            const mat_top = new THREE.MeshPhongMaterial({ map: loader.load(matFace[matIndex].top), transparent: true });
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
}
