# JumpGame 代码风格指南

## 文件组织规范
1. 所有源代码放在src目录下
2. 按功能模块划分目录：
   - game/: 游戏核心逻辑
   - scene/: 3D场景相关
   - part/: 游戏模型和角色
   - audiomanager/: 音频管理
   - utils/: 工具函数和辅助类
3. 每个模块必须有index.js作为入口文件

## 命名约定
1. 变量和函数：小驼峰式命名(userName)
2. 类名：大驼峰式命名(GameController)
3. 常量：全大写加下划线(MAX_SPEED)
4. 私有成员：以下划线开头(_privateMethod)

## 代码格式
1. 使用2个空格缩进
2. 字符串使用单引号
3. 每行不超过100个字符
4. 导入语句分组：
   - 第三方库
   - 项目模块
   - 相对路径导入
   - 样式文件

## 3D开发规范
1. Three.js对象命名添加类型后缀：
   - _mesh (网格)
   - _geo (几何体)
   - _mat (材质)
2. 动画相关代码放在utils/animation.js
3. 场景管理代码放在scene/目录
