# JumpGame 音频管理规范

## 音频目录结构
1. 所有音频文件放在public/audio/目录下
   - 音效: public/audio/sfx/
   - 背景音乐: public/audio/bgm/

## 音频加载
1. 使用AudioManager统一加载音频(src/audiomanager/)
2. 游戏启动时预加载常用音效
3. 场景切换时按需加载背景音乐

## 播放控制
1. 音效播放使用playSfx()方法
2. 背景音乐使用playBgm()方法
3. 所有音频播放必须通过AudioManager

## 音量管理
1. 主音量控制通过setMasterVolume()
2. 音效和音乐有独立音量控制
3. 音量设置持久化到本地存储

## 性能优化
1. 常用音效使用音频池技术
2. 同时播放的音效数量限制为5个
3. 长时间未使用的音频自动释放

## 开发规范
1. 音频相关代码必须放在src/audiomanager/
2. 避免直接使用Web Audio API
3. 音频文件名必须符合命名规范
