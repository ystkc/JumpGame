import scene from '@scene';
import CuboidBlock from '@block/cuboid';
import CylinderBlock from '@block/cylinder';
import ground from '@part/ground';
import bottle from '@part/bottle';
import { common, BLOCKCONFIG, BLOCKTYPE, TOTAL_FLYING_TIME } from '@utils/common';
import utils from '@utils'
import SDFText from '@part/scoreText'
import audiomanager from '../audiomanager';
import { stopAllAnimation } from '@utils/animation';

import PropsBox from '../block/pbox';
import icon_fan from '@images/icon/fan.png';
import icon_tiger from '@images/icon/tiger.png';
import icon_flag from '@images/icon/flag.png';
import icon_rake from '@images/icon/rake.png';
import icon_rabbit from '@images/icon/rabbit.png';
import icon_flower from '@images/icon/flower.png';
import icon_unk from '@images/icon/unk.png';
import icon_bonus from '@images/icon/bonus.png';

import MsgBox from '../part/msgbox';
import PopupBox from '@part/popupBox';

import img_1_left from '@images/cube1/left.png'
import img_1_right from '@images/cube1/right.png'
import img_1_top from '@images/cube1/top.png'

import img_2_left from '@images/cube2/left.png'
import img_2_right from '@images/cube2/right.png'
import img_2_top from '@images/cube2/top.png'

import img_1_round from '@images/cylinder1/round.png';
import img_1_circ_top from '@images/cylinder1/top.png';

import img_2_round from '@images/cylinder2/round.png';
import img_2_circ_top from '@images/cylinder2/top.png';


import sprite_stand_1 from '@images/sprite_1/stand.png';
import sprite_stoop_1 from '@images/sprite_1/stoop.png';
import sprite_up_1 from '@images/sprite_1/up.png';
import sprite_down_1 from '@images/sprite_1/down.png';
import sprite_fall_1 from '@images/sprite_1/fall.png';

import sprite_stand_2 from '@images/sprite_2/stand.png';
import sprite_stoop_2 from '@images/sprite_2/stoop.png';
import sprite_up_2 from '@images/sprite_2/up.png';
import sprite_down_2 from '@images/sprite_2/down.png';
import sprite_fall_2 from '@images/sprite_2/fall.png';


const HIT_NEXT_BLOCK_NORMAL = 1;
const HIT_BLOCK_CURRENT = 2;
const GAME_OVER_NEXT_BLOCK_FRONT = 3;
const GAME_OVER_CURRENT_BLOCK_BACK = 4;
const GAME_OVER_NEXT_BLOCK_BACK = 5;
const GAME_OVER_BOTH = 6;
const HIT_NEXT_BLOCK_CENTER = 7;

const LEVEL_SCORE_COUNT = 5; // 每过5个方块作为一个关卡
const MAX_LEVEL = 3; // 最大关卡

const DEBUG = false;

const P_FUNC = {
    DOUBLE_SCORE: 0, // 在接下来TIME秒内，得分翻倍
    AUTO_JUMP: 1, // 自动跳跃BLOCK个格子
    REBIRTH: 2, // 获得1次原地重生机会
    SCORE_BONUS: 3, // 立即获得SCORE分
    SCORE_BONUS_DELAY: 4, // 延迟DELAY秒后获得SCORE分
    SCORE_BONUS_REPEAT: 5, // PERIOD秒内每秒获得SCORE分
    SPECIAL_EFFECT: 6, // 触发第ID个特效
    BONUS_AND_REBIRTH: 7, // 重生机会和分数加成
}

const P_FUNC_TYPE = { // 特殊物品的展示形式
    PROPS: 1, // 道具（悬浮问号盒）
    BLOCK: 2, // 方块外形和特殊效果（方块、圆柱）
    SKILL: 3, // 技能
}

