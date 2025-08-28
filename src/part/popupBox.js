import msgbox_1 from '@images/msgbox/1.png';
import msgbox_2 from '@images/msgbox/2.png';
import msgbox_3 from '@images/msgbox/3.png';
import SDFText from '@part/scoreText';
import scene from '@scene';

class PopupBox {
    static zPos = 80; // 层级(msgbox从90开始，弹窗从80开始，保证都在msgbox之下)
    constructor(title, text, icon, callbackFunc) {
      this.title = title;
      this.titleSize = 3;
      this.text = text + "\n\n点击继续...";
      this.textSize = 2;
      this.icon = icon;
      this.group = new THREE.Group();
      this.mesh = null;
      this.out = false;

      this.titleUtil = null;
      this.textUtil = null;
  
      // 选择背景图片
      this.selectBackground();
  
      // 加载纹理并创建背景网格
      this.loadTexture(callbackFunc);
    }
  
    // 根据文本长度选择背景图片
    selectBackground() {
      const lines = this.text.split('\n');
      let lineCnt = 0, newLines = '';
      // 遍历，对于过长的行，拆分
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length <= 12) {
            newLines += lines[i] + '\n';
            lineCnt++;
        } else {
            while (lines[i].length > 0) {
                newLines += lines[i].slice(0, 12) + '\n';
                lines[i] = lines[i].slice(12);
                lineCnt++;
            }
        }
      }
      this.text = newLines.trim();

      if (lineCnt <= 2) {
        this.imagePath = msgbox_1;
      } else if (lineCnt <= 4) {
        this.imagePath = msgbox_2;
      } else {
        this.imagePath = msgbox_3;
      }
    }
  
    // 加载纹理并创建背景网格
    loadTexture(callbackFunc) {
      const loader = new THREE.TextureLoader();
      loader.load(this.imagePath, (texture) => {
        this.createBackgroundMesh(texture);
        this.loadIcon();
        this.createTextMesh();
        this.addToScene();
        this.textUtil.instance.sync(() => {
          if (callbackFunc) callbackFunc();
        })
      }, undefined, (err) => {
        console.error('Error loading background texture:', err);
      });
    }
  
    // 创建背景网格
    createBackgroundMesh(texture) {
      const img = texture.image;
      const aspect = img.width / img.height;
      const width = 50;
      const height = width / aspect;
      this.phaseOutHeight = height / 2;
  
      const geometry = new THREE.PlaneGeometry(width, height);
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        opacity: 0.6,
      });

      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.z = PopupBox.zPos; // 确保在上一个网格之上
      PopupBox.zPos += 0.1;
      this.group.add(this.mesh);
    }

    // 加载图标
    loadIcon() {
        const loader = new THREE.TextureLoader();
        loader.load(this.icon, (texture) => {
            const geometry = new THREE.PlaneGeometry(10, 10);
            const material = new THREE.MeshBasicMaterial({
                map: texture,
                transparent: true,
                opacity: 1,
            });
            const icon = new THREE.Mesh(geometry, material);
            icon.position.set(-16, 0, PopupBox.zPos); // 图标位置
            PopupBox.zPos += 0.1;
            this.group.add(icon);
        }, undefined, (err) => {
            console.error('Error loading icon texture:', err);
        });
    }
  
    // 创建文本网格
    createTextMesh() {
      // 创建标题
      if (!this.titleUtil) {
        this.titleUtil = new SDFText();
        const titleMesh = this.titleUtil.instance;
        titleMesh.position.set(6, this.phaseOutHeight - this.titleSize, PopupBox.zPos); // 标题位置
        PopupBox.zPos += 0.1;
        this.group.add(titleMesh);
      }
      this.titleUtil.updateText(this.title, this.titleSize);
      // 创建正文
      if (!this.textUtil) {
        this.textUtil = new SDFText();
        const textMesh = this.textUtil.instance;
        textMesh.position.set(5, this.phaseOutHeight - this.textSize*2 - this.titleSize*2, PopupBox.zPos); // 确保在背景之上
        PopupBox.zPos += 0.1;
        this.group.add(textMesh);

        this.group.position.y = 0; // 确保在屏幕正中间
        this.group.scale.set(0, 0, 0);
      }
      this.textUtil.updateText(this.text, this.textSize);
      return this.textUtil.instance;
    }

    updateText(text) {
      this.text = text;
      this.selectBackground();
      return this.createTextMesh();
    }
  
    // 添加到场景
    addToScene() {
      const p = setInterval(() => {
        if (scene && scene.camera && scene.camera.instance) {
          scene.camera.instance.add(this.group);
          this.animateIn();
          clearInterval(p);
        }
      }, 1000);
    }

    animateIn() { // 出现并放大 
      const duration = 500; // 动画持续时间（毫秒）
      const startScale = 0;
      const endScale = 1;
  
      const startTime = performance.now();
  
      const animate = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const s = startScale + (endScale - startScale) * t;
        this.group.scale.set(s, s, s);
  
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          const c = setInterval(() => {
            if (this.out) {
              this.animateOutAction();
              this.out = false;
            }
          }, 100);
        }
      };
  
      requestAnimationFrame(animate);
    }
  
    // 动画：缩小并移除
    animateOut() {
      this.out = true;
    }

    animateOutAction() { // 缩小并移除
      const duration = 500; // 动画持续时间（毫秒）
      const startScale = 1;
      const endScale = 0;
  
      const startTime = performance.now();
  
      const animate = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const s = startScale + (endScale - startScale) * t;
        this.group.scale.set(s, s, s);
  
        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          // 动画结束后从场景中移除
          scene.camera.instance.remove(this.group);
        }
      };
  
      requestAnimationFrame(animate);
    }
  }
  
  export default PopupBox;