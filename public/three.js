import { common } from '@utils/common';
// import * as THREE from 'three/build/three.module.js';
import * as THREE from 'three';

window.THREE = common.THREE = THREE;

// 需要安装的
// 1.将nodeJS升级到最新的稳定版
// 2.把旧的那堆依赖(package.json和各种lock)和node_modules文件夹全部删掉
// 3.安装下列基础库：npm install three webpack webpack-dev-server clean-webpack-plugin core-js html-webpack-plugin
// 4.加载器：npm install @babel/plugin-proposal-class-properties @babel/preset-env @types/three babel-loader css-loader file-loader style-loader
// 5.拓展： npm install troika-three-text