const P_LIST = {
    1: {
        FTYPE: P_FUNC_TYPE.PROPS,
        FUNC: P_FUNC.DOUBLE_SCORE,
        TIME: 60,
        ILLUS: "“轻摇折扇，心定如山。”\n得此折扇，60s内得分翻倍。",
        ICON: icon_fan,
    },
    2: {
        FTYPE: P_FUNC_TYPE.PROPS,
        FUNC: P_FUNC.AUTO_JUMP,
        BLOCK: 3,
        ILLUS: "“虎符在握，千里一令，\n步步为营。”\n得此青铜虎符可连跳三格，\n每格得分翻倍。",
        ICON: icon_tiger,
    },
    5: {
        FTYPE: P_FUNC_TYPE.PROPS,
        FUNC: P_FUNC.REBIRTH,
        ILLUS: "“旗展风猎，军心所向，\n所至必达。”\n获1张续关灵符，\n可在原地重生1次。",
        ICON: icon_flag,
    },
    6: {
        FTYPE: P_FUNC_TYPE.PROPS,
        FUNC: P_FUNC.SCORE_BONUS,
        SCORE: 30,
        ILLUS: "“金耙一举，喜动四方，\n福满乾坤。”\n得此钉耙者，额外\n加30分“喜庆加成”。",
        ICON: icon_rake,
    },
    7: {
        FTYPE: P_FUNC_TYPE.PROPS,
        FUNC: P_FUNC.SCORE_BONUS_REPEAT,
        SCORE: 15,
        PERIOD: 3,
        ILLUS: "“花冠轻覆，步生莲影。”得此芙蓉花冠，停留3s可加45分。",
        ICON: icon_flower,
    },
    8: {
        FTYPE: P_FUNC_TYPE.PROPS,
        FUNC: P_FUNC.BONUS_AND_REBIRTH,
        SCORE: 100,
        ILLUS: "“玉兔引路，直上九霄。”\n得此玉兔者，获得1张续关灵符，可原地重生1次，并立即获得100分。",
        ICON: icon_rabbit,
    },
    9: {
        FTYPE: P_FUNC_TYPE.BLOCK,
        FUNC: P_FUNC.SCORE_BONUS_DELAY,
        SCORE: 3,
        DELAY: 1,
        TITLE: "“冼夫人”木偶装饰", // 暂定：有title的就是需要点击继续，没有title就是消息弹出
        ILLUS: "明万历，闽南布袋戏传入，融合本地杖头木偶形成高州木偶戏雏形。停留本格1秒，加3分",
        ICON: icon_unk,
        BTYPE: BLOCKTYPE.CUBOID,
        MAT: [img_1_left, img_1_right, img_1_top],
    },
    10: {
        FTYPE: P_FUNC_TYPE.BLOCK,
        FUNC: P_FUNC.REBIRTH,
        TITLE: "非遗徽章木牌",
        ILLUS: "2006年，高州木偶戏列入首批国家级非物质文化遗产名录。获一张续关灵符，可原地重生一次",
        ICON: icon_unk,
        BTYPE: BLOCKTYPE.CYLINDER,
        MAT: [img_1_round, img_1_circ_top],
    },
    11: {
        FTYPE: P_FUNC_TYPE.BLOCK,
        FUNC: P_FUNC.SCORE_BONUS_DELAY,
        SCORE: 4,
        DELAY: 1,
        TITLE: "鎏金称号牌坊",
        ILLUS: "2003年高州获“中国民间艺术（木偶）之乡”称号。停留1秒，加4分",
        ICON: icon_unk,
        BTYPE: BLOCKTYPE.CUBOID,
        MAT: [img_2_left, img_2_right, img_2_top],
    },
    12: {
        FTYPE: P_FUNC_TYPE.BLOCK,
        FUNC: P_FUNC.SPECIAL_EFFECT,
        SPRITE: {
            STAND: sprite_stand_1,
            STOOP: sprite_stoop_1,
            UP: sprite_up_1,
            DOWN: sprite_down_1,
            FALL: sprite_fall_1,
        },
        TITLE: "喷火木偶动态展示",
        ILLUS: "木偶机关设计使木偶可眨眼、张口、执物，完成执扇、斟酒、舞剑、喷火等复杂动作。 ",
        ICON: icon_unk,
        BTYPE: BLOCKTYPE.CYLINDER,
        MAT: [img_2_round, img_2_circ_top],
    },
    14: {
        FTYPE: P_FUNC_TYPE.BLOCK,
        FUNC: P_FUNC.SPECIAL_EFFECT,
        SPRITE: {
            STAND: sprite_stand_2,
            STOOP: sprite_stoop_2,
            UP: sprite_up_2,
            DOWN: sprite_down_2,
            FALL: sprite_fall_2,
        },
        TITLE: "舞剑木偶动态展示",
        ILLUS: "木偶机关设计使木偶可眨眼、张口、执物，完成执扇、斟酒、舞剑、喷火等复杂动作。 ",
        ICON: icon_unk,
        BTYPE: BLOCKTYPE.CYLINDER,
        MAT: [img_2_round, img_2_circ_top],
    }
}

