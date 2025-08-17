# JumpGame 游戏逻辑开发指南

## 核心架构
1. 基于状态模式管理游戏流程
2. 使用事件系统(src/utils/event.js)进行模块通信
3. 主循环控制在src/game/controller.js

## 游戏状态
1. 定义在src/game/model.js
2. 主要状态：
   - INIT: 初始化
   - PLAYING: 游戏中
   - PAUSED: 暂停
   - GAME_OVER: 游戏结束
3. 状态变更必须通过setGameState()方法

## 主循环规范
1. 游戏逻辑更新在update()方法中
2. 渲染逻辑在render()方法中
3. 每帧执行顺序：
   - 处理输入
   - 更新游戏状态
   - 渲染场景
   - 触发帧事件

## 输入处理
1. 键盘输入通过InputManager处理
2. 触摸输入需要适配移动端
3. 输入事件统一命名：
   - input:keydown
   - input:keyup
   - input:tap

## 开发建议
1. 避免在主循环中执行耗时操作
2. 复杂逻辑拆分为小功能单元
3. 使用事件系统解耦模块
4. 重要状态变更必须触发事件
