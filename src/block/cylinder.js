import BaseBlock from './base';
import { BLOCKTYPE, COLOR } from '@utils/common';

import img_default_round from '@images/cylinder_default/round.png';
import img_default_top from '@images/cylinder_default/top.png';



export default class CylinderBlock extends BaseBlock {
    constructor(x = 0, y = 0, z = 0, type, mat = null) { // mat = [round, top]
        super(BLOCKTYPE.CYLINDER);
        this.name = "block";
        this.instance = null;

        let main_material;
        if (true) {
            const loader = new THREE.TextureLoader(); 
            let round_mat, top_mat;
            if (mat) {
                round_mat = new THREE.MeshPhongMaterial({ map: loader.load(mat[0], (texture) => {
                    this.generateCylinderMesh(texture, main_material);
                }), transparent: true });
                top_mat = new THREE.MeshPhongMaterial({ map: loader.load(mat[1]), transparent: true});
            } else {
                round_mat = new THREE.MeshPhongMaterial({ map: loader.load(img_default_round, (texture) => {
                    this.generateCylinderMesh(texture, main_material);
                }), transparent: true });
                top_mat = new THREE.MeshPhongMaterial({ map: loader.load(img_default_top), transparent: true });
            }
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
    generateCylinderMesh(texture, main_material) {
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
    }
}
