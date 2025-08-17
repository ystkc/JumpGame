import BaseBlock from './base';
import { BLOCKTYPE, COLOR } from '@utils/common';

import img_0_round from '@images/cylinder0/round.png';
import img_0_top from '@images/cylinder0/top.png';

import img_1_round from '@images/cylinder1/round.png';
import img_1_top from '@images/cylinder1/top.png';

import img_2_round from '@images/cylinder2/round.png';
import img_2_top from '@images/cylinder2/top.png';


const matFace = [
    {
        round: img_0_round,
        top: img_0_top
    },
    {
        round: img_1_round,
        top: img_1_top
    },
    {
        round: img_2_round,
        top: img_2_top
    }
]
export default class CylinderBlock extends BaseBlock {
    constructor(x = 0, y = 0, z = 0, type, matIndex = 0) {
        super(BLOCKTYPE.CYLINDER);
        this.name = "block";
        this.instance = null;

        let main_material;
        if (true) {
            const loader = new THREE.TextureLoader(); 
            const round_mat = new THREE.MeshPhongMaterial({ map: loader.load(matFace[matIndex].round, (texture) => {
                const main_box_height = this.height;
                const aspect_ratio = texture.image.width / texture.image.height;
                const round = this.height * aspect_ratio;
                this.size = round / Math.PI; // diameter
                const main_geometry = new THREE.CylinderGeometry(this.size / 2, this.size / 2, main_box_height, 100);

                const bottom_mesh = new THREE.Mesh(main_geometry, main_material);

                bottom_mesh.position.y = 0;

                bottom_mesh.castShadow = true;
                bottom_mesh.receiveShadow = true;

                this.instance.add(bottom_mesh);
            }), transparent: true });
            const top_mat = new THREE.MeshPhongMaterial({ map: loader.load(matFace[matIndex].top), transparent: true});
            main_material = [round_mat, top_mat, top_mat];
        } else {
            main_material = new THREE.MeshPhongMaterial({ color: ~~COLOR[~~(COLOR.length * Math.random())] });
        }

        this.instance = new THREE.Object3D();
        this.instance.receiveShadow = true;
        this.instance.castShadow = true;
        this.instance.name = this.name;
        this.instance.rotation.y = Math.PI / 4;
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