export default class StageGameMain {
    constructor(callback) {
        this.callback = callback;
    }
    deduplicate(str) {
        return str.replace(/(.)(?=.*\1)/g, '');
    }
    extractAndDeduplicate(obj=P_LIST) {
        let combinedString = '';
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                const item = obj[key];
                
                if (item.ILLUS) {
                    combinedString += item.ILLUS;
                }
                
                if (item.TITLE) {
                    combinedString += item.TITLE;
                }
            }
        }
        combinedString += "关卡0123456789得分Game Over再玩一局点击继续...获得隐藏奖励：分！获得隐藏奖励：分x！(上限次)恭喜你完成了第关！已原地复活！剩余次原地复活机会";
        combinedString = combinedString.replaceAll("\n", "");
        const uniqueChars = [...this.deduplicate(combinedString)].join('');
        
        return uniqueChars;
    }
    init() {
        const textBuffer = new SDFText();
        const targetFont = this.extractAndDeduplicate();
        let progress = 0;
        const len = 15;
        const prepareText = () => {
            textBuffer.updateText(targetFont.slice(progress, progress + len)).sync(() => {
                if (progress >= targetFont.length) {
                    progressScreen.animateOut();
                    audiomanager
                        .init()
                        .then(() => {
                            this.addBottle();
                        });
                } else {
                    progress += len;
                    progressScreen.updateText(`${progress}/${targetFont.length}`).sync(prepareText);
                }
            });
        }
        const progressScreen = new PopupBox('剧情努力加载中', '0/'+targetFont.length, icon_bonus, prepareText);

        console.log(`GameMain init`);
        const { canvas } = common;
        this.state = 'show';
        this.canvas = canvas;
        this.scene = scene;
        this.ground = ground;
        this.bottle = bottle;
        this.gravity = common.gravity;
        this.propsBox = null;

        this.score = 0;
        this.level = 1;
        this.block = 0;
        this.end = false;
        
        this.props = {};
        this.rebirth = 0;
        this.autoJumpLeft = 0;
        this.nextDist = 0;
        this.doubleScoreEnd = 0;

        this.popupAwait = false;
        this.popupBox = null;

        this.scoreText = new SDFText();
        this.levelText = new SDFText();
        
        this.scene.init();
        this.ground.init();
        this.bottle.init();

        this.addGround();
        this.addInitBlock();

        this.addScore();
        this.render();
    }
    removeLastPropsBox() { // 移除上一个PropsBox，也就是复活不会获得道具
        if (this.propsBox)
            this.scene.instance.remove(this.propsBox.instance);
    }
    restart() {
        console.log('restart Game');
        this.state = 'show';

        this.score = 0;
        this.level = 1;
        this.block = 0;
        this.end = false;

        this.props = {};
        this.rebirth = 0;
        this.autoJumpLeft = 0;
        this.nextDist = 0;
        this.doubleScoreEnd = 0;
        this.removeLastPropsBox();
        this.propsBox = null;

        this.dismissPopupBox();
        
        this.deleteObjectsFromScene();
        this.scene.reset();
        this.bottle.reset();
        this.ground.reset();

        this.updateScore(0);
        this.addInitBlock();
        this.addGround();
        this.addBottle();
    }
    addInitBlock() {
        const scene = this.scene.instance;
        this.currentBlock = new CuboidBlock(-15, 0, 0);
        this.nextBlock = new CylinderBlock(23, 0, 0);

        scene.add(this.currentBlock.instance);
        scene.add(this.nextBlock.instance);
        if (1 in P_LIST) {
            this.propsBox = new PropsBox(23, 10, 0);
            scene.add(this.propsBox.instance);
        }

        const initDirection = 0;
        this.targetPosition = this.nextBlock.instance.position;
        this.setDirection(initDirection);
    }
    addScore() {
        this.scoreText.updateText(`0`);
        this.scene.addScore(this.scoreText.instance);
        this.levelText.updateText(`关卡1`);
        this.scene.addLevel(this.levelText.instance);
    }
    updateScore(score) {
        this.scoreText.updateText(`${score}`);
        this.scene.updateScore(this.scoreText.instance);
    }
    updateLevel(level) {
        this.levelText.updateText(`关卡${this.level}`);
        this.scene.updateLevel(this.levelText.instance);
    }
    addGround() {
        const scene = this.scene.instance;
        scene.add(this.ground.instance);
    }
    addBottle(rebirth=false) {
        const scene = this.scene.instance;
        audiomanager.startPlay();
        if(!rebirth) {
            scene.add(this.bottle.instance);
            this.bottle.show().then(() => {
                this.addTouchEvent();
                this.state = 'stop';
                console.log('show end');
            });
        } else {
            this.createPopupBox("已原地复活！", `剩余${this.rebirth}次原地复活机会`, icon_bonus);
            this.bottle.show(this.targetPosition.x, this.targetPosition.z).then(() => {
                this.state = 'stop';
                console.log('rebirth show end');
                this.removeLastPropsBox();
                this.updateNextBlock();
            });
        }
    }
    addTouchEvent() {
        this.canvas.addEventListener("touchstart", this.onTouchStart, false);
        this.canvas.addEventListener("touchend", this.onTouchEnd, false);
        this.canvas.addEventListener("mousedown", this.onTouchStart, false);
        this.canvas.addEventListener("mouseup", this.onTouchEnd, false);
    }
    removeTouchEvent() {
        this.canvas.removeEventListener("touchstart", this.onTouchStart, false);
        this.canvas.removeEventListener("touchend", this.onTouchEnd, false);
        this.canvas.removeEventListener("mousedown", this.onTouchStart, false);
        this.canvas.removeEventListener("mouseup", this.onTouchEnd, false);
    }
    onTouchStart = e => {
        console.log('touch start');
        if (this.state !== 'stop' || this.popupAwait) return; // 正在跳跃或弹窗，不响应
        this.touchStartTime = Date.now();
        audiomanager.shrinkPlay();
        this.bottle.shrink();
        this.currentBlock.shrink();
    }
    onTouchEnd = e => {
        console.log('touch end');
        if (this.state !== 'stop') return;
        if (this.popupAwait) {
            this.dismissPopupBox();
            return; // 弹窗正在展示，关闭它
        }
        this.touchEndTime = Date.now();
        if (this.touchStartTime === 0 || isNaN(this.touchStartTime)) return;
        audiomanager.shrinkStop();
        const duration = this.touchEndTime - this.touchStartTime;
        this.touchStartTime = 0;
        if (!this.end) {
            this.bottle.velocity.vx = Math.min(duration / 6, 120);
            this.bottle.velocity.vx = +this.bottle.velocity.vx.toFixed(2);
        }
        this.bottle.velocity.vy = Math.min(150 + duration / 30, 300);
        this.bottle.velocity.vy = +this.bottle.velocity.vy.toFixed(2);
        this.state = "jump";
        this.hit = this.getHitStatus(this.bottle, this.currentBlock, this.nextBlock, BLOCKCONFIG.height / 2 - (1 - this.currentBlock.instance.scale.y) * BLOCKCONFIG.height)
        this.checkingHit = true
        this.currentBlock.rebound();
        this.bottle.rotate();
        this.bottle.jump();
    }

    setDirection(direction) {
        const currentPosition = {
            x: this.bottle.instance.position.x,
            z: this.bottle.instance.position.z
        }
        this.axis = new THREE.Vector3(this.targetPosition.x - currentPosition.x, 0, this.targetPosition.z - currentPosition.z);
        this.axis.normalize();
        this.bottle.setDirection(direction, this.axis);
    }


    render() {
        if (this.currentBlock) {
            this.currentBlock.update()
        }
        if (this.propsBox) {
            this.propsBox.update();
        }
        if (this.visible) {
            this.scene.render();
        }
        this.checkBottleHit();
        if (this.bottle) {
            this.bottle.update();
        }

        requestAnimationFrame(this.render.bind(this))
    }

    show() {
        console.log(`GameMain show`);
        this.visible = true;
    }

    hide() {
        console.log(`GameNain hide`);
        this.visible = false;
    }

    deleteObjectsFromScene() {
        let obj = this.scene.instance.getObjectByName('block')
        while (obj) {
            this.scene.instance.remove(obj)
            if (obj.geometry) {
                obj.geometry.dispose()
            }
            if (obj.material) {
                obj.material.dispose()
            }
            obj = this.scene.instance.getObjectByName('block');
        }
        this.scene.instance.remove(this.bottle.instance)
        this.scene.instance.remove(this.ground.instance)
    }

    endNotify() {
        console.log('Well done!');
        if (confirm('Well done! 再来一局？')) {
            this.restart();
        } else {
            this.currentBlock = this.nextBlock; // 可以原地蹦迪
        }
    }

    obtainEffect(score) {
        const data = P_LIST[score];
        if (!data) return;
        const currentBlockCount = this.block;
        if (data.FTYPE === P_FUNC_TYPE.PROPS) {
            new MsgBox(data.ILLUS, data.ICON);
        } else {
            this.createPopupBox(data.TITLE, data.ILLUS, data.ICON);
        }
        if (data) {
            switch (data.FUNC) {
                case P_FUNC.DOUBLE_SCORE:
                    this.doubleScoreEnd = Date.now() + data.TIME * 1000;
                    if (DEBUG) alert(`获得效果：${data.TIME}秒内的分数翻倍！`);
                    break;
                case P_FUNC.AUTO_JUMP:
                    this.autoJumpLeft = data.BLOCK;
                    if (DEBUG) alert(`获得效果：自动跳跃${data.BLOCK}格！`);
                    break;
                case P_FUNC.REBIRTH:
                    this.rebirth += 1; // 获得1次原地重生机会
                    if (DEBUG) alert(`获得道具：原地复活1次！`);
                    break;
                case P_FUNC.SCORE_BONUS:
                    this.score += data.SCORE;
                    if (DEBUG) alert(`获得奖励：立即+${data.SCORE}分！`);
                    this.updateScore(this.score);
                    break;
                case P_FUNC.SCORE_BONUS_DELAY:
                    setTimeout(() => {
                        // 判断是否还在原地
                        if (this.block !== currentBlockCount || this.state !== 'stop') {
                            return;
                        }
                        if (DEBUG) alert(`获得隐藏奖励：${data.SCORE}分！`);
                        new MsgBox(`获得隐藏奖励：${data.SCORE}分！`, icon_bonus);
                        this.score += data.SCORE;
                        this.updateScore(this.score);
                    }, data.DELAY * 1000);
                    break;
                case P_FUNC.SCORE_BONUS_REPEAT:
                    const repeatCount = data.PERIOD;
                    let counter = 0;
                    const repeat = setInterval(() => {
                        if (this.block !== currentBlockCount || this.state !== 'stop' || counter >= repeatCount) {
                            if (counter > 0) { // 如果一个都没有获得，那就不提示了
                                if (DEBUG) alert(`获得隐藏奖励：${data.SCORE}分x${counter}！(上限${repeatCount}次)`);
                                new MsgBox(`获得隐藏奖励：${data.SCORE}分x${counter}！(上限${repeatCount}次)`, icon_bonus);
                            }
                            return clearInterval(repeat);
                        }
                        counter ++;
                        this.score += data.SCORE;
                        this.updateScore(this.score);
                    }, 1000);
                    break;
                case P_FUNC.SPECIAL_EFFECT:
                    this.bottle.showEffect(data.SPRITE);
                    break;
                case P_FUNC.BONUS_AND_REBIRTH:
                    this.score += data.SCORE;
                    this.updateScore(this.score);
                    this.rebirth += 1; // 获得1次原地重生机会
                    if (DEBUG) alert(`获得道具：立即+${data.SCORE}分，获得1次原地复活机会！`);
                    break;
                default:
                    break;
            }
        }
    }

    createPopupBox(title, illus, icon) {
        if (this.popupAwait) this.popupBox.animateOut();
        this.popupBox = new PopupBox(title, illus, icon);
        this.popupAwait = true;
    }

    dismissPopupBox() {
        if (this.popupAwait) {
            this.popupBox.animateOut();
            this.popupAwait = false;
        }
    }

    checkBottleHit() {
        if (this.checkingHit && this.bottle.instance.position.y <= BLOCKCONFIG.height / 2 + 0.1 && this.bottle.status === 'jump_down' && this.bottle.flyingTime > TOTAL_FLYING_TIME) {
            this.checkingHit = false;

            if (this.hit === HIT_NEXT_BLOCK_NORMAL || this.hit === HIT_NEXT_BLOCK_CENTER) {
                this.state = 'stop';
                this.bottle.stop();
                this.removeLastPropsBox();
                this.bottle.instance.position.y = BLOCKCONFIG.height / 2;
                this.bottle.instance.position.x = this.bottle.destination[0];
                this.bottle.instance.position.z = this.bottle.destination[1];
                if (this.end) return;
                let initScore = 1;
                if (this.autoJumpLeft > 0) initScore <<= 1; // 自动连跳期间，分数翻倍
                if (Date.now() < this.doubleScoreEnd) initScore <<= 1; // 双倍分时间内，分数翻倍
                this.score += initScore; // 两个翻倍可叠加
                this.block ++;
                // 获得效果
                this.obtainEffect(this.block);
                if (this.block / LEVEL_SCORE_COUNT >= this.level) {
                    // 切换关卡
                    if (DEBUG) alert(`恭喜你完成第${this.level}关！`);
                    this.createPopupBox("恭喜", `你完成了第${this.level}关！`, icon_bonus);
                    this.level ++;
                    if (this.level > MAX_LEVEL) {
                        this.level --;
                        this.end = true;
                        this.endNotify();
                        return;
                    }
                    this.updateLevel(this.level);
                }
                this.updateScore(this.score);
                this.updateNextBlock();
            } else if (this.hit === HIT_BLOCK_CURRENT) {
                this.state = 'stop';
                this.bottle.stop();
                this.bottle.instance.position.y = BLOCKCONFIG.height / 2;
                this.bottle.instance.position.x = this.bottle.destination[0];
                this.bottle.instance.position.z = this.bottle.destination[1];
            }
            else {
                if (this.hit === GAME_OVER_CURRENT_BLOCK_BACK || this.hit === GAME_OVER_NEXT_BLOCK_BACK) {
                    stopAllAnimation();
                    this.bottle.stop();
                    if (this.rebirth > 0) {
                        this.rebirth --;
                        this.state = 'show';
                        this.addBottle(true);
                        return;
                    } else {
                        this.bottle.forerake();
                        audiomanager.fallBlockPlay();
                    }
                }
                else if (this.hit === GAME_OVER_NEXT_BLOCK_FRONT) {
                    stopAllAnimation();
                    this.bottle.stop();
                    if (this.rebirth > 0) {
                        this.rebirth --;
                        this.state = 'show';
                        this.addBottle(true);
                        return;
                    } else {
                        this.bottle.hypsokinesis();
                        audiomanager.fallBlockPlay();
                    }
                } else {
                    stopAllAnimation();
                    this.bottle.stop();
                    if (this.rebirth > 0) {
                        this.rebirth --;
                        this.state = 'show';
                        this.addBottle(true);
                        return;
                    } else {
                        this.bottle.fall();
                        audiomanager.fallPlanePlay();
                    }
                }
                this.state = 'over';
                this.removeTouchEvent();
                setTimeout(() => {
                    this.callback.showGameOverStage();
                }, 1500);
            }
        }
    }

    getHitStatus(bottle, currentBlock, nextBlock, initY) {
        let flyingTime = bottle.velocity.vy / this.gravity * 2;
        initY = initY || +bottle.instance.position.y.toFixed(2);
        let destinationY = BLOCKCONFIG.height / 2;
        let differenceY = destinationY;
        let time = +((-bottle.velocity.vy + Math.sqrt(Math.pow(bottle.velocity.vy, 2) - 2 * this.gravity * differenceY)) / -this.gravity).toFixed(2);
        flyingTime -= time;
        flyingTime = +flyingTime.toFixed(2);
        let destination = [];
        let bottlePosition = new THREE.Vector2(bottle.instance.position.x, bottle.instance.position.z);
        let translate = new THREE.Vector2(this.axis.x, this.axis.z).setLength(bottle.velocity.vx * flyingTime);
        bottlePosition.add(translate);
        bottle.destination = [+bottlePosition.x.toFixed(2), +bottlePosition.y.toFixed(2)];
        destination.push(+bottlePosition.x.toFixed(2), +bottlePosition.y.toFixed(2));
        let result1, result2;
        // return HIT_NEXT_BLOCK_CENTER;
        if (nextBlock) {
            let nextDiff = Math.pow(destination[0] - nextBlock.instance.position.x, 2) + Math.pow(destination[1] - nextBlock.instance.position.z, 2);
            let nextPolygon = nextBlock.getVertices();
            if (utils.pointInPolygon(destination, nextPolygon)) {
                if (Math.abs(nextDiff) < 5) {
                    return HIT_NEXT_BLOCK_NORMAL;
                } else {
                    return HIT_NEXT_BLOCK_CENTER;
                }
            } else if (utils.pointInPolygon([destination[0] - this.bottle.width, destination[1]], nextPolygon) || utils.pointInPolygon([destination[0], destination[1] + this.bottle.depth / 2], nextPolygon)) {
                result1 = GAME_OVER_NEXT_BLOCK_BACK;
            } else if (utils.pointInPolygon([destination[0], destination[1] - this.bottle.depth / 2], nextPolygon) || utils.pointInPolygon([destination[0] + this.bottle.depth / 2, destination[1]], nextPolygon)) {
                result1 = GAME_OVER_NEXT_BLOCK_FRONT;
            }
        }

        let currentPolygon = currentBlock.getVertices();
        if (utils.pointInPolygon(destination, currentPolygon)) {
            return HIT_BLOCK_CURRENT;
        } else if (utils.pointInPolygon([destination[0], destination[1] + this.bottle.depth], currentPolygon) || utils.pointInPolygon([destination[0] - this.bottle.width / 2, destination[1]], currentPolygon)) {
            if (result1) return GAME_OVER_BOTH;
            return GAME_OVER_CURRENT_BLOCK_BACK;
        }
        return result1 || result2 || 0;
    }

    updateNextBlock() {
        const nextData = P_LIST[this.block+1];
        // 如果下一个格子是特殊格子材质，则需要按照其给定的材质选择形状，否则随机挑选一个形状
        const type = (nextData && nextData.FTYPE === P_FUNC_TYPE.BLOCK)? nextData.BTYPE : (Math.round(Math.random()) ? 'cuboid' : 'cylinder')
        const direction = Math.round(Math.random());
        const width = Math.round(Math.random() * 6) + 10;
        const distance = Math.round(Math.random() * 25) + 20;
        this.nextDist = distance;
        this.currentBlock = this.nextBlock;
        const targetPosition = {};
        if (direction === 0) {
            targetPosition.x = this.currentBlock.instance.position.x + distance;
            targetPosition.y = this.currentBlock.instance.position.y;
            targetPosition.z = this.currentBlock.instance.position.z;
        }
        if (direction === 1) {
            targetPosition.x = this.currentBlock.instance.position.x;
            targetPosition.y = this.currentBlock.instance.position.y;
            targetPosition.z = this.currentBlock.instance.position.z - distance;
        }
        if (this.autoJumpLeft > 0) {
            this.bottle.instance.position.x = this.targetPosition.x;
            this.bottle.instance.position.z = this.targetPosition.z; // 现在的还是上一次的位置
        }
        this.targetPosition = targetPosition;
        // 如果下一个方块上面有道具，则在上面生成一个方盒作为提示（如果是方块特殊材质则无需）
        if (nextData && nextData.FTYPE === P_FUNC_TYPE.PROPS) {
            this.propsBox = new PropsBox(targetPosition.x, targetPosition.y + 10, targetPosition.z);
            this.scene.instance.add(this.propsBox.instance);
        }
        this.setDirection(direction);
        if (this.block >= MAX_LEVEL * LEVEL_SCORE_COUNT) return;
        const matIndex = parseInt(this.block / LEVEL_SCORE_COUNT); // 每5分钟切换一次方块材质（下一个关卡）
        const mat = nextData ? nextData.MAT : null;
        if (type === BLOCKTYPE.CUBOID) {
            this.nextBlock = new CuboidBlock(targetPosition.x, targetPosition.y, targetPosition.z, 'popup', mat); // 高度不能改变，所以长宽由材质决定，下同
        } else if (type === BLOCKTYPE.CYLINDER) {
            this.nextBlock = new CylinderBlock(targetPosition.x, targetPosition.y, targetPosition.z, 'popup', mat); // 如果不是方块特殊材质类，则MAT是undefined，会采用默认材质
        }
        this.scene.instance.add(this.nextBlock.instance);
        const cameraTargetPosition = {
            x: (this.currentBlock.instance.position.x + this.nextBlock.instance.position.x) / 2,
            y: (this.currentBlock.instance.position.y + this.nextBlock.instance.position.y) / 2,
            z: (this.currentBlock.instance.position.z + this.nextBlock.instance.position.z) / 2,
        }
        this.scene.updateCameraPosition(cameraTargetPosition);
        this.ground.updatePosition(cameraTargetPosition);
        if (this.autoJumpLeft > 0) {
            this.autoJumpLeft --;
            this.onTouchStart();
            setTimeout(() => {
                this.onTouchEnd();
            }, this.nextDist / TOTAL_FLYING_TIME * 4);
        }
    }
}