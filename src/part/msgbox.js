import msgbox_1 from '@images/msgbox/1.png';
import msgbox_2 from '@images/msgbox/2.png';
import msgbox_3 from '@images/msgbox/3.png';
import SDFText from '@part/scoreText';
import scene from '@scene';

class MsgBox {
    static zPos = 90; // 层级
    constructor(text, icon) {
      this.text = text;
      this.icon = icon;
      this.size = 2;
      this.group = new THREE.Group();
      this.mesh = null;
      this.textMesh = null;
  
      // 选择背景图片
      this.selectBackground();
  
      // 加载纹理并创建背景网格
      this.loadTexture();
    }
  
    // 根据文本长度选择背景图片
    selectBackground() {
      const lines = this.text.split('\n');
      let lineCnt = 0, newLines = '';
      // 遍历，对于过长的行，拆分
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].length <= 16) {
            newLines += lines[i] + '\n';
            lineCnt++;
        } else {
            while (lines[i].length > 0) {
                newLines += lines[i].slice(0, 16) + '\n';
                lines[i] = lines[i].slice(16);
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
    loadTexture() {
      const loader = new THREE.TextureLoader();
      loader.load(this.imagePath, (texture) => {
        this.createBackgroundMesh(texture);
        this.loadIcon();
        this.createTextMesh();
        this.addToScene();
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
      this.mesh.position.z = MsgBox.zPos; // 确保在上一个网格之上
      MsgBox.zPos += 0.1;
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
            icon.position.set(-16, 0, MsgBox.zPos); // 图标位置
            MsgBox.zPos += 0.1;
            this.group.add(icon);
        }, undefined, (err) => {
            console.error('Error loading icon texture:', err);
        });
    }
  
    // 创建文本网格
    createTextMesh() {
      const textUtil = new SDFText();
      textUtil.updateText(this.text, this.size);
      this.textMesh = textUtil.instance;
      this.textMesh.position.set(6, this.phaseOutHeight - this.size*2, MsgBox.zPos); // 确保在背景之上
      MsgBox.zPos += 0.1;
      this.group.add(this.textMesh);
      this.group.position.y = 60+this.phaseOutHeight; // 确保在屏幕上方
    }
  
    // 添加到场景
    addToScene() {
      scene.camera.instance.add(this.group);
      this.animateIn();
      this.textMesh.sync(() => {
        this.startTimer();
      });
    }

    animateIn() {
      const duration = 500; // 动画持续时间（毫秒）
      const startY = this.group.position.y;
      const endY = 40 - this.phaseOutHeight;
  
      const startTime = performance.now();
  
      const animate = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        this.group.position.y = startY + (endY - startY) * t;
  
        if (t < 1) {
          requestAnimationFrame(animate);
        }
      };
  
      requestAnimationFrame(animate);
    }
  
    // 启动定时器：4秒后执行动画
    startTimer() {
      this.timeoutId = setTimeout(() => {
        this.animateOut();
      }, 4000);
    }
  
    // 动画：向上移动并移除
    animateOut() {
      const duration = 1000; // 动画持续时间（毫秒）
      const startY = this.group.position.y;
      const endY = 60 + this.phaseOutHeight; // 移动距离
  
      const startTime = performance.now();
  
      const animate = (now) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        this.group.position.y = startY + (endY - startY) * t;
  
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
  
  export default MsgBox;